// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Plus, Edit, Trash2, Building2, Users, Clock } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// interface Department {
//   id: string;
//   name: string;
//   type: "OPD" | "Diagnostics" | "Pharmacy" | "Lab" | "Emergency" | "Surgery" | "ICU" | "Other";
//   head: string;
//   staffCount: number;
//   operatingHours: string;
//   status: "active" | "inactive";
//   description: string;
// }

// const DepartmentManagement = () => {
//   const { toast } = useToast();
//   const [departments, setDepartments] = useState<Department[]>([
//     {
//       id: "1",
//       name: "General OPD",
//       type: "OPD",
//       head: "Dr. Rajesh Kumar",
//       staffCount: 12,
//       operatingHours: "8:00 AM - 6:00 PM",
//       status: "active",
//       description: "General outpatient consultations"
//     },
//     {
//       id: "2",
//       name: "Radiology",
//       type: "Diagnostics",
//       head: "Dr. Priya Sharma",
//       staffCount: 8,
//       operatingHours: "24/7",
//       status: "active",
//       description: "X-ray, MRI, CT scan services"
//     },
//     {
//       id: "3",
//       name: "Pathology Lab",
//       type: "Lab",
//       head: "Dr. Amit Singh",
//       staffCount: 15,
//       operatingHours: "6:00 AM - 10:00 PM",
//       status: "active",
//       description: "Blood tests, tissue analysis"
//     },
//     {
//       id: "4",
//       name: "In-house Pharmacy",
//       type: "Pharmacy",
//       head: "Mr. Suresh Patel",
//       staffCount: 6,
//       operatingHours: "8:00 AM - 10:00 PM",
//       status: "active",
//       description: "Prescription medications and supplies"
//     }
//   ]);

//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     type: "OPD" as Department["type"],
//     head: "",
//     operatingHours: "",
//     description: ""
//   });

//   const departmentTypes = ["OPD", "Diagnostics", "Pharmacy", "Lab", "Emergency", "Surgery", "ICU", "Other"];

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (editingDepartment) {
//       setDepartments(prev => prev.map(dept => 
//         dept.id === editingDepartment.id 
//           ? { ...dept, ...formData, staffCount: dept.staffCount }
//           : dept
//       ));
//       toast({
//         title: "Department Updated",
//         description: `${formData.name} has been updated successfully.`,
//       });
//       setEditingDepartment(null);
//     } else {
//       const newDepartment: Department = {
//         id: Date.now().toString(),
//         ...formData,
//         staffCount: 0,
//         status: "active"
//       };
//       setDepartments(prev => [...prev, newDepartment]);
//       toast({
//         title: "Department Added",
//         description: `${formData.name} has been added successfully.`,
//       });
//     }
    
//     setFormData({ name: "", type: "OPD", head: "", operatingHours: "", description: "" });
//     setIsAddDialogOpen(false);
//   };

//   const handleEdit = (department: Department) => {
//     setEditingDepartment(department);
//     setFormData({
//       name: department.name,
//       type: department.type,
//       head: department.head,
//       operatingHours: department.operatingHours,
//       description: department.description
//     });
//     setIsAddDialogOpen(true);
//   };

//   const handleDelete = (id: string) => {
//     const department = departments.find(d => d.id === id);
//     setDepartments(prev => prev.filter(dept => dept.id !== id));
//     toast({
//       title: "Department Deleted",
//       description: `${department?.name} has been removed.`,
//     });
//   };

//   const getStatusColor = (status: string) => {
//     return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Department Management</h2>
//           <p className="text-muted-foreground">
//             Manage hospital departments and their operations
//           </p>
//         </div>
//         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//           <DialogTrigger asChild>
//             <Button onClick={() => setEditingDepartment(null)}>
//               <Plus className="mr-2 h-4 w-4" />
//               Add Department
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>
//                 {editingDepartment ? "Edit Department" : "Add New Department"}
//               </DialogTitle>
//               <DialogDescription>
//                 {editingDepartment ? "Update department information" : "Create a new department in your hospital"}
//               </DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleSubmit}>
//               <div className="grid gap-4 py-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="name">Department Name</Label>
//                   <Input
//                     id="name"
//                     value={formData.name}
//                     onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                     placeholder="Enter department name"
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="type">Department Type</Label>
//                   <select
//                     id="type"
//                     value={formData.type}
//                     onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Department["type"] }))}
//                     className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//                     required
//                   >
//                     {departmentTypes.map(type => (
//                       <option key={type} value={type}>{type}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="head">Department Head</Label>
//                   <Input
//                     id="head"
//                     value={formData.head}
//                     onChange={(e) => setFormData(prev => ({ ...prev, head: e.target.value }))}
//                     placeholder="Enter department head name"
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="hours">Operating Hours</Label>
//                   <Input
//                     id="hours"
//                     value={formData.operatingHours}
//                     onChange={(e) => setFormData(prev => ({ ...prev, operatingHours: e.target.value }))}
//                     placeholder="e.g., 8:00 AM - 6:00 PM"
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Input
//                     id="description"
//                     value={formData.description}
//                     onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                     placeholder="Brief description of department"
//                   />
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button type="submit">
//                   {editingDepartment ? "Update Department" : "Add Department"}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Building2 className="mr-2 h-5 w-5" />
//             Departments Overview
//           </CardTitle>
//           <CardDescription>
//             {departments.length} departments registered
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Department Name</TableHead>
//                 <TableHead>Type</TableHead>
//                 <TableHead>Department Head</TableHead>
//                 <TableHead>Staff Count</TableHead>
//                 <TableHead>Operating Hours</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {departments.map((department) => (
//                 <TableRow key={department.id}>
//                   <TableCell>
//                     <div>
//                       <p className="font-medium">{department.name}</p>
//                       <p className="text-sm text-muted-foreground">{department.description}</p>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant="outline">{department.type}</Badge>
//                   </TableCell>
//                   <TableCell>{department.head}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center">
//                       <Users className="mr-1 h-3 w-3" />
//                       {department.staffCount}
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center">
//                       <Clock className="mr-1 h-3 w-3" />
//                       {department.operatingHours}
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Badge className={getStatusColor(department.status)}>
//                       {department.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex space-x-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleEdit(department)}
//                       >
//                         <Edit className="h-3 w-3" />
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => handleDelete(department.id)}
//                       >
//                         <Trash2 className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default DepartmentManagement;


