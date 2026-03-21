// // // import { useState } from "react";
// // // import { Button } from "@/components/ui/button";
// // // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { Badge } from "@/components/ui/badge";
// // // import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// // // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // // import { Checkbox } from "@/components/ui/checkbox";
// // // import { Plus, Edit, Trash2, Clock, Calendar, Users } from "lucide-react";
// // // import { useToast } from "@/hooks/use-toast";

// // // interface TimeSlot {
// // //   id: string;
// // //   department: string;
// // //   dayOfWeek: string;
// // //   startTime: string;
// // //   endTime: string;
// // //   maxAppointments: number;
// // //   slotDuration: number; // in minutes
// // //   breakTime: number; // in minutes
// // //   isActive: boolean;
// // //   appointmentType: "consultation" | "procedure" | "emergency" | "followup";
// // // }

// // // const TimeSlotManagement = () => {
// // //   const { toast } = useToast();
// // //   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
// // //     {
// // //       id: "1",
// // //       department: "General OPD",
// // //       dayOfWeek: "Monday",
// // //       startTime: "09:00",
// // //       endTime: "17:00",
// // //       maxAppointments: 16,
// // //       slotDuration: 30,
// // //       breakTime: 0,
// // //       isActive: true,
// // //       appointmentType: "consultation"
// // //     },
// // //     {
// // //       id: "2",
// // //       department: "Radiology",
// // //       dayOfWeek: "Monday",
// // //       startTime: "08:00",
// // //       endTime: "20:00",
// // //       maxAppointments: 24,
// // //       slotDuration: 30,
// // //       breakTime: 15,
// // //       isActive: true,
// // //       appointmentType: "procedure"
// // //     },
// // //     {
// // //       id: "3",
// // //       department: "Pathology Lab",
// // //       dayOfWeek: "Monday",
// // //       startTime: "06:00",
// // //       endTime: "22:00",
// // //       maxAppointments: 32,
// // //       slotDuration: 15,
// // //       breakTime: 0,
// // //       isActive: true,
// // //       appointmentType: "procedure"
// // //     }
// // //   ]);

// // //   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
// // //   const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
// // //   const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
// // //   const [formData, setFormData] = useState({
// // //     department: "",
// // //     startTime: "",
// // //     endTime: "",
// // //     maxAppointments: 10,
// // //     slotDuration: 30,
// // //     breakTime: 0,
// // //     appointmentType: "consultation" as TimeSlot["appointmentType"],
// // //     selectedDays: [] as string[]
// // //   });

// // //   const departments = [
// // //     "General OPD",
// // //     "Radiology",
// // //     "Pathology Lab",
// // //     "In-house Pharmacy",
// // //     "Emergency",
// // //     "Surgery",
// // //     "ICU",
// // //     "CCU",
// // //     "NICU",
// // //     "PICU",
// // //     "General Ward",
// // //     "Private Ward",
// // //     "Semi-Private Ward",
// // //     "Isolation Ward",
// // //     "Burn Unit",
// // //     "Cardiac",
// // //     "Neuro",
// // //     "Maternity",
// // //     "Pediatric",
// // //     "Psychiatric",
// // //     "Rehabilitation",
// // //     "Step Down Unit",
// // //   ];

// // //   const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// // //   const appointmentTypes = ["consultation", "procedure", "emergency", "followup"];

// // //   const filteredSlots = selectedDepartment === "all" 
// // //     ? timeSlots 
// // //     : timeSlots.filter(slot => slot.department === selectedDepartment);

// // //   const handleSubmit = (e: React.FormEvent) => {
// // //     e.preventDefault();
    
// // //     if (editingSlot) {
// // //       setTimeSlots(prev => prev.map(slot => 
// // //         slot.id === editingSlot.id 
// // //           ? { ...slot, ...formData, dayOfWeek: slot.dayOfWeek, isActive: slot.isActive }
// // //           : slot
// // //       ));
// // //       toast({
// // //         title: "Time Slot Updated",
// // //         description: `Time slot for ${formData.department} has been updated.`,
// // //       });
// // //       setEditingSlot(null);
// // //     } else {
// // //       // Create time slots for selected days
// // //       const newSlots = formData.selectedDays.map(day => ({
// // //         id: `${Date.now()}-${day}`,
// // //         ...formData,
// // //         dayOfWeek: day,
// // //         isActive: true,
// // //         selectedDays: undefined
// // //       }));
      
// // //       setTimeSlots(prev => [...prev, ...newSlots]);
// // //       toast({
// // //         title: "Time Slots Added",
// // //         description: `Time slots created for ${formData.selectedDays.length} days.`,
// // //       });
// // //     }
    
// // //     setFormData({
// // //       department: "",
// // //       startTime: "",
// // //       endTime: "",
// // //       maxAppointments: 10,
// // //       slotDuration: 30,
// // //       breakTime: 0,
// // //       appointmentType: "consultation",
// // //       selectedDays: []
// // //     });
// // //     setIsAddDialogOpen(false);
// // //   };

// // //   const handleEdit = (slot: TimeSlot) => {
// // //     setEditingSlot(slot);
// // //     setFormData({
// // //       department: slot.department,
// // //       startTime: slot.startTime,
// // //       endTime: slot.endTime,
// // //       maxAppointments: slot.maxAppointments,
// // //       slotDuration: slot.slotDuration,
// // //       breakTime: slot.breakTime,
// // //       appointmentType: slot.appointmentType,
// // //       selectedDays: [slot.dayOfWeek]
// // //     });
// // //     setIsAddDialogOpen(true);
// // //   };

// // //   const handleDelete = (id: string) => {
// // //     const slot = timeSlots.find(s => s.id === id);
// // //     setTimeSlots(prev => prev.filter(s => s.id !== id));
// // //     toast({
// // //       title: "Time Slot Deleted",
// // //       description: `Time slot for ${slot?.department} on ${slot?.dayOfWeek} has been removed.`,
// // //     });
// // //   };

// // //   const toggleSlotStatus = (id: string) => {
// // //     setTimeSlots(prev => prev.map(slot => 
// // //       slot.id === id ? { ...slot, isActive: !slot.isActive } : slot
// // //     ));
// // //   };

// // //   const getTypeColor = (type: string) => {
// // //     switch (type) {
// // //       case "consultation":
// // //         return "bg-blue-100 text-blue-800";
// // //       case "procedure":
// // //         return "bg-purple-100 text-purple-800";
// // //       case "emergency":
// // //         return "bg-red-100 text-red-800";
// // //       case "followup":
// // //         return "bg-green-100 text-green-800";
// // //       default:
// // //         return "bg-gray-100 text-gray-800";
// // //     }
// // //   };

// // //   const handleDaySelection = (day: string, checked: boolean) => {
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       selectedDays: checked 
// // //         ? [...prev.selectedDays, day]
// // //         : prev.selectedDays.filter(d => d !== day)
// // //     }));
// // //   };

// // //   return (
// // //     <div className="space-y-6">
// // //       <div className="flex items-center justify-between">
// // //         <div>
// // //           <h2 className="text-2xl font-bold">Time Slot Management</h2>
// // //           <p className="text-muted-foreground">
// // //             Configure appointment time slots for different departments
// // //           </p>
// // //         </div>
// // //         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
// // //           <DialogTrigger asChild>
// // //             <Button onClick={() => setEditingSlot(null)}>
// // //               <Plus className="mr-2 h-4 w-4" />
// // //               Add Time Slots
// // //             </Button>
// // //           </DialogTrigger>
// // //           <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
// // //             <DialogHeader>
// // //               <DialogTitle>
// // //                 {editingSlot ? "Edit Time Slot" : "Add New Time Slots"}
// // //               </DialogTitle>
// // //               <DialogDescription>
// // //                 {editingSlot ? "Update time slot configuration" : "Create new time slots for departments"}
// // //               </DialogDescription>
// // //             </DialogHeader>
// // //             <form onSubmit={handleSubmit}>
// // //               <div className="grid gap-4 py-4">
// // //                 <div className="grid gap-2">
// // //                   <Label htmlFor="department">Department</Label>
// // //                   <Select 
// // //                     value={formData.department} 
// // //                     onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
// // //                     disabled={!!editingSlot}
// // //                   >
// // //                     <SelectTrigger>
// // //                       <SelectValue placeholder="Select department" />
// // //                     </SelectTrigger>
// // //                     <SelectContent>
// // //                       {departments.map(dept => (
// // //                         <SelectItem key={dept} value={dept}>{dept}</SelectItem>
// // //                       ))}
// // //                     </SelectContent>
// // //                   </Select>
// // //                 </div>

// // //                 {!editingSlot && (
// // //                   <div className="grid gap-2">
// // //                     <Label>Days of Week</Label>
// // //                     <div className="grid grid-cols-2 gap-2">
// // //                       {daysOfWeek.map(day => (
// // //                         <div key={day} className="flex items-center space-x-2">
// // //                           <Checkbox
// // //                             id={day}
// // //                             checked={formData.selectedDays.includes(day)}
// // //                             onCheckedChange={(checked) => handleDaySelection(day, !!checked)}
// // //                           />
// // //                           <Label htmlFor={day} className="text-sm">{day}</Label>
// // //                         </div>
// // //                       ))}
// // //                     </div>
// // //                   </div>
// // //                 )}