import { useState, useEffect } from "react";
import { isMedicalProfessional } from "@/lib/isMedicalProfessional";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Trash2,
  Building2,
  Users,
  Clock,
  Bed,
  Activity,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import mixpanelInstance from "@/utils/mixpanel";

interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface Facility {
  id: string;
  facility_name: string;
  admin_user_id: string;
}



interface Department {
  id: string;
  facility_id: string;
  // type:
  //   | "OPD"
  //   | "Diagnostics"
  //   | "Pharmacy"
  //   | "Lab"
  //   | "Emergency"
  //   | "Surgery"
  //   | "ICU"
  //   | "Other";
  types: string[];
  name: string;
  description: string;
  head_doctor_id: string | null;
  services: string[];
  equipment: string[];
  bed_capacity: number;
  available_beds: number;
  is_active: boolean;
  created_at: string;
  staffCount: string;
  operatingHours: string;
  updated_at: string;
  head_doctor?: Profile;
  timeSlots?: TimeSlot[];
}

interface TimeSlot {
  id: string;
  doctor_id: string;
  facility_id: string;
  department_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  slot_type: string;
  day_of_week: string;
}

const DepartmentManagement = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [userFacility, setUserFacility] = useState<Facility | null>(null);
// const departmentTypes = [
//   "OPD",
//   "Diagnostics",
//   "Pharmacy",
//   "Lab",
//   "Emergency",
//   "Surgery",
//   "ICU",
//   "Other",
// ];
const departmentTypes = [
  "ICU",
  "CCU",
  "NICU",
  "PICU",
  "GENERAL",
  "PRIVATE",
  "SEMI_PRIVATE",
  "ISOLATION",
  "BURN_UNIT",
  "CARDIAC",
  "NEURO",
  "MATERNITY",
  "PEDIATRIC",
  "PSYCHIATRIC",
  "REHABILITATION",
  "STEP_DOWN",
  "EMERGENCY",
];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    head_doctor_id: "",
    services: "",
    equipment: "",
    bed_capacity: 0,
    available_beds: 0,
    staffCount:"",
    operatingHours:"",
    types: [],
    is_active: true,
  });

  const trackDepartmentAction = (action: string, departmentData?: any, additionalData = {}) => {
  mixpanelInstance.track('Department Management Action', {
    action,
    departmentId: departmentData?.id,
    departmentName: departmentData?.name,
    facilityId: userFacility?.id,
    facilityName: userFacility?.facility_name,
    ...additionalData
  });
};
  
  // Get user's facility on component mount
  useEffect(() => {
    const getUserFacility = async () => {
      if (!user) return;
      // Inside fetchData function, replace the doctors fetching part:
const { data: doctorsData, error: doctorsError } = await supabase
  .from("profiles")
  .select("id, first_name, last_name, role")
  .eq("role", "doctor");
  
// Add facility filtering if you have facility info in profiles table
// .eq("facility_id", userFacility.id) // Uncomment if you have this field

if (doctorsError) throw doctorsError;

      try {
        // Find facility where admin_user_id = current user's ID
        const { data: facilityData, error: facilityError } = await supabase
          .from("facilities")
          .select("id, facility_name, admin_user_id")
          .eq("admin_user_id", user.id)
          .single();

        if (facilityError) {
          console.error("Facility error:", facilityError);
          throw facilityError;
        }

        if (facilityData) {
          setUserFacility(facilityData);
        } else {
          toast({
            title: "No Facility Found",
            description: "You are not assigned as an admin of any facility.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error fetching user facility:", error);
        // Don't show toast if it's just "No rows returned" error
        if (error.code !== "PGRST116") {
          toast({
            title: "Error",
            description: "Failed to load facility information",
            variant: "destructive",
          });
        }
      }
    };

    getUserFacility();
  }, [user]);
  // Fetch staff for a department by departmentId
  const [staff, setStaff] = useState<any[]>([]);
// First, you need to define departmentId state or get it from somewhere
// Add this near your other state declarations:
const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
useEffect(() => {
  if (userFacility?.id) {
    fetchData();
  }
}, [userFacility]);


// Also, you need to actually use the staff data somewhere in your component
// For example, if you want to show staff when clicking on a department:
const handleViewStaff = (departmentId: string) => {
  setSelectedDepartmentId(departmentId);
  // You might want to open a modal or navigate to staff page here
};

  const fetchData = async () => {
    if (!userFacility?.id) return;

    try {
      setIsLoading(true);

      // Fetch departments for user's facility only
      const { data: departmentsData, error: departmentsError } = await supabase
        .from("departments")
        .select(`*`)
        .eq("facility_id", userFacility.id) // Filter by user's facility ID
        .order("created_at", { ascending: false });

      if (departmentsError) throw departmentsError;

      // Fetch doctors (profiles with role 'doctor')
      // Note: This fetches all doctors, you might want to filter by facility too
      const { data: doctorsData, error: doctorsError } = await supabase
        .from("profiles")
        .select("id, user_id,first_name, last_name, role")
        .eq("role", "doctor");

      if (doctorsError) throw doctorsError;
   

      setDepartments((departmentsData as Department[]) || []);
      setDoctors((doctorsData as Profile[]) || []);

      // Fetch staff count grouped by department
    const { data: staffData, error: staffError } = await supabase
      .from("staff")
      .select("department_id", { count: "exact" })
      .eq("facility_id", userFacility.id);

    if (staffError) throw staffError;

// Fetch time slots for all departments
    const { data: timeSlotsData, error: timeSlotsError } = await supabase
      .from("time_slots")
      .select("*")
      .eq("facility_id", userFacility.id)
      .in("department_id", departmentsData?.map(d => d.id) || []);

    if (timeSlotsError) throw timeSlotsError;

    // Group time slots by department
    const timeSlotsByDepartment: Record<string, TimeSlot[]> = {};
    timeSlotsData?.forEach((slot) => {
      if (!timeSlotsByDepartment[slot.department_id]) {
        timeSlotsByDepartment[slot.department_id] = [];
      }
      timeSlotsByDepartment[slot.department_id].push(slot);
    });


    // Map staff count to departments
    const staffCountMap: Record<string, number> = {};

    staffData?.forEach((staff) => {
      staffCountMap[staff.department_id] =
        (staffCountMap[staff.department_id] || 0) + 1;
    });

    // const departmentsWithStaffCount = (departmentsData || []).map((dept) => ({
    //   ...dept,
    //   staffCount: staffCountMap[dept.id] || 0,
    // }));

    // setDepartments(departmentsWithStaffCount as Department[]);


    const departmentsWithDetails = (departmentsData || []).map((dept) => {
      const departmentTimeSlots = timeSlotsByDepartment[dept.id] || [];
      
      // Format operating hours from time slots
      const operatingHours = formatOperatingHours(departmentTimeSlots);
      
      return {
        ...dept,
        staffCount: staffCountMap[dept.id] || 0,
        operatingHours: operatingHours,
        timeSlots: departmentTimeSlots,
      };
    });

    setDepartments(departmentsWithDetails as Department[]);
    setDoctors((doctorsData as Profile[]) || []);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load department data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


// // Helper function to format operating hours from time slots
// const formatOperatingHours = (timeSlots: TimeSlot[]): string => {
//   if (!timeSlots || timeSlots.length === 0) {
//     return "N/A";
//   }

//   // Group by day of week
//   const hoursByDay: Record<string, { start: string; end: string }[]> = {};
  
//   timeSlots.forEach(slot => {
//     const day = slot.day_of_week;
//     if (!hoursByDay[day]) {
//       hoursByDay[day] = [];
//     }
    
//     // Format time to HH:MM AM/PM
//     const startTime = formatTime(slot.start_time);
//     const endTime = formatTime(slot.end_time);
    
//     hoursByDay[day].push({ start: startTime, end: endTime });
//   });

//   // Create a readable string
//   const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
//   const formattedHours = dayOrder
//     .filter(day => hoursByDay[day])
//     .map(day => {
//       const slots = hoursByDay[day];
//       // If multiple slots in same day, combine them
//       if (slots.length === 1) {
//         return `${day}: ${slots[0].start} - ${slots[0].end}`;
//       } else {
//         const slotStrings = slots.map(s => `${s.start} - ${s.end}`).join(", ");
//         return `${day}: ${slotStrings}`;
//       }
//     });

//   if (formattedHours.length === 0) return "N/A";
  
//   // If all days have same hours, show a simplified version
//   const allSameHours = formattedHours.every(h => 
//     h.includes(formattedHours[0].split(": ")[1])
//   );
  
//   if (allSameHours && formattedHours.length === 7) {
//     return `Daily: ${formattedHours[0].split(": ")[1]}`;
//   } else if (allSameHours && formattedHours.length === 5) {
//     return `Weekdays: ${formattedHours[0].split(": ")[1]}`;
//   }
  
//   // Otherwise show first 2 days with +more
//   if (formattedHours.length > 2) {
//     return `${formattedHours.slice(0, 2).join(", ")} +${formattedHours.length - 2} more`;
//   }
  
//   return formattedHours.join(", ");
// };

// Helper function to format operating hours (ONLY CURRENT DAY)
const formatOperatingHours = (timeSlots: TimeSlot[]): string => {
  if (!timeSlots || timeSlots.length === 0) {
    return "N/A";
  }

  // Get today's day name
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  }); // Example: "Monday"

  // Filter only today's slots
  const todaySlots = timeSlots.filter(
    (slot) => slot.day_of_week === today
  );

  if (todaySlots.length === 0) {
    return `${today}: Closed`;
  }

  // Format today's timings
  const formatted = todaySlots.map((slot) => {
    const start = formatTime(slot.start_time);
    const end = formatTime(slot.end_time);
    return `${start} - ${end}`;
  });

  return `${today}: ${formatted.join(", ")}`;
};


// Helper function to format time
const formatTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  } catch {
    return time;
  }
};


  const fetchStaff = async (departmentId: string) => {
  try {
    const { data, error } = await supabase
      .from("staff")
      .select("*")
      .eq("facility_id", userFacility?.id)
      .eq("department_id", departmentId);

    if (error) throw error;
    setStaff(data || []);
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to load staff",
      variant: "destructive",
    });
  }
};
    

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
  trackDepartmentAction(editingDepartment ? 'edit_attempt' : 'add_attempt', 
    editingDepartment, { formData: { name: formData.name } });
    if (!userFacility?.id) {
      toast({
        title: "Error",
        description: "Facility information not found",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare data for submission
      const departmentData = {
        facility_id: userFacility.id, // Use facility ID from user's facility
        name: formData.name,
        description: formData.description,
        head_doctor_id: formData.head_doctor_id || null,
        services: formData.types,
          // .split(",")
          // .map((s) => s.trim())
          // .filter((s) => s.length > 0),
        equipment: formData.equipment
          .split(",")
          .map((e) => e.trim())
          .filter((e) => e.length > 0),
        // bed_capacity: formData.bed_capacity,
        // available_beds: formData.available_beds,
        is_active: formData.is_active,
        // type: formData.type,
        updated_at: new Date().toISOString(),
      };

      if (editingDepartment) {
        // Update existing department
        const { error } = await supabase
          .from("departments")
          .update(departmentData)
          .eq("id", editingDepartment.id)
          .eq("facility_id", userFacility.id); // Ensure user can only edit their own facility departments

        if (error) throw error;

        toast({
          title: "Department Updated",
          description: `${formData.name} has been updated successfully.`,
        });
        setEditingDepartment(null);
          trackDepartmentAction('edit_success', { id: editingDepartment.id, name: formData.name });
      } else {
        // Add new department
        const {data, error } = await supabase.from("departments").insert([
          {
            ...departmentData,
            created_at: new Date().toISOString(),
          },
        ]);
        console.log("Insert response:", data); // Debug log

        if (error) throw error;

        toast({
          title: "Department Added",
          description: `${formData.name} has been added successfully.`,
        });
        trackDepartmentAction('add_success', { name: formData.name });
      }

      // Reset form and refresh data
      resetForm();
      fetchData();
      trackDepartmentAction('fetch_data');
    } catch (error: any) {
      console.error("Error saving department:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save department data",
        variant: "destructive",
      });
      trackDepartmentAction(editingDepartment ? 'edit_failure' : 'add_failure', { name: formData.name }, { error: error.message });
    }
  };
  
const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || "",
      head_doctor_id: department.head_doctor_id || "",
      services: Array.isArray(department.services)
        ? department.services.join(", ")
        : "",
      equipment: Array.isArray(department.equipment)
        ? department.equipment.join(", ")
        : "",
      bed_capacity: department.bed_capacity || 0,
      available_beds: department.available_beds || 0,
      staffCount: department.staffCount||"",
      operatingHours: department.operatingHours||"",
      types: Array.isArray(department.services)
        ? department.services
        : [],
      is_active: department.is_active,
    });
    setIsAddDialogOpen(true);
    trackDepartmentAction('edit_open', department, { name: department.name });
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
    trackDepartmentAction('delete_attempt', { id });

    try {
      const department = departments.find((d) => d.id === id);

      const { error } = await supabase
        .from("departments")
        .delete()
        .eq("id", id)
        .eq("facility_id", userFacility.id); // Ensure user can only delete their own facility departments

      if (error) throw error;

      setDepartments((prev) => prev.filter((dept) => dept.id !== id));
      toast({
        title: "Department Deleted",
        description: `${department?.name} has been removed.`,
      });
      trackDepartmentAction('delete_success', { id, name: department?.name });
    } catch (error) {
      console.error("Error deleting department:", error);
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      });
      trackDepartmentAction('delete_failure', { id }, { error: (error as any).message });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      head_doctor_id: "",
      services: "",
      equipment: "",
      bed_capacity: 0,
      available_beds: 0,
      staffCount: "",
      operatingHours: "",
      types: [],
      is_active: true,
    });
    setEditingDepartment(null);
    setIsAddDialogOpen(false);
    trackDepartmentAction('form_reset');
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  // const getDoctorName = (department: Department) => {
  //   if (department.head_doctor) {
  //     return `${department.head_doctor.first_name} ${department.head_doctor.last_name}`;
  //   }
  //   return "Not Assigned";
  // };
  const getDoctorName = (department: Department) => {
  // First check if head_doctor object exists
  if (department.head_doctor) {
    return `Dr. ${department.head_doctor.first_name} ${department.head_doctor.last_name}`;
  }
  
  // If not, check if we have doctors array and find the matching doctor
  if (department.head_doctor_id && doctors.length > 0) {
    const doctor = doctors.find(d => d.id === department.head_doctor_id);
    if (doctor) {
      return `Dr. ${doctor.first_name} ${doctor.last_name}`;
    }
  }
  
  return "Not Assigned";
};

  if (!userFacility && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Facility Assigned</h3>
          <p className="text-muted-foreground mt-2">
            You are not assigned as an admin of any facility. Please contact
            support or create a facility first.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Loading department data...
          </p>
        </div>
      </div>
    );
  }

  // Helper for detailed hours in tooltip