// // //                 <div className="grid grid-cols-2 gap-4">
// // //                   <div className="grid gap-2">
// // //                     <Label htmlFor="startTime">Start Time</Label>
// // //                     <Input
// // //                       id="startTime"
// // //                       type="time"
// // //                       value={formData.startTime}
// // //                       onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
// // //                       required
// // //                     />
// // //                   </div>
// // //                   <div className="grid gap-2">
// // //                     <Label htmlFor="endTime">End Time</Label>
// // //                     <Input
// // //                       id="endTime"
// // //                       type="time"
// // //                       value={formData.endTime}
// // //                       onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
// // //                       required
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 <div className="grid grid-cols-2 gap-4">
// // //                   <div className="grid gap-2">
// // //                     <Label htmlFor="slotDuration">Slot Duration (minutes)</Label>
// // //                     <Input
// // //                       id="slotDuration"
// // //                       type="number"
// // //                       value={formData.slotDuration}
// // //                       onChange={(e) => setFormData(prev => ({ ...prev, slotDuration: parseInt(e.target.value) || 30 }))}
// // //                       placeholder="30"
// // //                       min="15"
// // //                       step="15"
// // //                     />
// // //                   </div>
// // //                   <div className="grid gap-2">
// // //                     <Label htmlFor="breakTime">Break Time (minutes)</Label>
// // //                     <Input
// // //                       id="breakTime"
// // //                       type="number"
// // //                       value={formData.breakTime}
// // //                       onChange={(e) => setFormData(prev => ({ ...prev, breakTime: parseInt(e.target.value) || 0 }))}
// // //                       placeholder="0"
// // //                       min="0"
// // //                       step="5"
// // //                     />
// // //                   </div>
// // //                 </div>

// // //                 <div className="grid grid-cols-2 gap-4">
// // //                   <div className="grid gap-2">
// // //                     <Label htmlFor="maxAppointments">Max Appointments</Label>
// // //                     <Input
// // //                       id="maxAppointments"
// // //                       type="number"
// // //                       value={formData.maxAppointments}
// // //                       onChange={(e) => setFormData(prev => ({ ...prev, maxAppointments: parseInt(e.target.value) || 10 }))}
// // //                       placeholder="10"
// // //                       min="1"
// // //                     />
// // //                   </div>
// // //                   <div className="grid gap-2">
// // //                     <Label htmlFor="appointmentType">Appointment Type</Label>
// // //                     <Select 
// // //                       value={formData.appointmentType} 
// // //                       onValueChange={(value) => setFormData(prev => ({ ...prev, appointmentType: value as TimeSlot["appointmentType"] }))}
// // //                     >
// // //                       <SelectTrigger>
// // //                         <SelectValue />
// // //                       </SelectTrigger>
// // //                       <SelectContent>
// // //                         {appointmentTypes.map(type => (
// // //                           <SelectItem key={type} value={type}>{type}</SelectItem>
// // //                         ))}
// // //                       </SelectContent>
// // //                     </Select>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //               <DialogFooter>
// // //                 <Button type="submit">
// // //                   {editingSlot ? "Update Time Slot" : "Create Time Slots"}
// // //                 </Button>
// // //               </DialogFooter>
// // //             </form>
// // //           </DialogContent>
// // //         </Dialog>
// // //       </div>

// // //       <div className="flex items-center space-x-4">
// // //         <Label htmlFor="department-filter">Filter by Department:</Label>
// // //         <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
// // //           <SelectTrigger className="w-[200px]">
// // //             <SelectValue />
// // //           </SelectTrigger>
// // //           <SelectContent>
// // //             <SelectItem value="all">All Departments</SelectItem>
// // //             {departments.map(dept => (
// // //               <SelectItem key={dept} value={dept}>{dept}</SelectItem>
// // //             ))}
// // //           </SelectContent>
// // //         </Select>
// // //       </div>

// // //       <Card>
// // //         <CardHeader>
// // //           <CardTitle className="flex items-center">
// // //             <Clock className="mr-2 h-5 w-5" />
// // //             Time Slots Configuration
// // //           </CardTitle>
// // //           <CardDescription>
// // //             {filteredSlots.length} time slots configured
// // //             {selectedDepartment !== "all" && ` for ${selectedDepartment}`}
// // //           </CardDescription>
// // //         </CardHeader>
// // //         <CardContent>
// // //           <Table>
// // //             <TableHeader>
// // //               <TableRow>
// // //                 <TableHead>Department</TableHead>
// // //                 <TableHead>Day</TableHead>
// // //                 <TableHead>Time Range</TableHead>
// // //                 <TableHead>Slot Duration</TableHead>
// // //                 <TableHead>Max Appointments</TableHead>
// // //                 <TableHead>Type</TableHead>
// // //                 <TableHead>Status</TableHead>
// // //                 <TableHead>Actions</TableHead>
// // //               </TableRow>
// // //             </TableHeader>
// // //             <TableBody>
// // //               {filteredSlots.map((slot) => (
// // //                 <TableRow key={slot.id}>
// // //                   <TableCell className="font-medium">{slot.department}</TableCell>
// // //                   <TableCell>
// // //                     <div className="flex items-center">
// // //                       <Calendar className="mr-1 h-3 w-3" />
// // //                       {slot.dayOfWeek}
// // //                     </div>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <div className="flex items-center">
// // //                       <Clock className="mr-1 h-3 w-3" />
// // //                       {slot.startTime} - {slot.endTime}
// // //                     </div>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     {slot.slotDuration} min
// // //                     {slot.breakTime > 0 && (
// // //                       <span className="text-muted-foreground text-xs ml-1">
// // //                         (+{slot.breakTime}min break)
// // //                       </span>
// // //                     )}
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <div className="flex items-center">
// // //                       <Users className="mr-1 h-3 w-3" />
// // //                       {slot.maxAppointments}
// // //                     </div>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <Badge className={getTypeColor(slot.appointmentType)} variant="outline">
// // //                       {slot.appointmentType}
// // //                     </Badge>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <Button
// // //                       size="sm"
// // //                       variant={slot.isActive ? "default" : "outline"}
// // //                       onClick={() => toggleSlotStatus(slot.id)}
// // //                       className="w-16"
// // //                     >
// // //                       {slot.isActive ? "Active" : "Inactive"}
// // //                     </Button>
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <div className="flex space-x-2">
// // //                       <Button
// // //                         size="sm"
// // //                         variant="outline"
// // //                         onClick={() => handleEdit(slot)}
// // //                       >
// // //                         <Edit className="h-3 w-3" />
// // //                       </Button>
// // //                       <Button
// // //                         size="sm"
// // //                         variant="outline"
// // //                         onClick={() => handleDelete(slot.id)}
// // //                       >
// // //                         <Trash2 className="h-3 w-3" />
// // //                       </Button>
// // //                     </div>
// // //                   </TableCell>
// // //                 </TableRow>
// // //               ))}
// // //             </TableBody>
// // //           </Table>
// // //         </CardContent>
// // //       </Card>
// // //     </div>
// // //   );
// // // };

// // // export default TimeSlotManagement;

// // import { useState, useEffect } from "react";
// // import { supabase } from "@/integrations/supabase/client";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "@/components/ui/dialog";
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from "@/components/ui/table";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import { Plus, Edit, Trash2, Clock, Calendar, Users } from "lucide-react";
// // import { useToast } from "@/hooks/use-toast";

// // interface TimeSlot {
// //   id: string;
// //   department: string;
// //   dayOfWeek: string;
// //   startTime: string;
// //   endTime: string;
// //   department_id: string;
// //   facility_id: string; // Added to fix property error
// //   maxAppointments: number;
// //   slotDuration: number;
// //   breakTime: number;
// //   isActive: boolean;
// //   appointmentType: "consultation" | "procedure" | "emergency" | "followup";
// // }

// // interface TimeSlotManagementProps {
// //   facilityId: string;
// // }
// // interface CombinedStaffData extends TimeSlot {
// //   departmentObj: Department;
// //   facility: Facility;
// // }
// // interface Department {
// //   id: string;
// //   facility_id: string;
// //   type:
// //     | "OPD"
// //     | "Diagnostics"
// //     | "Pharmacy"
// //     | "Lab"
// //     | "Emergency"
// //     | "Surgery"
// //     | "ICU"
// //     | "Other";
// //   name: string;
// //   description: string;
// //   is_active: boolean;
// // }

// // interface Facility {
// //   id: string;
// //   facility_name: string;
// //   facility_type: string;
// //   city: string;
// //   state: string;
// // }