const formatDetailedHours = (timeSlots: TimeSlot[]): string[] => {
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hoursByDay: Record<string, string[]> = {};
  
  timeSlots.forEach(slot => {
    const day = slot.day_of_week;
    if (!hoursByDay[day]) {
      hoursByDay[day] = [];
    }
    const startTime = formatTime(slot.start_time);
    const endTime = formatTime(slot.end_time);
    hoursByDay[day].push(`${startTime} - ${endTime}`);
  });

  return dayOrder
    .filter(day => hoursByDay[day])
    .map(day => {
      const times = hoursByDay[day].join(", ");
      return `${day}: ${times}`;
    });
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Department Management</h2>
          <p className="text-muted-foreground">
            Manage departments for{" "}
            {userFacility?.facility_name || "your facility"}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button   onClick={() => {
    trackDepartmentAction('add_department_click');
    resetForm();
    setIsAddDialogOpen(true);
  }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? "Edit Department" : "Add New Department"}
              </DialogTitle>
              <DialogDescription>
                {editingDepartment
                  ? "Update department information"
                  : `Create a new department in ${
                      userFacility?.facility_name || "your facility"
                    }`}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* <div className="grid gap-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter department name"
                    required
                  />
                </div> */}

            <div className="grid gap-2">
  <Label htmlFor="name">Department</Label>
  <select
    id="name"
    value={formData.name}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, name: e.target.value }))
    }
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    required
  >
    <option value="">Select your Department</option>
    <option value="General Medicine">General Medicine</option>
    <option value="Cardiology">Cardiology</option>
    <option value="Neurology">Neurology</option>
    <option value="Orthopedics">Orthopedics</option>
    <option value="Pediatrics">Pediatrics</option>
    <option value="Gynecology">Gynecology</option>
    <option value="Surgery">Surgery</option>
    <option value="Emergency">Emergency</option>
    <option value="ICU">ICU</option>
    <option value="Radiology">Radiology</option>
    <option value="Pathology">Pathology</option>
    <option value="Dermatology">Dermatology</option>
    <option value="ENT">ENT</option>
    <option value="Ophthalmology">Ophthalmology</option>
    <option value="Psychiatry">Psychiatry</option>
    <option value="Physiotherapy">Physiotherapy</option>
    <option value="Dental">Dental</option>
    <option value="Ayurveda">Ayurveda</option>
    <option value="Homeopathy">Homeopathy</option>
    <option value="Dietetics">Dietetics</option>
    <option value="Laboratory">Laboratory</option>
    <option value="Biochemistry">Biochemistry</option>
    <option value="Microbiology">Microbiology</option>
    <option value="X-Ray">X-Ray</option>
    <option value="Ultrasound">Ultrasound</option>
    <option value="Higher End Modalities">Higher End Modalities</option>
    <option value="Bed Management">Bed Management</option>
    <option value="Maintenance">Maintenance</option>
  </select>