// // const TimeSlotManagement = ({ facilityId }: TimeSlotManagementProps) => {
// //   const { toast } = useToast();
// //   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
// //   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
// //   const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
// //   const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
// //   const [staff, setStaff] = useState<CombinedStaffData[]>([]);
// //   const [departments, setDepartments] = useState<Department[]>([]);
// //   const [facilities, setFacilities] = useState<Facility[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [editingtimeslot, setEditingtimeslot] = useState<CombinedStaffData | null>(null);
// //   const [selectedFacility, setSelectedFacility] = useState<string>("all");
// //   const [formData, setFormData] = useState({
// //     department: "",
// //     startTime: "",
// //     endTime: "",
// //     department_id: "",
// //     maxAppointments: 10,
// //     slotDuration: 30,
// //     breakTime: 0,
// //     appointmentType: "consultation" as TimeSlot["appointmentType"],
// //     selectedDays: [] as string[],
// //   });

// //   // const departments = [
// //   //   "General OPD",
// //   //   "Radiology",
// //   //   "Pathology Lab",
// //   //   "In-house Pharmacy",
// //   //   "Emergency",
// //   //   "Surgery",
// //   //   "ICU",
// //   // ];
// //   const daysOfWeek = [
// //     "Monday",
// //     "Tuesday",
// //     "Wednesday",
// //     "Thursday",
// //     "Friday",
// //     "Saturday",
// //     "Sunday",
// //   ];
// //   const appointmentTypes = [
// //     "consultation",
// //     "procedure",
// //     "emergency",
// //     "followup",
// //   ];

// //   // Fetch time slots from Supabase
// //   // const fetchSlots = async () => {
// //   //   const { data, error } = await supabase
// //   //     .from("time_slots")
// //   //     .select("*")
// //   //     .eq("facility_id", facilityId);
      
      
// //   //         /* ============================
// //   //            3. FETCH DEPARTMENTS
// //   //         ============================ */
// //   //         const { data: departmentsData, error: deptError } = await supabase
// //   //           .from("departments")
// //   //           .select("*")
// //   //           .eq("is_active", true);
      
// //   //         if (deptError) throw deptError;

// //   //           setDepartments(departmentsData || []);
      
// //   //         /* ============================
// //   //            4. FETCH FACILITIES
// //   //         ============================ */
       
      
// //   //         const departmentMap = new Map(departmentsData?.map((d) => [d.id, d]));
      
      
// //   //         /* ============================
// //   //            6. MERGE DATA
// //   //         ============================ */
// //   //         // Fix: staffData is not defined, so skip this or use data if needed
// //   //         // const combinedStaff: CombinedStaffData[] =
// //   //         //   data?.map((timeslot) => ({
// //   //         //     ...timeslot,
// //   //         //     departmentObj: departmentMap.get(timeslot.department_id),
// //   //         //     facility: facilityMap.get(timeslot.facility_id),
// //   //         //   })) || [];
      

// //   //   if (error) {
// //   //     console.error("Error fetching slots:", error);
// //   //     toast({
// //   //       title: "Error",
// //   //       description: "Failed to fetch time slots",
// //   //       variant: "destructive",
// //   //     });
// //   //     return;
// //   //   }

// //   //   if (data) {
// //   //     // Transform the database data to match our interface
// //   //     const transformedSlots: TimeSlot[] = data.map((slot: any) => {
// //   //         const dept = departments.find(d => d.id === slot.department_id);
// //   //         return {
// //   //       id: slot.id,
// //   //       // department: slot.slot_type || "General OPD",
// //   //       department: dept ? dept.name : slot.slot_type || "General OPD", // Use department name
// //   //       dayOfWeek: slot.day_of_week,
// //   //       startTime: slot.start_time,
// //   //       endTime: slot.end_time,
// //   //       department_id: slot.department_id,
// //   //       facility_id: slot.facility_id, // Added to match interface
// //   //       maxAppointments: slot.max_appointments || 10,
// //   //       slotDuration: slot.slot_duration || 30,
// //   //       breakTime: slot.break_time || 0,
// //   //       isActive: slot.is_available,
// //   //       appointmentType:
// //   //         (slot.slot_type as TimeSlot["appointmentType"]) || "consultation",
// //   //         }
// //   //     });
// //   //     setTimeSlots(transformedSlots);
// //   //   }
// //   // };
// //   const fetchSlots = async () => {
// //   try {
// //     setIsLoading(true);
    
// //     // Fetch departments first
// //     const { data: departmentsData, error: deptError } = await supabase
// //       .from("departments")
// //       .select("*")
// //       .eq("is_active", true);
    
// //     if (deptError) throw deptError;
// //     setDepartments(departmentsData || []);
    
// //     // Then fetch slots
// //     const { data, error } = await supabase
// //       .from("time_slots")
// //       .select("*")
// //       .eq("facility_id", facilityId);
    
// //     if (error) throw error;
    
// //     if (data) {
// //       const transformedSlots: TimeSlot[] = data.map((slot: any) => {
// //         const dept = departmentsData?.find(d => d.id === slot.department_id);
// //         return {
// //           id: slot.id,
// //           department: dept ? dept.name : slot.slot_type || "General OPD",
// //           dayOfWeek: slot.day_of_week,
// //           startTime: slot.start_time,
// //           endTime: slot.end_time,
// //           department_id: slot.department_id,
// //           facility_id: slot.facility_id,
// //           maxAppointments: slot.max_appointments || 10,
// //           slotDuration: slot.slot_duration || 30,
// //           breakTime: slot.break_time || 0,
// //           isActive: slot.is_available,
// //           appointmentType: (slot.slot_type as TimeSlot["appointmentType"]) || "consultation",
// //         };
// //       });
// //       setTimeSlots(transformedSlots);
// //     }
// //   } catch (error: any) {
// //     console.error("Error fetching data:", error);
// //     toast({
// //       title: "Error",
// //       description: "Failed to fetch data",
// //       variant: "destructive",
// //     });
// //   } finally {
// //     setIsLoading(false);
// //   }
// // };

// //   // Fix: selectedFacility and facility_id errors
// //   // const filteredStaff = timeSlots.filter((s) => {
// //   //   const departmentMatch =
// //   //     selectedDepartment === "all" || s.department_id === selectedDepartment;
// //   //   const facilityMatch =
// //   //     selectedFacility === "all" || s.facility_id === selectedFacility;
// //   //   return departmentMatch && facilityMatch;
// //   // });