</div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Brief description of department"
                    rows={3}
                  />
                </div>
                {/* <div className="grid gap-2">
                  <Label htmlFor="head_doctor_id">Department Head</Label>
                  <select
                    id="head_doctor_id"
                    value={formData.head_doctor_id}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        head_doctor_id: e.target.value,
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select Department Head</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.first_name} {doctor.last_name}
                      </option>
                    ))}
                  </select>
                </div> */}
                {/* <div className="grid gap-2">
                  <Label htmlFor="type">Department Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        type: e.target.value as Department["type"],
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    {departmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div> */}
                <div className="grid gap-2">
  <Label htmlFor="head_doctor_id">Department Head</Label>
  <select
    id="head_doctor_id"
    value={formData.head_doctor_id}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        head_doctor_id: e.target.value,
      }))
    }
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <option value="">Select Department Head</option>
    {doctors.map((doctor) => (
      <option key={doctor.id} value={doctor.id}>
        Dr. {doctor.first_name} {doctor.last_name}
      </option>
    ))}
  </select>
</div>
                <div className="grid gap-2">
  <Label>Services (comma separated)</Label>

  {/* Dropdown */}
  <select
    onChange={(e) => {
      const value = e.target.value;

      if (
        value &&
        !formData.types.includes(value) &&
        formData.types.length < 10
      ) {
        setFormData((prev) => ({
          ...prev,
          types: [...prev.types, value],
        }));
      }

      e.target.value = "";
    }}
    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
  >
    <option value="">Select department</option>
    {departmentTypes.map((type) => (
      <option
        key={type}
        value={type}
        disabled={formData.types.includes(type)}
      >
        {type}
      </option>
    ))}
  </select>

  {/* Selected items shown below */}
  <div className="flex flex-wrap gap-2 mt-2">
    {formData.types.map((type) => (
      <span
        key={type}
        className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-sm"
      >
        {type}
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              types: prev.types.filter((t) => t !== type),
            }))
          }
          className="text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </span>
    ))}
  </div>

  {/* Validation message */}
  {formData.types.length > 0 && formData.types.length < 1 && (
    <p className="text-sm text-red-500">
      Minimum 1 departments must be selected
    </p>
  )}
</div>

                {/* <div className="grid gap-2">
                  <Label htmlFor="services">Services (comma separated)</Label>
                  <Input
                    id="services"
                    value={formData.services}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        services: e.target.value,
                      }))
                    }
                    placeholder="e.g., Consultation, X-ray, Lab Tests"
                  />
                </div> */}
                <div className="grid gap-2">
                  <Label htmlFor="equipment">Equipment (comma separated)</Label>
                  <Input
                    id="equipment"
                    value={formData.equipment}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        equipment: e.target.value,
                      }))
                    }
                    placeholder="e.g., MRI Machine, X-ray Machine, ECG"
                  />
                </div>
                {/* <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bed_capacity">Bed Capacity</Label>
                    <Input
                      id="bed_capacity"
                      type="number"
                      value={formData.bed_capacity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bed_capacity: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="Total beds"
                      min="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="available_beds">Available Beds</Label>
                    <Input
                      id="available_beds"
                      type="number"
                      value={formData.available_beds}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          available_beds: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="Available beds"
                      min="0"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="is_active">Status</Label>
                  <select
                    id="is_active"
                    value={formData.is_active.toString()}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_active: e.target.value === "true",
                      }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div> */}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDepartment ? "Update Department" : "Add Department"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            Departments Overview
          </CardTitle>
          <CardDescription>
            {departments.length} departments in{" "}
            {userFacility?.facility_name || "your facility"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {departments.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Departments</h3>
              <p className="text-muted-foreground mt-2">
                Get started by adding your first department to{" "}
                {userFacility?.facility_name || "your facility"}.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Head Doctor</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Staff Count</TableHead>
                  <TableHead>Operating Hours</TableHead>
                  {/* <TableHead>Beds</TableHead> */}
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{department.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {department.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {getDoctorName(department)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Head Doctor
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {Array.isArray(department.services) &&
                        department.services.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {department.services
                              .slice(0, 3)
                              .map((service, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {service}
                                </Badge>
                              ))}
                            {department.services.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{department.services.length - 3} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No services listed
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-1 h-3 w-3" />
                        {department.staffCount||"N/A"}
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {department.operatingHours||"N/A"}
                      </div>
                    </TableCell> */}
                    <TableCell>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center cursor-help">
          <Clock className="mr-1 h-3 w-3" />
          {department.operatingHours || "N/A"}
        </div>
      </TooltipTrigger>
      {department.timeSlots && department.timeSlots.length > 0 && (
        <TooltipContent className="max-w-sm">
          <div className="space-y-1">
            <p className="font-medium">Operating Schedule</p>
            {formatDetailedHours(
  department.timeSlots.filter(
    slot => slot.day_of_week === 
      new Date().toLocaleDateString("en-US", { weekday: "long" })
  )
).map((line, i) => (
              <p key={i} className="text-sm">{line}</p>
            ))}
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  </TooltipProvider>
</TableCell>

                    {/* <TableCell>
                      <div className="flex items-center space-x-2">
                        <Bed className="h-3 w-3 text-muted-foreground" />
                        <div>
                          <p className="text-sm">
                            {department.available_beds} /{" "}
                            {department.bed_capacity}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Available / Total
                          </p>
                        </div>
                      </div>
                    </TableCell> */}
                    <TableCell>
                      <Badge className={getStatusColor(department.is_active)}>
                        {department.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                     onClick={() => {
    trackDepartmentAction('edit_click', department);
    handleEdit(department);
  }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                     onClick={() => {
    trackDepartmentAction('delete_click', department);
    handleDelete(department.id);
  }}
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

export default DepartmentManagement;