// //   useEffect(() => {
// //     if (facilityId) {
// //       fetchSlots();
// //     }
// //   }, [facilityId]);

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     const {
// //       data: { user },
// //       error: userError,
// //     } = await supabase.auth.getUser();

// //     if (userError || !user) {
// //       toast({
// //         title: "Error",
// //         description: "Please login to manage time slots",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     try {
// //       if (editingSlot) {
// //         // Update existing slot
// //         const { error } = await supabase
// //           .from("time_slots")
// //           .update({
// //             start_time: formData.startTime,
// //             end_time: formData.endTime,
// //             slot_type: formData.department,
// //             slot_duration: formData.slotDuration,
// //             // break_time: formData.breakTime,
// //             // max_appointments: formData.maxAppointments,
// //             day_of_week: editingSlot.dayOfWeek, // Keep the same day when editing
// //             is_available: editingSlot.isActive,
// //             updated_at: new Date().toISOString(),
// //           })
// //           .eq("id", editingSlot.id);

// //         if (error) throw error;

// //         toast({
// //           title: "Time Slot Updated",
// //           description: `Time slot for ${formData.department} has been updated.`,
// //         });
// //         setEditingSlot(null);
// //       } else {
// //         // Create new slots for each selected day
// //         const rows = formData.selectedDays.map((day) => ({
// //           doctor_id: user.id,
// //           // facility_id: user.id,
// //           facility_id: facilityId,
// // department_id: formData.department_id,
// //           start_time: formData.startTime,
// //           end_time: formData.endTime,
// //           slot_type: formData.department,
// //           // slot_duration: formData.slotDuration,
// //           // break_time: formData.breakTime,
// //           // max_appointments: formData.maxAppointments,
// //           day_of_week: day,
// //           is_available: true,
// //           created_at: new Date().toISOString(),
// //           updated_at: new Date().toISOString(),
// //         }));

// //         const { error } = await supabase.from("time_slots").insert(rows);

// //         if (error) throw error;

// //         toast({
// //           title: "Time Slots Added",
// //           description: `Time slots created for ${formData.selectedDays.length} days.`,
// //         });
// //       }

// //       // Reset form and fetch updated data
// //       setFormData({
// //         department: "",
// //         startTime: "",
// //         endTime: "",
// //         department_id: "",
// //         maxAppointments: 10,
// //         slotDuration: 30,
// //         breakTime: 0,
// //         appointmentType: "consultation",
// //         selectedDays: [],
// //       });
// //       setIsAddDialogOpen(false);
// //       fetchSlots();
// //     } catch (error: any) {
// //       console.error("Error saving time slot:", error);
// //       toast({
// //         title: "Error",
// //         description: error.message || "Failed to save time slot",
// //         variant: "destructive",
// //       });
// //     }
// //   };

// //   const handleEdit = (slot: TimeSlot) => {
// //     setEditingSlot(slot);
// //       const selectedDept = departments.find(dept => dept.id === slot.department_id);
// //     setFormData({
// //       // department: slot.department,
// //       department: selectedDept ? selectedDept.name : slot.department,
// //       startTime: slot.startTime,
// //       endTime: slot.endTime,
// //       maxAppointments: slot.maxAppointments,
// //       department_id: slot.department_id,
// //       slotDuration: slot.slotDuration,
// //       breakTime: slot.breakTime,
// //       appointmentType: slot.appointmentType,
// //       selectedDays: [slot.dayOfWeek],
// //     });
// //     setIsAddDialogOpen(true);
// //   };

// //   const handleDelete = async (id: string) => {
// //     try {
// //       const slot = timeSlots.find((s) => s.id === id);
// //       const { error } = await supabase.from("time_slots").delete().eq("id", id);

// //       if (error) throw error;

// //       toast({
// //         title: "Time Slot Deleted",
// //         description: `Time slot for ${slot?.department} on ${slot?.dayOfWeek} has been removed.`,
// //       });
// //       fetchSlots();
// //     } catch (error: any) {
// //       toast({
// //         title: "Error",
// //         description: error.message || "Failed to delete time slot",
// //         variant: "destructive",
// //       });
// //     }
// //   };

// //   const toggleSlotStatus = async (id: string) => {
// //     try {
// //       const slot = timeSlots.find((s) => s.id === id);
// //       if (!slot) return;

// //       const { error } = await supabase
// //         .from("time_slots")
// //         .update({ is_available: !slot.isActive })
// //         .eq("id", id);

// //       if (error) throw error;

// //       setTimeSlots((prev) =>
// //         prev.map((slot) =>
// //           slot.id === id ? { ...slot, isActive: !slot.isActive } : slot
// //         )
// //       );
// //     } catch (error: any) {
// //       toast({
// //         title: "Error",
// //         description: error.message || "Failed to update slot status",
// //         variant: "destructive",
// //       });
// //     }
// //   };

// //   const getTypeColor = (type: string) => {
// //     switch (type) {
// //       case "consultation":
// //         return "bg-blue-100 text-blue-800";
// //       case "procedure":
// //         return "bg-purple-100 text-purple-800";
// //       case "emergency":
// //         return "bg-red-100 text-red-800";
// //       case "followup":
// //         return "bg-green-100 text-green-800";
// //       default:
// //         return "bg-gray-100 text-gray-800";
// //     }
// //   };

// //   const handleDaySelection = (day: string, checked: boolean) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       selectedDays: checked
// //         ? [...prev.selectedDays, day]
// //         : prev.selectedDays.filter((d) => d !== day),
// //     }));
// //   };

// // const filteredSlots =
// //   selectedDepartment === "all"
// //     ? timeSlots
// //     : timeSlots.filter((slot) => slot.department_id === selectedDepartment); 
// //   return (
// //     <div className="space-y-6">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h2 className="text-2xl font-bold">Time Slot Management</h2>
// //           <p className="text-muted-foreground">
// //             Configure appointment time slots for different departments
// //           </p>
// //         </div>
// //         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
// //           <DialogTrigger asChild>
// //             <Button onClick={() => setEditingSlot(null)}>
// //               <Plus className="mr-2 h-4 w-4" />
// //               Add Time Slots
// //             </Button>
// //           </DialogTrigger>
// //           <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
// //             <DialogHeader>
// //               <DialogTitle>
// //                 {editingSlot ? "Edit Time Slot" : "Add New Time Slots"}
// //               </DialogTitle>
// //               <DialogDescription>
// //                 {editingSlot
// //                   ? "Update time slot configuration"
// //                   : "Create new time slots for departments"}
// //               </DialogDescription>
// //             </DialogHeader>
// //             <form onSubmit={handleSubmit}>
// //               <div className="grid gap-4 py-4">
// //                 {/* <div className="grid gap-2">
// //                   <Label htmlFor="department">Department</Label>
// //                   <Select
// //                     value={formData.department}
// //                     onValueChange={(value) =>
// //                       setFormData((prev) => ({ ...prev, department: value }))
// //                     }
// //                   >
// //                     <SelectTrigger>
// //                       <SelectValue placeholder="Select department" />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {departments.map((dept) => (
// //                         <SelectItem key={dept} value={dept}>
// //                           {dept}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div> */}
// //                  {/* <div className="grid gap-2">
// //                                     <Label htmlFor="department_id">Department</Label>
// //                                     <Select
// //                                       value={formData.department_id}
// //                                       onValueChange={(value) =>
// //                                         setFormData((prev) => ({
// //                                           ...prev,
// //                                           department_id: value,
// //                                         }))
// //                                       }
// //                                       required
// //                                     >
// //                                       <SelectTrigger>
// //                                         <SelectValue placeholder="Select department" />
// //                                       </SelectTrigger>
// //                                       <SelectContent>
// //                                         {departments.map((dept) => (
// //                                           <SelectItem key={dept.id} value={dept.id}>
// //                                             {dept.type} — {dept.name}
// //                                           </SelectItem>
// //                                         ))}
// //                                       </SelectContent>
                
// //                                       {/* <SelectContent>
// //                                         {departments.map((dept) => (
// //                                           <SelectItem key={dept.id} value={dept.id}>
// //                                             {dept.name}
// //                                           </SelectItem>
// //                                         ))}
// //                                       </SelectContent> 
// //                                     </Select>
// //                                   </div> */}
// //                                   <div className="grid gap-2">
// //   <Label htmlFor="department_id">Department</Label>
// //   <Select
// //     value={formData.department_id}
// //     onValueChange={(value) => {
// //       const selectedDept = departments.find(dept => dept.id === value);
// //       setFormData((prev) => ({
// //         ...prev,
// //         department_id: value,
// //         department: selectedDept ? selectedDept.name : "", // Also update the department name
// //       }));
// //     }}
// //     required
// //   >
// //     <SelectTrigger>
// //       <SelectValue placeholder="Select department" />
// //     </SelectTrigger>
// //     <SelectContent>
// //       {departments.map((dept) => (
// //         <SelectItem key={dept.id} value={dept.id}>
// //           {dept.type} — {dept.name}
// //         </SelectItem>
// //       ))}
// //     </SelectContent>
// //   </Select>
// // </div>

// //                 {!editingSlot && (
// //                   <div className="grid gap-2">
// //                     <Label>Days of Week</Label>
// //                     <div className="grid grid-cols-2 gap-2">
// //                       {daysOfWeek.map((day) => (
// //                         <div key={day} className="flex items-center space-x-2">
// //                           <Checkbox
// //                             id={day}
// //                             checked={formData.selectedDays.includes(day)}
// //                             onCheckedChange={(checked) =>
// //                               handleDaySelection(day, !!checked)
// //                             }
// //                           />
// //                           <Label htmlFor={day} className="text-sm">
// //                             {day}
// //                           </Label>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 )}

// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="startTime">Start Time</Label>
// //                     <Input
// //                       id="startTime"
// //                       type="time"
// //                       value={formData.startTime}
// //                       onChange={(e) =>
// //                         setFormData((prev) => ({
// //                           ...prev,
// //                           startTime: e.target.value,
// //                         }))
// //                       }
// //                       required
// //                     />
// //                   </div>
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="endTime">End Time</Label>
// //                     <Input
// //                       id="endTime"
// //                       type="time"
// //                       value={formData.endTime}
// //                       onChange={(e) =>
// //                         setFormData((prev) => ({
// //                           ...prev,
// //                           endTime: e.target.value,
// //                         }))
// //                       }
// //                       required
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="slotDuration">
// //                       Slot Duration (minutes)
// //                     </Label>
// //                     <Input
// //                       id="slotDuration"
// //                       type="number"
// //                       value={formData.slotDuration}
// //                       onChange={(e) =>
// //                         setFormData((prev) => ({
// //                           ...prev,
// //                           slotDuration: parseInt(e.target.value) || 30,
// //                         }))
// //                       }
// //                       placeholder="30"
// //                       min="15"
// //                       step="15"
// //                     />
// //                   </div>
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="breakTime">Break Time (minutes)</Label>
// //                     <Input
// //                       id="breakTime"
// //                       type="number"
// //                       value={formData.breakTime}
// //                       onChange={(e) =>
// //                         setFormData((prev) => ({
// //                           ...prev,
// //                           breakTime: parseInt(e.target.value) || 0,
// //                         }))
// //                       }
// //                       placeholder="0"
// //                       min="0"
// //                       step="5"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="maxAppointments">Max Appointments</Label>
// //                     <Input
// //                       id="maxAppointments"
// //                       type="number"
// //                       value={formData.maxAppointments}
// //                       onChange={(e) =>
// //                         setFormData((prev) => ({
// //                           ...prev,
// //                           maxAppointments: parseInt(e.target.value) || 10,
// //                         }))
// //                       }
// //                       placeholder="10"
// //                       min="1"
// //                     />
// //                   </div>
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="appointmentType">Appointment Type</Label>
// //                     <Select
// //                       value={formData.appointmentType}
// //                       onValueChange={(value) =>
// //                         setFormData((prev) => ({
// //                           ...prev,
// //                           appointmentType: value as TimeSlot["appointmentType"],
// //                         }))
// //                       }
// //                     >
// //                       <SelectTrigger>
// //                         <SelectValue />
// //                       </SelectTrigger>
// //                       <SelectContent>
// //                         {appointmentTypes.map((type) => (
// //                           <SelectItem key={type} value={type}>
// //                             {type}
// //                           </SelectItem>
// //                         ))}
// //                       </SelectContent>
// //                     </Select>
// //                   </div>
// //                 </div>
// //               </div>
// //               <DialogFooter>
// //                 <Button type="submit">
// //                   {editingSlot ? "Update Time Slot" : "Create Time Slots"}
// //                 </Button>
// //               </DialogFooter>
// //             </form>
// //           </DialogContent>
// //         </Dialog>
// //       </div>

// //       <div className="flex items-center space-x-4">
// //         <Label htmlFor="department-filter">Filter by Department:</Label>
// //         <Select
// //           value={selectedDepartment}
// //           onValueChange={setSelectedDepartment}
// //         >
// //           <SelectTrigger className="w-[200px]">
// //             <SelectValue />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectItem value="all">All Departments</SelectItem>
// //             {departments.map((dept) => (
// //               <SelectItem key={dept.id} value={dept.id}>
// //                 {dept.type} — {dept.name}
// //               </SelectItem>
// //             ))}
// //           </SelectContent>
// //         </Select>
// //       </div>

// //       <Card>
// //         <CardHeader>
// //           <CardTitle className="flex items-center">
// //             <Clock className="mr-2 h-5 w-5" />
// //             Time Slots Configuration
// //           </CardTitle>
// //           <CardDescription>
// //             {filteredSlots.length} time slots configured
// //             {selectedDepartment !== "all" && ` for ${selectedDepartment}`}
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <Table>
// //             <TableHeader>
// //               <TableRow>
// //                 <TableHead>Department</TableHead>
// //                 <TableHead>Day</TableHead>
// //                 <TableHead>Time Range</TableHead>
// //                 <TableHead>Slot Duration</TableHead>
// //                 <TableHead>Max Appointments</TableHead>
// //                 <TableHead>Type</TableHead>
// //                 <TableHead>Status</TableHead>
// //                 <TableHead>Actions</TableHead>
// //               </TableRow>
// //             </TableHeader>
// //             <TableBody>
// //               {filteredSlots.map((slot) => (
// //                 <TableRow key={slot.id}>
// //                   <TableCell className="font-medium">
// //                     {slot.department}
// //                   </TableCell>
// //                   <TableCell>
// //                     <div className="flex items-center">
// //                       <Calendar className="mr-1 h-3 w-3" />
// //                       {slot.dayOfWeek}
// //                     </div>
// //                   </TableCell>
// //                   <TableCell>
// //                     <div className="flex items-center">
// //                       <Clock className="mr-1 h-3 w-3" />
// //                       {slot.startTime} - {slot.endTime}
// //                     </div>
// //                   </TableCell>
// //                   <TableCell>
// //                     {slot.slotDuration} min
// //                     {slot.breakTime > 0 && (
// //                       <span className="text-muted-foreground text-xs ml-1">
// //                         (+{slot.breakTime}min break)
// //                       </span>
// //                     )}
// //                   </TableCell>
// //                   <TableCell>
// //                     <div className="flex items-center">
// //                       <Users className="mr-1 h-3 w-3" />
// //                       {slot.maxAppointments}
// //                     </div>
// //                   </TableCell>
// //                   <TableCell>
// //                     <Badge
// //                       className={getTypeColor(slot.appointmentType)}
// //                       variant="outline"
// //                     >
// //                       {slot.appointmentType}
// //                     </Badge>
// //                   </TableCell>
// //                   <TableCell>
// //                     <Button
// //                       size="sm"
// //                       variant={slot.isActive ? "default" : "outline"}
// //                       onClick={() => toggleSlotStatus(slot.id)}
// //                       className="w-16"
// //                     >
// //                       {slot.isActive ? "Active" : "Inactive"}
// //                     </Button>
// //                   </TableCell>
// //                   <TableCell>
// //                     <div className="flex space-x-2">
// //                       <Button
// //                         size="sm"
// //                         variant="outline"
// //                         onClick={() => handleEdit(slot)}
// //                       >
// //                         <Edit className="h-3 w-3" />
// //                       </Button>
// //                       <Button
// //                         size="sm"
// //                         variant="outline"
// //                         onClick={() => handleDelete(slot.id)}
// //                       >
// //                         <Trash2 className="h-3 w-3" />
// //                       </Button>
// //                     </div>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default TimeSlotManagement;


// import { useState, useEffect } from "react";
// import { supabase } from "@/integrations/supabase/client";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Plus, Edit, Trash2, Clock, Calendar, Users } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import mixpanelInstance from "@/utils/mixpanel";

// interface TimeSlot {
//   id: string;
//   department: string;
//   dayOfWeek: string;
//   startTime: string;
//   endTime: string;
//   department_id: string;
//   facility_id: string;
//   maxAppointments: number;
//   slotDuration: number;
//   breakTime: number;
//   isActive: boolean;
//   appointmentType: "consultation" | "procedure" | "emergency" | "followup";
// }

// interface TimeSlotManagementProps {
//   facilityId: string;
// }

// interface Department {
//   id: string;
//   facility_id: string;
//   type:
//     | "OPD"
//     | "Diagnostics"
//     | "Pharmacy"
//     | "Lab"
//     | "Emergency"
//     | "Surgery"
//     | "ICU"
//     | "Other";
//   name: string;
//   description: string;
//   is_active: boolean;
// }

// const TimeSlotManagement = () => {
//   const { toast } = useToast();
//   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     department: "",
//     startTime: "",
//     endTime: "",
//     department_id: "",
//     facility_id: "",
//     maxAppointments: 10,
//     slotDuration: 30,
//     breakTime: 0,
//     appointmentType: "consultation" as TimeSlot["appointmentType"],
//     selectedDays: [] as string[],
//   });

 

//   const daysOfWeek = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ];
//   const appointmentTypes = [
//     "consultation",
//     "procedure",
//     "emergency",
//     "followup",
//     "booking",
//   ];

//   const trackTimeSlotAction = (action: string, slotData?: any, additionalData = {}) => {
//   mixpanelInstance.track('Time Slot Management Action', {
//     action,
//     slotId: slotData?.id,
//     departmentId: slotData?.department_id,
//     departmentName: slotData?.department,
//     dayOfWeek: slotData?.dayOfWeek,
//     appointmentType: slotData?.appointmentType,
//     ...additionalData
//   });
// };

//   // Facility state and loading
//   const [facilityId, setFacilityId] = useState<string | null>(null);
//   const [facilityLoading, setFacilityLoading] = useState(true);
//   const [facilityError, setFacilityError] = useState<string | null>(null);
// const [selectedDepartmentType, setSelectedDepartmentType] = useState<string>("all");
//   useEffect(() => {
//     const fetchFacilities = async () => {
//       setFacilityLoading(true);
//       setFacilityError(null);
//       try {
//         const { data, error } = await supabase
//           .from("facilities")
//           .select("id, facility_name, facility_type, city, state");
//         if (error) throw error;
//         if (data && data.length > 0) {
//           setFacilityId(data[0].id); // Use the first facility for now
//         } else {
//           setFacilityError("No facilities found.");
//         }
//       } catch (err: any) {
//         setFacilityError(err.message || "Failed to fetch facilities.");
//       } finally {
//         setFacilityLoading(false);
//       }
//     };
//     fetchFacilities();
//   }, []);

//   const fetchSlots = async () => {
//     try {
//       setIsLoading(true);
//       // Fetch departments first
//       let deptQuery = supabase
//         .from("departments")
//         .select("*")
//         .eq("is_active", true);
//       // console.log("facilityId prop:", facilityId);
// //      if (facilityId) {
// //   deptQuery = deptQuery.eq("facility_id", facilityId);
// // }
//       console.log("Fetching departments with query:", facilityId);
//       const { data: departmentsData, error: deptError } = await deptQuery;
//       console.log("Fetched departments:", departmentsData);
//       if (deptError) throw deptError;
//       setDepartments(departmentsData || []);

//       // Then fetch slots
//       let slotQuery = supabase
//         .from("time_slots")
//         .select("*");
//       if (facilityId) {
//         slotQuery = slotQuery.eq("facility_id", facilityId);
//       }
//       console.log("Fetching time slots with query:", slotQuery);
//       const { data, error } = await slotQuery;
//       if (error) throw error;
//       if (data) {
//         const transformedSlots: TimeSlot[] = data.map((slot: any) => {
//           const dept = departmentsData?.find(d => d.id === slot.department_id);
//           return {
//             id: slot.id,
//             department: dept ? dept.name : slot.slot_type || "General OPD",
//             dayOfWeek: slot.day_of_week,
//             startTime: slot.start_time,
//             endTime: slot.end_time,
//             department_id: slot.department_id,
//             facility_id: slot.facility_id,
//             maxAppointments: slot.max_appointments || 10,
//             slotDuration: slot.slot_duration || 30,
//             breakTime: slot.break_time || 0,
//             isActive: slot.is_available,
//             appointmentType: (slot.slot_type as TimeSlot["appointmentType"]) || "consultation",
//           };
//         });
//         setTimeSlots(transformedSlots);
//       }
//     } catch (error: any) {
//       console.error("Error fetching data:", error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch data",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (facilityId) {
//       fetchSlots();
//     }
//   }, [facilityId]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
// trackTimeSlotAction(editingSlot ? 'edit_attempt' : 'add_attempt', 
//     editingSlot, { 
//       selectedDays: formData.selectedDays.length,
//       startTime: formData.startTime,
//       endTime: formData.endTime,
//       appointmentType: formData.appointmentType
//     });
//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     if (userError || !user) {
//       toast({
//         title: "Error",
//         description: "Please login to manage time slots",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       if (editingSlot) {
//         // Update existing slot
//         const { error } = await supabase
//           .from("time_slots")
//           .update({
//             start_time: formData.startTime,
//             end_time: formData.endTime,
//             slot_type: formData.appointmentType, // Fixed: Use appointmentType instead of department
//             // slot_duration: formData.slotDuration,
//             // break_time: formData.breakTime,
//             // max_appointments: formData.maxAppointments,
//             facility_id: formData.facility_id,
//             department_id: formData.department_id,
//             day_of_week: editingSlot.dayOfWeek,
//             is_available: editingSlot.isActive,
//             updated_at: new Date().toISOString(),
//           })
//           .eq("id", editingSlot.id);

//         if (error) throw error;

//         toast({
//           title: "Time Slot Updated",
//           description: `Time slot for ${formData.department} has been updated.`,
//         });
//         setEditingSlot(null);
//       } else {
//         // Create new slots for each selected day
//         const rows = formData.selectedDays.map((day) => ({
//           facility_id: facilityId,
//           department_id: formData.department_id,
//           doctor_id: null, // Assuming doctor_id is same as department_id for now, adjust as needed
//           start_time: formData.startTime,
//           end_time: formData.endTime,
//           slot_type: formData.appointmentType,
//           // slot_duration: formData.slotDuration,
//           // break_time: formData.breakTime,
//           // max_appointments: formData.maxAppointments,
//           day_of_week: day,
//           is_available: true,
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//         }));

//         const { data, error } = await supabase.from("time_slots").insert(rows);
//         if (error) throw error;

//         toast({
//           title: "Time Slots Added",
//           description: `Time slots created for ${formData.selectedDays.length} days.`,
//         });
//       }

//       // Reset form and fetch updated data
//       setFormData({
//         department: "",
//         startTime: "",
//         endTime: "",
//         department_id: "",
//         facility_id: facilityId,
//         maxAppointments: 10,
//         slotDuration: 30,
//         breakTime: 0,
//         appointmentType: "consultation",
//         selectedDays: [],
//       });
//       setIsAddDialogOpen(false);
//       fetchSlots();
//       trackTimeSlotAction(editingSlot ? 'edit_success' : 'add_success', 
//       editingSlot || { department: formData.department, appointmentType: formData.appointmentType });
//     } catch (error: any) {
//       console.error("Error saving time slot:", error);
//       toast({
//         title: "Error",
//         description: error.message || "Failed to save time slot",
//         variant: "destructive",
//       });
//       trackTimeSlotAction(editingSlot ? 'edit_failed' : 'add_failed', 
//       undefined, { error: error.message });
//     }
//   };

//   const handleEdit = (slot: TimeSlot) => {
//     setEditingSlot(slot);
//     trackTimeSlotAction
//     const selectedDept = departments.find(dept => dept.id === slot.department_id);
//     setFormData({
//       department: selectedDept ? selectedDept.name : slot.department,
//       startTime: slot.startTime,
//       endTime: slot.endTime,
//       facility_id: slot.facility_id,
//       maxAppointments: slot.maxAppointments,
//       breakTime: slot.breakTime,
//       department_id: slot.department_id,
//       slotDuration: slot.slotDuration,
//       appointmentType: slot.appointmentType,
//       selectedDays: [slot.dayOfWeek],
//     });
//     setIsAddDialogOpen(true);
//   };

//   const handleDelete = async (id: string) => {
   
//     try {
//       const slot = timeSlots.find((s) => s.id === id);
//       trackTimeSlotAction('delete_attempt', slot);
//       const { error } = await supabase.from("time_slots").delete().eq("id", id);

//       if (error) throw error;

//       toast({
//         title: "Time Slot Deleted",
//         description: `Time slot for ${slot?.department} on ${slot?.dayOfWeek} has been removed.`,
//       });
//       fetchSlots();
//       trackTimeSlotAction('delete_success', slot);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to delete time slot",
//         variant: "destructive",
//       });
//       trackTimeSlotAction('delete_failed', undefined, { error: error.message });
//     }
//   };

//   const toggleSlotStatus = async (id: string) => {
//     try {
//       const slot = timeSlots.find((s) => s.id === id);
//       trackTimeSlotAction('toggle_status', slot, { 
//     fromStatus: slot?.isActive, 
//     toStatus: !slot?.isActive 
//   });
//       if (!slot) return;

//       // Toggle the value: if currently active, set to false; if inactive, set to true
//       const newStatus = !slot.isActive;

//       const { error } = await supabase
//         .from("time_slots")
//         .update({ is_available: newStatus })
//         .eq("id", id);

//       if (error) throw error;

//       setTimeSlots((prev) =>
//         prev.map((slot) =>
//           slot.id === id ? { ...slot, isActive: newStatus } : slot
//         )
//       );
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.message || "Failed to update slot status",
//         variant: "destructive",
//       });
//     }
//   };

//   const getTypeColor = (type: string) => {
//     switch (type) {
//       case "consultation":
//         return "bg-blue-100 text-blue-800";
//       case "procedure":
//         return "bg-purple-100 text-purple-800";
//       case "emergency":
//         return "bg-red-100 text-red-800";
//       case "followup":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const handleDaySelection = (day: string, checked: boolean) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedDays: checked
//         ? [...prev.selectedDays, day]
//         : prev.selectedDays.filter((d) => d !== day),
//     }));
//   };

//   const filteredSlots =
//     selectedDepartment === "all"
//       ? timeSlots
//       : timeSlots.filter((slot) => slot.department_id === selectedDepartment);
      

//   const filteredSlotsByType = selectedDepartmentType === "all" ? filteredSlots : filteredSlots.filter(slot => slot.appointmentType === selectedDepartmentType);

// // Add to filter changes
// const handleDepartmentFilter = (value: string) => {
//   trackTimeSlotAction('filter_by_department', undefined, { 
//     fromFilter: selectedDepartment, 
//     toFilter: value 
//   });
//   setSelectedDepartment(value);
// };

// const handleTypeFilter = (value: string) => {
//   trackTimeSlotAction('filter_by_type', undefined, { 
//     fromFilter: selectedDepartmentType, 
//     toFilter: value 
//   });
//   setSelectedDepartmentType(value);
// };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Time Slot Management</h2>
//           <p className="text-muted-foreground">
//             Configure appointment time slots for different departments
//           </p>
//         </div>
//         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//           <DialogTrigger asChild>
//             <Button  onClick={() => {
//     trackTimeSlotAction('add_time_slots_click');
//     setEditingSlot(null);
//     fetchSlots();
//     setIsAddDialogOpen(true);
//   }}>
//               <Plus className="mr-2 h-4 w-4" />
//               Add Time Slots
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>
//                 {editingSlot ? "Edit Time Slot" : "Add New Time Slots"}
//               </DialogTitle>
//               <DialogDescription>
//                 {editingSlot
//                   ? "Update time slot configuration"
//                   : "Create new time slots for departments"}
//               </DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleSubmit}>
//               <div className="grid gap-4 py-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="department_id">Department</Label>
//                   <Select
//                     value={formData.department_id}
//                     onValueChange={(value) => {
//                       const selectedDept = departments.find(dept => dept.id === value);
//                       setFormData((prev) => ({
//                         ...prev,
//                         department_id: value,
//                         department: selectedDept ? selectedDept.name : "",
//                       }));
//                     }}
//                     required
//                     disabled={!!editingSlot} // Disable department change when editing
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select department" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {departments.map((dept) => (
//                         <SelectItem key={dept.id} value={dept.id}>
//                           {dept.type} — {dept.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {!editingSlot && (
//                   <div className="grid gap-2">
//                     <Label>Days of Week</Label>
//                     <div className="grid grid-cols-2 gap-2">
//                       {daysOfWeek.map((day) => (
//                         <div key={day} className="flex items-center space-x-2">
//                           <Checkbox
//                             id={day}
//                             checked={formData.selectedDays.includes(day)}
//                             onCheckedChange={(checked) =>
//                               handleDaySelection(day, !!checked)
//                             }
//                           />
//                           <Label htmlFor={day} className="text-sm">
//                             {day}
//                           </Label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="startTime">Start Time</Label>
//                     <Input
//                       id="startTime"
//                       type="time"
//                       value={formData.startTime}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           startTime: e.target.value,
//                         }))
//                       }
                      
//                       required
//                     />
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="endTime">End Time</Label>
//                     <Input
//                       id="endTime"
//                       type="time"
//                       value={formData.endTime}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           endTime: e.target.value,
//                         }))
//                       }
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="slotDuration">
//                       Slot Duration (minutes)
//                     </Label>
//                     <Input
//                       id="slotDuration"
//                       type="number"
//                       value={formData.slotDuration}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           slotDuration: parseInt(e.target.value) || 30,
//                         }))
//                       }
//                       placeholder="30"
//                       min="15"
//                       step="15"
//                       required
//                     />
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="breakTime">Break Time (minutes)</Label>
//                     <Input
//                       id="breakTime"
//                       type="number"
//                       value={formData.breakTime}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           breakTime: parseInt(e.target.value) || 0,
//                         }))
//                       }
//                       placeholder="0"
//                       min="0"
//                       step="5"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="maxAppointments">Max Appointments</Label>
//                     <Input
//                       id="maxAppointments"
//                       type="number"
//                       value={formData.maxAppointments}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           maxAppointments: parseInt(e.target.value) || 10,
//                         }))
//                       }
//                       placeholder="10"
//                       min="1"
//                       required
//                     />
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="appointmentType">Appointment Type</Label>
//                     <Select
//                       value={formData.appointmentType}
//                       onValueChange={(value) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           appointmentType: value as TimeSlot["appointmentType"],
//                         }))
//                       }
//                       required
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {appointmentTypes.map((type) => (
//                           <SelectItem key={type} value={type}>
//                             {type.charAt(0).toUpperCase() + type.slice(1)}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button type="submit">
//                   {editingSlot ? "Update Time Slot" : "Create Time Slots"}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="flex items-center space-x-4">
//         <Label htmlFor="department-filter">Filter by Department:</Label>
//         <Select
//           value={selectedDepartment}
//           onValueChange={setSelectedDepartment}
//         >
//           <SelectTrigger className="w-[200px]">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Departments</SelectItem>
//             {departments.map((dept) => (
//               <SelectItem key={dept.id} value={dept.id}>
//                 {dept.type}{dept.name}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="flex items-center space-x-4">
//         <Label htmlFor="department-filter">Filter by Type:</Label>
//         <Select
//           value={selectedDepartmentType}
//           onValueChange={setSelectedDepartmentType}
//         >
//           <SelectTrigger className="w-[200px]">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Type</SelectItem>
//           {appointmentTypes.map((type) => (
//                           <SelectItem key={type} value={type}>
//                             {type.charAt(0).toUpperCase() + type.slice(1)}
//                           </SelectItem>
//                         ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Clock className="mr-2 h-5 w-5" />
//             Time Slots Configuration
//           </CardTitle>
//           <CardDescription>
//             {filteredSlots.length} time slots configured
//             {selectedDepartment !== "all" && ` for selected department`}
//           </CardDescription>
//         </CardHeader>
//         <CardContent 
//         // onClick={() => {
//         //   toast({
//         //     title: "Refresh Time Slots",
//         //     description: "Fetching the latest time slot and department details...",
//         //   });
//         //   setEditingSlot(null);
//         //   fetchSlots();
//         // }}
//         >
//           {isLoading ? (
//             <div className="text-center py-8">Loading time slots...</div>
//           ) : filteredSlots.length === 0 ? (
//             <div className="text-center py-8 text-muted-foreground">
//               No time slots found. Click "Add Time Slots" to create new ones.
//             </div>
//           ) : (
//             <Table >
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Department</TableHead>
//                   <TableHead>Day</TableHead>
//                   <TableHead>Time Range</TableHead>
//                   <TableHead>Slot Duration</TableHead>
//                   <TableHead>Max Appointments</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredSlots && filteredSlotsByType.map((slot) => (
//                   <TableRow key={slot.id}>
//                     <TableCell className="font-medium">
//                       {slot.department}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center">
//                         <Calendar className="mr-1 h-3 w-3" />
//                         {slot.dayOfWeek}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center">
//                         <Clock className="mr-1 h-3 w-3" />
//                         {slot.startTime} - {slot.endTime}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       {slot.slotDuration} min
//                       {slot.breakTime > 0 && (
//                         <span className="text-muted-foreground text-xs ml-1">
//                           (+{slot.breakTime}min break)
//                         </span>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center">
//                         <Users className="mr-1 h-3 w-3" />
//                         {slot.maxAppointments}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge
//                         className={getTypeColor(slot.appointmentType)}
//                         variant="outline"
//                       >
//                         {slot.appointmentType.charAt(0).toUpperCase() + slot.appointmentType.slice(1)}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <Button
//                         size="sm"
//                         variant={slot.isActive ? "default" : "outline"}
//                         onClick={() => toggleSlotStatus(slot.id)}
//                         className="w-16"
//                       >
//                         {slot.isActive ? "Active" : "Inactive"}
//                       </Button>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex space-x-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleEdit(slot)}
//                         >
//                           <Edit className="h-3 w-3" />
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleDelete(slot.id)}
//                         >
//                           <Trash2 className="h-3 w-3" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default TimeSlotManagement;


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Clock, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mixpanelInstance from "@/utils/mixpanel";
import { useUser } from "@/hooks/useUser"; // Import useUser hook

interface TimeSlot {
  id: string;
  department: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  department_id: string;
  facility_id: string;
  maxAppointments: number;
  slotDuration: number;
  breakTime: number;
  isActive: boolean;
  appointmentType: "consultation" | "procedure" | "emergency" | "followup";
}

interface Department {
  id: string;
  facility_id: string;
  type:
    | "OPD"
    | "Diagnostics"
    | "Pharmacy"
    | "Lab"
    | "Emergency"
    | "Surgery"
    | "ICU"
    | "Other";
  name: string;
  description: string;
  is_active: boolean;
}

interface Facility {
  id: string;
  facility_name: string;
  admin_user_id: string;
}

const TimeSlotManagement = () => {
  const { toast } = useToast();
  const { user } = useUser(); // Get current user
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userFacility, setUserFacility] = useState<Facility | null>(null);
  const [formData, setFormData] = useState({
    department: "",
    startTime: "",
    endTime: "",
    department_id: "",
    facility_id: "",
    maxAppointments: 10,
    slotDuration: 30,
    breakTime: 0,
    appointmentType: "consultation" as TimeSlot["appointmentType"],
    selectedDays: [] as string[],
  });

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const appointmentTypes = [
    "consultation",
    "procedure",
    "emergency",
    "followup",
    "booking",
  ];

  const trackTimeSlotAction = (action: string, slotData?: any, additionalData = {}) => {
    mixpanelInstance.track('Time Slot Management Action', {
      action,
      slotId: slotData?.id,
      departmentId: slotData?.department_id,
      departmentName: slotData?.department,
      dayOfWeek: slotData?.dayOfWeek,
      appointmentType: slotData?.appointmentType,
      facilityId: userFacility?.id,
      facilityName: userFacility?.facility_name,
      ...additionalData
    });
  };

  // Get user's facility on component mount - similar to DepartmentManagement
  useEffect(() => {
    const getUserFacility = async () => {
      if (!user) return;

      try {
        // Find facility where admin_user_id = current user's ID
        const { data: facilityData, error: facilityError } = await supabase
          .from("facilities")
          .select("id, facility_name, admin_user_id")
          .eq("admin_user_id", user.id)
          .single();

        if (facilityError) {
          console.error("Facility error:", facilityError);
          if (facilityError.code !== "PGRST116") {
            toast({
              title: "Error",
              description: "Failed to load facility information",
              variant: "destructive",
            });
          }
          setUserFacility(null);
        } else if (facilityData) {
          setUserFacility(facilityData);
        }
      } catch (error: any) {
        console.error("Error fetching user facility:", error);
        setUserFacility(null);
      }
    };

    getUserFacility();
  }, [user]);

  const fetchSlots = async () => {
    if (!userFacility?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch departments for user's facility only
      const { data: departmentsData, error: deptError } = await supabase
        .from("departments")
        .select("*")
        .eq("facility_id", userFacility.id) // Filter by user's facility ID
        .eq("is_active", true);

      if (deptError) throw deptError;
      setDepartments(departmentsData || []);

      // Fetch slots for user's facility only
      const { data, error } = await supabase
        .from("time_slots")
        .select("*")
        .eq("facility_id", userFacility.id); // Filter by user's facility ID

      if (error) throw error;
      
      if (data) {
        const transformedSlots: TimeSlot[] = data.map((slot: any) => {
          const dept = departmentsData?.find(d => d.id === slot.department_id);
          return {
            id: slot.id,
            department: dept ? dept.name : slot.slot_type || "General OPD",
            dayOfWeek: slot.day_of_week,
            startTime: slot.start_time,
            endTime: slot.end_time,
            department_id: slot.department_id,
            facility_id: slot.facility_id,
            maxAppointments: slot.max_appointments || 10,
            slotDuration: slot.slot_duration || 30,
            breakTime: slot.break_time || 0,
            isActive: slot.is_available,
            appointmentType: (slot.slot_type as TimeSlot["appointmentType"]) || "consultation",
          };
        });
        setTimeSlots(transformedSlots);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userFacility?.id) {
      fetchSlots();
    }
  }, [userFacility]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userFacility?.id) {
      toast({
        title: "Error",
        description: "Facility information not found",
        variant: "destructive",
      });
      return;
    }

    trackTimeSlotAction(editingSlot ? 'edit_attempt' : 'add_attempt', 
      editingSlot, { 
        selectedDays: formData.selectedDays.length,
        startTime: formData.startTime,
        endTime: formData.endTime,
        appointmentType: formData.appointmentType
      });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast({
        title: "Error",
        description: "Please login to manage time slots",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingSlot) {
        // Update existing slot
        const { error } = await supabase
          .from("time_slots")
          .update({
            start_time: formData.startTime,
            end_time: formData.endTime,
            slot_type: formData.appointmentType,
            facility_id: userFacility.id, // Use user's facility ID
            department_id: formData.department_id,
            day_of_week: editingSlot.dayOfWeek,
            is_available: editingSlot.isActive,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingSlot.id)
          .eq("facility_id", userFacility.id); // Ensure user can only update their own facility slots

        if (error) throw error;

        toast({
          title: "Time Slot Updated",
          description: `Time slot for ${formData.department} has been updated.`,
        });
        setEditingSlot(null);
      } else {
        // Create new slots for each selected day
        const rows = formData.selectedDays.map((day) => ({
          facility_id: userFacility.id, // Use user's facility ID
          department_id: formData.department_id,
          doctor_id: null,
          start_time: formData.startTime,
          end_time: formData.endTime,
          slot_type: formData.appointmentType,
          day_of_week: day,
          is_available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        const { error } = await supabase.from("time_slots").insert(rows);
        if (error) throw error;

        toast({
          title: "Time Slots Added",
          description: `Time slots created for ${formData.selectedDays.length} days.`,
        });
      }

      // Reset form and fetch updated data
      setFormData({
        department: "",
        startTime: "",
        endTime: "",
        department_id: "",
        facility_id: userFacility.id,
        maxAppointments: 10,
        slotDuration: 30,
        breakTime: 0,
        appointmentType: "consultation",
        selectedDays: [],
      });
      setIsAddDialogOpen(false);
      fetchSlots();
      trackTimeSlotAction(editingSlot ? 'edit_success' : 'add_success', 
        editingSlot || { department: formData.department, appointmentType: formData.appointmentType });
    } catch (error: any) {
      console.error("Error saving time slot:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save time slot",
        variant: "destructive",
      });
      trackTimeSlotAction(editingSlot ? 'edit_failed' : 'add_failed', 
        undefined, { error: error.message });
    }
  };

  const handleEdit = (slot: TimeSlot) => {
    setEditingSlot(slot);
    const selectedDept = departments.find(dept => dept.id === slot.department_id);
    setFormData({
      department: selectedDept ? selectedDept.name : slot.department,
      startTime: slot.startTime,
      endTime: slot.endTime,
      facility_id: slot.facility_id,
      maxAppointments: slot.maxAppointments,
      breakTime: slot.breakTime,
      department_id: slot.department_id,
      slotDuration: slot.slotDuration,
      appointmentType: slot.appointmentType,
      selectedDays: [slot.dayOfWeek],
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!userFacility?.id) {
      toast({
        title: "Error",
        description: "Facility information not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const slot = timeSlots.find((s) => s.id === id);
      trackTimeSlotAction('delete_attempt', slot);
      
      const { error } = await supabase
        .from("time_slots")
        .delete()
        .eq("id", id)
        .eq("facility_id", userFacility.id); // Ensure user can only delete their own facility slots

      if (error) throw error;

      toast({
        title: "Time Slot Deleted",
        description: `Time slot for ${slot?.department} on ${slot?.dayOfWeek} has been removed.`,
      });
      fetchSlots();
      trackTimeSlotAction('delete_success', slot);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete time slot",
        variant: "destructive",
      });
      trackTimeSlotAction('delete_failed', undefined, { error: error.message });
    }
  };

  const toggleSlotStatus = async (id: string) => {
    if (!userFacility?.id) return;

    try {
      const slot = timeSlots.find((s) => s.id === id);
      trackTimeSlotAction('toggle_status', slot, { 
        fromStatus: slot?.isActive, 
        toStatus: !slot?.isActive 
      });
      if (!slot) return;

      const newStatus = !slot.isActive;

      const { error } = await supabase
        .from("time_slots")
        .update({ is_available: newStatus })
        .eq("id", id)
        .eq("facility_id", userFacility.id); // Ensure user can only update their own facility slots

      if (error) throw error;

      setTimeSlots((prev) =>
        prev.map((slot) =>
          slot.id === id ? { ...slot, isActive: newStatus } : slot
        )
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update slot status",
        variant: "destructive",
      });
    }
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
    setFormData((prev) => ({
      ...prev,
      selectedDays: checked
        ? [...prev.selectedDays, day]
        : prev.selectedDays.filter((d) => d !== day),
    }));
  };

  const filteredSlots =
    selectedDepartment === "all"
      ? timeSlots
      : timeSlots.filter((slot) => slot.department_id === selectedDepartment);

  // Add selectedDepartmentType state - MOVED UP BEFORE IT'S USED
  const [selectedDepartmentType, setSelectedDepartmentType] = useState<string>("all");

  const filteredSlotsByType = selectedDepartmentType === "all" ? filteredSlots : filteredSlots.filter(slot => slot.appointmentType === selectedDepartmentType);

  const handleDepartmentFilter = (value: string) => {
    trackTimeSlotAction('filter_by_department', undefined, { 
      fromFilter: selectedDepartment, 
      toFilter: value 
    });
    setSelectedDepartment(value);
  };

  const handleTypeFilter = (value: string) => {
    trackTimeSlotAction('filter_by_type', undefined, { 
      fromFilter: selectedDepartmentType, 
      toFilter: value 
    });
    setSelectedDepartmentType(value);
  };

 

  if (!userFacility && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Facility Assigned</h3>
          <p className="text-muted-foreground mt-2">
            You are not assigned as an admin of any facility. Please contact
            support or create a facility first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Time Slot Management</h2>
          <p className="text-muted-foreground">
            Configure appointment time slots for {userFacility?.facility_name || "your facility"}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              trackTimeSlotAction('add_time_slots_click');
              setEditingSlot(null);
              setIsAddDialogOpen(true);
            }}>
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
                {editingSlot
                  ? "Update time slot configuration"
                  : `Create new time slots for ${userFacility?.facility_name || "your facility"}`}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="department_id">Department / Services</Label>
                  <Select
                    value={formData.department_id}
                    onValueChange={(value) => {
                      const selectedDept = departments.find(dept => dept.id === value);
                      setFormData((prev) => ({
                        ...prev,
                        department_id: value,
                        department: selectedDept ? selectedDept.name : "",
                      }));
                    }}
                    required
                    disabled={!!editingSlot}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.type}{dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {!editingSlot && (
                  <div className="grid gap-2">
                    <Label>Days of Week</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={day}
                            checked={formData.selectedDays.includes(day)}
                            onCheckedChange={(checked) =>
                              handleDaySelection(day, !!checked)
                            }
                          />
                          <Label htmlFor={day} className="text-sm">
                            {day}
                          </Label>
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          startTime: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          endTime: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="slotDuration">
                      Slot Duration (minutes)
                    </Label>
                    <Input
                      id="slotDuration"
                      type="number"
                      value={formData.slotDuration}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          slotDuration: parseInt(e.target.value) || 30,
                        }))
                      }
                      placeholder="30"
                      min="15"
                      step="15"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="breakTime">Break Time (minutes)</Label>
                    <Input
                      id="breakTime"
                      type="number"
                      value={formData.breakTime}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          breakTime: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                      min="0"
                      step="5"
                      required
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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          maxAppointments: parseInt(e.target.value) || 10,
                        }))
                      }
                      placeholder="10"
                      min="1"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="appointmentType">Appointment Type</Label>
                    <Select
                      value={formData.appointmentType}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          appointmentType: value as TimeSlot["appointmentType"],
                        }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
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

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="space-y-2">
          <Label htmlFor="department-filter">Filter by Department:</Label>
          <Select
            value={selectedDepartment}
            onValueChange={handleDepartmentFilter}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.type}{dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type-filter">Filter by Type:</Label>
          <Select
            value={selectedDepartmentType}
            onValueChange={handleTypeFilter}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {appointmentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Time Slots Configuration - {userFacility?.facility_name}
          </CardTitle>
          <CardDescription>
            {filteredSlotsByType.length} time slots configured
            {selectedDepartment !== "all" && ` for selected department`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading time slots...</div>
          ) : filteredSlotsByType.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No time slots found. Click "Add Time Slots" to create new ones.
            </div>
          ) : (
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
                {filteredSlotsByType.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium">
                      {slot.department}
                    </TableCell>
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
                      <Badge
                        className={getTypeColor(slot.appointmentType)}
                        variant="outline"
                      >
                        {slot.appointmentType.charAt(0).toUpperCase() + slot.appointmentType.slice(1)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSlotManagement;