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
  ChevronRight,
  ChevronLeft,
  PhoneIcon,
  Loader,
  MessageCircle,
  AlertCircle,
  SubscriptIcon
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Loader2 from "../ui/Loader2";
import { useFacilityLimit } from "@/hooks/useFacilityLimit";
import { sendContactEnquiry } from "@/services/contactApi";
import { useNavigate } from "react-router-dom";

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
interface Staff {
  id: string;
  facility_id: string;
  user_id: string;
  department_id: string;
  position: string;
  employee_id: string;
  hire_date: string;
  salary: number;
  shift_schedule: {
    shift: "morning" | "evening" | "night" | "rotating";
    start_time?: string;
    end_time?: string;
  };
  permissions: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  department?: Department;
  facility?: Facility;
    specialization?: string;
  qualifications?: string[];
  employment_type?: string;
  joining_date?: string;
  status?: string;
  role:string;
}

interface CombinedStaffData extends Staff {
  profile: Profile;
  department: Department;
  facility: Facility;
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
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
   const [editingStaff, setEditingStaff] = useState<CombinedStaffData | null>(null);
// Add these state variables
const [isTimeSlotDialogOpen, setIsTimeSlotDialogOpen] = useState(false);
const [editingSlot, setEditingSlot] = useState<any>(null);
 const [isCreatingUser, setIsCreatingUser] = useState(false);
// Add these constants
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
// const appointmentTypes = ["consultation", "followup", "emergency", "checkup"];
    const appointmentTypes = [
    "consultation",
    "teleconsultation"
    // "procedure",
    // "emergency",
    // "followup",
    // "booking",
  ];
// Add these functions
const trackTimeSlotAction = (action: string, slotData?: any, additionalData = {}) => {
  mixpanelInstance.track('Time Slot Management Action', {
    action,
    ...additionalData
  });
};

const { checkLimit, limits, loading: limitLoading } = useFacilityLimit();
const [userFacility, setUserFacility] = useState<Facility | null>(null);
useEffect(() => {
  if (userFacility?.id) {
    checkLimit(userFacility.id, "departments"); // 🔥 AUTO CALL
  }
}, [userFacility]);

// const isStaffLimitReached =
//   limits && limits?.limits?.departments?.allowed === false;
const deptLimitMax = limits?.limits?.departments?.max ?? 0;
const deptLimitCurrent = limits?.limits?.departments?.current ?? 0;
const isLoadingData = isLoading || limitLoading;
const isStaffLimitReached =
  limits?.limits?.departments?.allowed === false || deptLimitMax >= deptLimitCurrent;
const limitMessage =
  limits?.message ||
  "You have reached the maximum department limit.";

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
// Add this near your other state declarations or as a constant
const departmentOptions = [
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Gynecology",
  "Surgery",
  "Emergency",
  "Radiology",
  "Pathology",
  "Dermatology",
  "ENT",
  "Ophthalmology",
  "Psychiatry",
  "Physiotherapy",
  "Dental",
  "Ayurveda",
  "Homeopathy",
  "Dietetics",
  "Laboratory",
  "Bed Management",
  "Other"
];
// Make sure you have access to the departments state and userFacility
// You already have these from your code:
// const [departments, setDepartments] = useState<Department[]>([]);
// const [userFacility, setUserFacility] = useState<Facility | null>(null);
const [showContactDialog, setShowContactDialog] = useState(false);
const [contactSubmitting, setContactSubmitting] = useState(false);
const [showLimitMessage, setShowLimitMessage] = useState(false);
const [showMessage, setShowMessage] = useState(false);
const [contactForm, setContactForm] = useState({
  name: "",
  subject: "",
  message: "",
});
const openContactDialog = () => {
  setContactForm({
    name: `${userFacility?.facility_name} `.trim(),
    subject: "",
    message: "",
  });
  setShowContactDialog(true);
};
const [showContactPopup, setShowContactPopup] = useState(false);
const [currentStep, setCurrentStep] = useState(1);
const [departmentCreated, setDepartmentCreated] = useState(false);
const [timeCreated, setTimeCreated] = useState(false);
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

     // Time slot fields
  department_id: "",
  department: "",
  startTime: "",
  endTime: "",
  slotDuration: 30,
  breakTime: 0,
  maxAppointments: 10,
  appointmentType: "consultation",
  selectedDays: [] as string[],
      // User account fields
    email: "",
    // password: "",
    // confirmPassword: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    user_id: "",
    employee_id: "",
    position: "",
    facility_id: "",
    hire_date: "",
    salary: 0,
    shift_schedule: {
      shift: "morning" as "morning" | "evening" | "night" | "rotating",
      start_time: "09:00",
      end_time: "17:00",
    },
    permissions: {},
    specialization: "",
  qualifications: [],
  employment_type: "full-time",
  joining_date: "",
  status: "active",
  role: "hospital_staff",
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
const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  useEffect(() => {
  // If we're in edit mode (editingDepartment exists), we want the field to be editable
  setIsEditMode(!!editingDepartment);
}, [editingDepartment]);
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
const handleDaySelection = (day: string, checked: boolean) => {
  setFormData((prev) => ({
    ...prev,
    selectedDays: checked 
      ? [...(prev.selectedDays || []), day]
      : (prev.selectedDays || []).filter(d => d !== day)
  }));
};



  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  
  // trackDepartmentAction(editingDepartment ? 'edit_attempt' : 'add_attempt', 
  //   editingDepartment, { formData: { name: formData.name } });
  //   if (!userFacility?.id) {
  //     toast({
  //       title: "Error",
  //       description: "Facility information not found",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   try {
  //     // Prepare data for submission
  //     const departmentData = {
  //       facility_id: userFacility.id, // Use facility ID from user's facility
  //       name: formData.name,
  //       description: formData.description,
  //       head_doctor_id: formData.head_doctor_id || null,
  //       services: formData.types,
  //         // .split(",")
  //         // .map((s) => s.trim())
  //         // .filter((s) => s.length > 0),
  //       equipment: formData.equipment
  //         .split(",")
  //         .map((e) => e.trim())
  //         .filter((e) => e.length > 0),
  //       // bed_capacity: formData.bed_capacity,
  //       // available_beds: formData.available_beds,
  //       is_active: formData.is_active,
  //       // type: formData.type,
  //       updated_at: new Date().toISOString(),
  //     };

  //     if (editingDepartment) {
  //       // Update existing department
  //       const { error } = await supabase
  //         .from("departments")
  //         .update(departmentData)
  //         .eq("id", editingDepartment.id)
  //         .eq("facility_id", userFacility.id); // Ensure user can only edit their own facility departments

  //       if (error) throw error;

  //       toast({
  //         title: "Department Updated",
  //         description: `${formData.name} has been updated successfully.`,
  //       });
  //       setEditingDepartment(null);
  //         trackDepartmentAction('edit_success', { id: editingDepartment.id, name: formData.name });
  //     } else {
  //       // Add new department
  //       const {data, error } = await supabase.from("departments").insert([
  //         {
  //           ...departmentData,
  //           created_at: new Date().toISOString(),
  //         },
  //       ]);
  //       console.log("Insert response:", data); // Debug log

  //       if (error) throw error;

  //       toast({
  //         title: "Department Added",
  //         description: `${formData.name} has been added successfully.`,
  //       });
  //       trackDepartmentAction('add_success', { name: formData.name });
  //     }

  //     // Reset form and refresh data
  //     resetForm();
  //     fetchData();
  //     trackDepartmentAction('fetch_data');

  //   } catch (error: any) {
  //     console.error("Error saving department:", error);
  //     toast({
  //       title: "Error",
  //       description: error.message || "Failed to save department data",
  //       variant: "destructive",
  //     });
  //     trackDepartmentAction(editingDepartment ? 'edit_failure' : 'add_failure', { name: formData.name }, { error: error.message });
  //   }
  // };
  
// const handleEdit = (department: Department) => {
//     setEditingDepartment(department);
//     setFormData({
//       name: department.name,
//       description: department.description || "",
//       head_doctor_id: department.head_doctor_id || "",
//       services: Array.isArray(department.services)
//         ? department.services.join(", ")
//         : "",
//       equipment: Array.isArray(department.equipment)
//         ? department.equipment.join(", ")
//         : "",
//       bed_capacity: department.bed_capacity || 0,
//       available_beds: department.available_beds || 0,
//       staffCount: department.staffCount||"",
//       operatingHours: department.operatingHours||"",
//       types: Array.isArray(department.services)
//         ? department.services
//         : [],
//       is_active: department.is_active,
//     });
//     setIsAddDialogOpen(true);
//     trackDepartmentAction('edit_open', department, { name: department.name });
//   };

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

  setIsLoading(true); // Start loader

  try {
    // Prepare data for submission
    const departmentData = {
      facility_id: userFacility.id,
      name: formData.name,
      description: formData.description,
      head_doctor_id: formData.head_doctor_id || null,
      services: formData.types,
      equipment: formData.equipment
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e.length > 0),
      is_active: formData.is_active,
      updated_at: new Date().toISOString(),
    };

    if (editingDepartment) {
      // Update existing department
      const { error } = await supabase
        .from("departments")
        .update(departmentData)
        .eq("id", editingDepartment.id)
        .eq("facility_id", userFacility.id);

      if (error) throw error;

      toast({
        title: "Department Updated",
        description: `${formData.name} has been updated successfully.`,
      });
      
      setEditingDepartment(null);
      trackDepartmentAction('edit_success', { id: editingDepartment.id, name: formData.name });
      
      // Close dialog and reset form
      setIsAddDialogOpen(false);
      resetForm();
    } else {
      // Add new department
      const { data, error } = await supabase
        .from("departments")
        .insert([
          {
            ...departmentData,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Department Added",
        description: `${formData.name} has been added successfully.`,
      });
      
      trackDepartmentAction('add_success', { name: formData.name });
      
      // Store the new department ID for time slots
      if (data && data[0]) {
        setFormData(prev => ({
          ...prev,
          department_id: data[0].id,
          department: data[0].name
        }));
        
        // Set department created to true to show Next button
        setDepartmentCreated(true);
      }
    }

    // Refresh data
    fetchData();
    trackDepartmentAction('fetch_data');

  } catch (error: any) {
    console.error("Error saving department:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to save department data",
      variant: "destructive",
    });
    trackDepartmentAction(editingDepartment ? 'edit_failure' : 'add_failure', 
      { name: formData.name }, { error: error.message });
  } finally {
    setIsLoading(false); // Stop loader
  }
};

const handleTimeSlotSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!userFacility?.id) {
    toast({
      title: "Error",
      description: "Facility information not found",
      variant: "destructive",
    });
    return;
  }

  // Validate that we have a department_id
  if (!formData.department_id) {
    toast({
      title: "Error",
      description: "Department information is missing. Please start over.",
      variant: "destructive",
    });
    return;
  }
setIsLoading(true); // Add this line
  try {
    const rows = formData.selectedDays.map((day) => ({
      facility_id: userFacility.id,
      department_id: formData.department_id, // Using the department_id from the newly created department
      doctor_id: null,
      start_time: formData.startTime,
      end_time: formData.endTime,
      slot_type: formData.appointmentType,
      max_appointments: formData.maxAppointments,
      day_of_week: day,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from("time_slots").insert(rows);
    if (error) throw error;

    toast({
      title: "Success",
      description: `Department added and time slots created for ${formData.selectedDays.length} days.`,
    });

    // Reset time slot form data
    setFormData((prev) => ({
      ...prev,
      department_id: "",
      department: "",
      startTime: "",
      endTime: "",
      selectedDays: [],
      slotDuration: 30,
      breakTime: 0,
      maxAppointments: 10,
      appointmentType: "",
    }));
     setTimeCreated(true);
    // Close dialog and reset step
    // setIsAddDialogOpen(false);
    // setCurrentStep(1);
    
    // Refresh data
    fetchData();
  } catch (error: any) {
    console.error("Error saving time slots:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to save time slots",
      variant: "destructive",
    });
  }finally {
    setIsLoading(false); // Stop loader
  }
};
const handleSubmitStaff = async (e: React.FormEvent) => {
  e.preventDefault();


  console.log("=== DEBUG SUBMIT STAFF ===");
  console.log("formData.department_id:", formData.department_id);
  console.log("formData.department:", formData.department);
  console.log("Available departments:", departments);

  if (!userFacility?.id) {
    toast({
      title: "Error",
      description: "Facility not found",
      variant: "destructive",
    });
    return;
  }

  // ===============================
  // ✅ GET DEPARTMENT_ID FROM CURRENT DEPARTMENT
  // ===============================
  let departmentIdToUse = formData.department_id;
  
  // If department_id is missing but department name exists, find it
  if (!departmentIdToUse && formData.department) {
    console.log("Looking for department with name:", formData.department);
    const currentDept = departments.find(d => d.name === formData.department);
    console.log("Found department:", currentDept);
    
    if (currentDept) {
      departmentIdToUse = currentDept.id;
      console.log("Set departmentIdToUse to:", departmentIdToUse);
    }
  }

  // If still no department ID, try to get it from the formData.name
  if (!departmentIdToUse && formData.name) {
    console.log("Trying to find by formData.name:", formData.name);
    const currentDept = departments.find(d => d.name === formData.name);
    if (currentDept) {
      departmentIdToUse = currentDept.id;
      console.log("Found by name:", departmentIdToUse);
    }
  }

  console.log("Final departmentIdToUse:", departmentIdToUse);

  // ===============================
  // ✅ VALIDATION
  // ===============================
  if (!departmentIdToUse) {
    console.log("❌ No department ID found!");
    return toast({
      title: "Department Required",
      description: "Please select a department before adding staff",
      variant: "destructive",
    });
  }
  if (!formData.employee_id) {
    return toast({
      title: "Missing Fields",
      description: "Employee ID required",
      variant: "destructive",
    });
  }

  if (!formData.position) {
    return toast({
      title: "Missing Fields",
      description: "Position required",
      variant: "destructive",
    });
  }

  if (!formData.hire_date) {
    return toast({
      title: "Missing Fields",
      description: "Hire date required",
      variant: "destructive",
    });
  }

  // User/profile fields validation (only for new user)
  if (!editingStaff) {
    if (!formData.first_name || !formData.last_name) {
      return toast({
        title: "Missing Fields",
        description: "First & Last name required",
        variant: "destructive",
      });
    }

    if (!formData.email || !formData.phone_number) {
      return toast({
        title: "Missing Fields",
        description: "Email & Phone required",
        variant: "destructive",
      });
    }

    // if (formData.password !== formData.confirmPassword) {
    //   return toast({
    //     title: "Password mismatch",
    //     description: "Passwords do not match",
    //     variant: "destructive",
    //   });
    // }

    // if (formData.password.length < 6) {
    //   return toast({
    //     title: "Weak password",
    //     description: "Minimum 6 characters required",
    //     variant: "destructive",
    //   });
    // }
  }

  setIsCreatingUser(true);

  // try {
  //   // ===============================
  //   // ✅ CHECK DUPLICATE EMPLOYEE ID
  //   // ===============================
  //   let query = supabase
  //     .from("staff")
  //     .select("id")
  //     .eq("facility_id", userFacility.id)
  //     .eq("employee_id", formData.employee_id);

  //   if (editingStaff) {
  //     query = query.neq("id", editingStaff.id);
  //   }

  //   const { data: duplicate, error: dupError } = await query;

  //   if (dupError) throw dupError;

  //   if (duplicate && duplicate.length > 0) {
  //     throw new Error("Employee ID already exists");
  //   }

  //   let userId = formData.user_id;

  //   // ===============================
  //   // ✅ CREATE AUTH USER (ONLY NEW)
  //   // ===============================
  //   if (!editingStaff) {
  //     const { data: authData, error: authError } =
  //       await supabase.auth.signUp({
  //         email: formData.email,
  //         password: formData.password,
  //         options: {
  //           data: {
  //             first_name: formData.first_name,
  //             last_name: formData.last_name,
  //             role: "hospital_staff",
  //             phone_number: formData.phone_number,
  //           },
  //         },
  //       });

  //     if (authError) throw authError;

  //     if (!authData.user?.id) {
  //       throw new Error("User creation failed");
  //     }

  //     userId = authData.user.id;

  //     // ===============================
  //     // ✅ GET IDENTITY DATA FROM AUTH RESPONSE
  //     // ===============================
  //     const identityData = authData.user.identities?.[0]?.identity_data || {};

  //     // ===============================
  //     // ✅ CHECK IF PROFILE EXISTS BY USER_ID
  //     // ===============================
  //     const { data: existingProfile, error: profileCheckError } =
  //       await supabase
  //         .from("profiles")
  //         .select("*")
  //         .eq("user_id", userId)
  //         .maybeSingle();

  //     if (profileCheckError) throw profileCheckError;

  //     // ===============================
  //     // ✅ CREATE OR UPDATE PROFILE BASED ON USER_ID
  //     // ===============================
  //     if (!existingProfile) {
  //       // Create new profile if it doesn't exist
  //       const { error: profileError } = await supabase
  //         .from("profiles")
  //         .insert([
  //           {
  //             user_id: userId,
  //             email: formData.email || identityData.email,
  //             phone_number: formData.phone_number || identityData.phone_number,
  //             first_name: formData.first_name || identityData.first_name,
  //             last_name: formData.last_name || identityData.last_name,
  //             role: "hospital_staff",
  //             created_at: new Date().toISOString(),
  //             updated_at: new Date().toISOString(),
  //           },
  //         ]);

  //       if (profileError) throw profileError;

  //       toast({
  //         title: "Profile Created",
  //         description: "User profile created successfully from signup data",
  //       });
  //     } else {
  //       // Update existing profile if it exists
  //       const { error: profileUpdateError } = await supabase
  //         .from("profiles")
  //         .update({
  //           email: formData.email || identityData.email,
  //           phone_number: formData.phone_number || identityData.phone_number,
  //           first_name: formData.first_name || identityData.first_name,
  //           last_name: formData.last_name || identityData.last_name,
  //           role: "hospital_staff",
  //           updated_at: new Date().toISOString(),
  //         })
  //         .eq("user_id", userId);

  //       if (profileUpdateError) throw profileUpdateError;

  //       toast({
  //         title: "Profile Updated",
  //         description: "Existing profile updated with signup data",
  //       });
  //     }

  //     toast({
  //       title: "User Created",
  //       description: "Hospital staff account created successfully",
  //     });
  //   }

  //   // ===============================
  //   // ✅ STAFF TABLE DATA - USE departmentIdToUse
  //   // ===============================
  //   const staffPayload = {
  //     facility_id: userFacility.id,
  //     department_id: departmentIdToUse, // Use the variable we set earlier
  //     employee_id: formData.employee_id,
  //     position: formData.position,
  //     hire_date: formData.hire_date,
  //     user_id: userId,
  //     shift_schedule: {
  //       shift: formData.shift_schedule.shift,
  //       start_time: formData.shift_schedule.start_time,
  //       end_time: formData.shift_schedule.end_time,
  //     },
  //     is_active: formData.is_active,
  //     updated_at: new Date().toISOString(),
  //   };

  //   // ===============================
  //   // ✅ UPDATE / INSERT STAFF
  //   // ===============================
  //   if (editingStaff) {
  //     const { error } = await supabase
  //       .from("staff")
  //       .update(staffPayload)
  //       .eq("id", editingStaff.id);

  //     if (error) throw error;

  //     // ===============================
  //     // ✅ UPDATE PROFILE FOR EXISTING USER
  //     // ===============================
  //     const { error: profileError } = await supabase
  //       .from("profiles")
  //       .update({
  //         first_name: formData.first_name,
  //         last_name: formData.last_name,
  //         phone_number: formData.phone_number,
  //         email: formData.email,
  //         role: "hospital_staff",
  //         updated_at: new Date().toISOString(),
  //       })
  //       .eq("user_id", userId);

  //     if (profileError) throw profileError;

  //     toast({
  //       title: "Updated",
  //       description: "Staff updated successfully",
  //     });
  //   } else {
  //     const { error } = await supabase
  //       .from("staff")
  //       .insert([
  //         {
  //           ...staffPayload,
  //           created_at: new Date().toISOString(),
  //         },
  //       ]);

  //     if (error) throw error;

  //     toast({
  //       title: "Success",
  //       description: "Hospital staff added successfully",
  //     });
  //   }

  //   // ===============================
  //   // ✅ Update formData with department_id for future steps
  //   // ===============================
  //   if (departmentIdToUse && !formData.department_id) {
  //     setFormData(prev => ({
  //       ...prev,
  //       department_id: departmentIdToUse
  //     }));
  //   }

  //   // ===============================
  //   // ✅ RESET + REFRESH
  //   // ===============================
  //   resetForm();
  //   fetchData();
  //   setIsAddDialogOpen(false);
  //   setCurrentStep(1);

  // } 
  try {
    const payload = {
      facility_id: userFacility.id,
      department_id: departmentIdToUse,
      employee_id: formData.employee_id,
      position: formData.position,
      hire_date: formData.hire_date,
      email: formData.email,
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      salary: formData.salary,
      is_active: formData.is_active,   // optional, edge function ignores it
      shift_schedule: formData.shift_schedule,
      created_by: user.id,              // ✅ ADD THIS LINE
    };

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    const response = await fetch(
      "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/create-staff",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) throw new Error(result.error || "Something went wrong");

    toast({ title: "Success", description: "Staff created successfully" });
     resetForm();
    fetchData();
    setIsAddDialogOpen(false);
    setCurrentStep(1);
  
  } catch (err: any) {
    console.error("ERROR:", err);

    toast({
      title: "Error",
      description: err.message || "Something went wrong",
      variant: "destructive",
    });

  } finally {
    setIsCreatingUser(false);
  }
};

const handleEdit = (department: Department) => {
  
  setEditingDepartment(department);
   setIsEditMode(true);
  setFormData((prev) => ({
    ...prev,
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
    staffCount: department.staffCount || "",
    operatingHours: department.operatingHours || "",
    types: Array.isArray(department.services) ? department.services : [],
    is_active: department.is_active,
  }));
   setCurrentStep(1);
  // Reset department created flag to false
  setDepartmentCreated(false);
  // Reset time created flag to false
  setTimeCreated(false);
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
const validateField = (field: string, value: any): string => {
  switch (field) {
    case 'salary':
      if (value < 0) return "Salary cannot be negative";
      return "";
    default:
      return "";
  }
};

const getFieldValue = (field: string): any => {
  switch (field) {
    case 'salary':
      return formData.salary;
    default:
      return "";
  }
};

const handleContactSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!contactForm.name.trim()) {
    toast({ title: "Missing name", description: "Please enter your name.", variant: "destructive" });
    return;
  }
  if (!contactForm.subject.trim()) {
    toast({ title: "Missing subject", description: "Please enter a subject.", variant: "destructive" });
    return;
  }
  if (contactForm.message.trim().length < 10) {
    toast({ title: "Message too short", description: "Message must be at least 10 characters.", variant: "destructive" });
    return;
  }

  setContactSubmitting(true);
  try {
    // Get current user profile data (email, phone) if needed
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || "";
    const userPhone = ""; // you can fetch from profiles if available

    const result = await sendContactEnquiry({
      name: contactForm.name,
      email: userEmail,
      phone: userPhone,
      subject: contactForm.subject,
      message: contactForm.message,
    });

    if (result.success) {
      toast({
        title: "Message sent",
        description: "Thank you! We'll get back to you soon.",
        className: "bg-green-500 text-white",
      });
      setShowContactDialog(false);
      setContactForm({ name: "", subject: "", message: "" });
    } else {
      throw new Error(result.error || "Failed to send message");
    }
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Something went wrong. Please try again.",
      variant: "destructive",
    });
  } finally {
    setContactSubmitting(false);
  }
};

const handleBlur = (field: string) => {
  setTouchedFields(prev => ({ ...prev, [field]: true }));
  const error = validateField(field, getFieldValue(field));
  setFieldErrors(prev => ({ ...prev, [field]: error }));
};

const renderFieldError = (field: string) => {
  if (touchedFields[field] && fieldErrors[field]) {
    return <p className="text-red-500 text-sm mt-1">{fieldErrors[field]}</p>;
  }
  return null;
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
    department_id: "",
    department: "",
    startTime: "",
    endTime: "",
    slotDuration: 30,
    breakTime: 0,
    maxAppointments: 10,
    appointmentType: "consultation",
    selectedDays: [],
           email: "",
      // password: "",
      // confirmPassword: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      user_id: "",
      employee_id: "",
      position: "",
      facility_id: userFacility?.id || "", // Default to user's facility
      hire_date: "",
      salary: 0,
      shift_schedule: {
        shift: "morning" as "morning" | "evening" | "night" | "rotating",
        start_time: "09:00",
        end_time: "17:00",
      },
      permissions: {},
      specialization: "",
    qualifications: [],
    employment_type: "full-time",
    joining_date: "",
    status: "active",
    role: "hospital_staff",
    });
    // setEditingDepartment(null);
    // setCurrentStep(1);
    // setIsAddDialogOpen(false);
    // trackDepartmentAction('form_reset');
      setDepartmentCreated(false);
      setTimeCreated(false);
  setCurrentStep(1);
  // setCurrentStep(2);
  setEditingDepartment(null);
  setEditingSlot(null);
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

  if (isLoading && isLoadingData ) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          {/* <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div> */}
          <p className="mt-2 text-muted-foreground">
            {/* Loading department data... */}
            <Loader2/>
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
const getSubmitHandler = () => {
  if (currentStep === 1) return handleSubmit;
  if (currentStep === 2) return handleTimeSlotSubmit;
  if (currentStep === 3) return handleSubmitStaff;
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
{limits && (
  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
    Department Limit: {limits?.limits?.departments?.current} / {limits?.limits?.departments?.max}
  </div>
)}
  <div className="flex gap-2">
    {/* Department Dialog */}
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        {/* <Button onClick={() => {
          trackDepartmentAction('add_department_click');
          
          if (limits?.limits?.departments?.current >= limits?.limits?.departments?.max) {
            setShowMessage(true);
            setShowLimitMessage(true);
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
            
            return;
          }
          
    resetForm();
    setCurrentStep(1); // Set to step 1 when opening
          setIsAddDialogOpen(true);
 
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button> */}
        <Button
  onClick={async () => {
    trackDepartmentAction("add_department_click");

    // Prevent action while limits are loading
    if (limitLoading) {
      return;
    }

    // Re-check latest limits before opening dialog
    await checkLimit(userFacility?.id, "departments");

    // Wait until loading completes
    if (limitLoading) {
      return;
    }

    // Check department limit AFTER loading
    if (
      limits?.limits?.departments?.current >=
      limits?.limits?.departments?.max
    ) {
      setShowMessage(true);
      setShowLimitMessage(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // Open dialog only if limit not reached
    resetForm();
    setCurrentStep(1);
    setIsAddDialogOpen(true);
  }}
  disabled={limitLoading}
>
  {limitLoading ? (
    <>
      <Loader className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    <>
      <Plus className="mr-2 h-4 w-4" />
      Add Department
    </>
  )}
</Button>
      </DialogTrigger>
       {!showLimitMessage && (
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                    {/* {isStaffLimitReached ? (
            <>
              <DialogHeader>
                <DialogTitle>Subscription Required</DialogTitle>
                <DialogDescription>
                  <>
                  {limitMessage}

                  <p className="text-sm text-muted-foreground">Contact us to update your number</p>

<p className="flex items-center justify-center">
  <PhoneIcon size={18} className="text-primary mr-2 flex-shrink-0" />
  <span className="text-primary">+91 98868 81149</span>
</p>
</>
                </DialogDescription>
                <Button onClick={() => setIsAddDialogOpen(false)}>Close</Button>
              </DialogHeader>
            </>
          ) : ( */}
         
        <>
        <DialogHeader>
          <DialogTitle>
            {/* {editingDepartment ? "Edit Staff Department" : "Add Staff Department"} */}
             {editingDepartment 
      ? "Edit Staff Department" 
      : currentStep === 1 
        ? "Create the Department" 
        : currentStep === 2 
          ? "Add time slots for created Department" 
          : "Create staff in this Department"}
          </DialogTitle>
          <DialogDescription>
            {editingDepartment
              ? "Update department information"
              : `Create a new department in ${
                  userFacility?.facility_name || "your facility"
                }`}
          </DialogDescription>
          
          {/* Progress Steps for Add New Department only */}
          {!editingDepartment && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                  ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  1
                </div>
                <span className="ml-2 text-sm">Department</span>
              </div>
              <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                  ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
                <span className="ml-2 text-sm">Time Slots</span>
              </div>
              <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                  ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  3
                </div>
                <span className="ml-2 text-sm">Staff</span>
              </div>
            </div>
          )}
        </DialogHeader>

        {/* <form onSubmit={currentStep === 1 ? handleSubmit : handleTimeSlotSubmit}> */}
        <form onSubmit={getSubmitHandler()}>
  {/* Step 1: Department Information */}
  {currentStep === 1 && !editingDepartment ? (
    <div className="grid gap-4 py-4">
      {/* Show success message if department is created */}
      {departmentCreated ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-green-600">Department Added Successfully!</h3>
          <p className="text-muted-foreground text-center">
            {formData.name} has been added to {userFacility?.facility_name || "your facility"}.<br />
            You can now configure time slots for this department.
          </p>
        </div>
      ) : (
        // Regular department form
        <>
          <div className="grid gap-2">
            <Label htmlFor="name">Department / Services</Label>
            {!isEditMode ? (
              <select
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="">Select your Department</option>
                {departmentOptions
                  .filter(dept => !departments.some(d => d.name === dept && d.facility_id === userFacility?.id))
                  .map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                ))}
              </select>
            ) : (
              <div className="flex h-10 w-full items-center rounded-md border px-3 text-sm bg-gray-100">
                {formData.name || "No department selected"}
              </div>
            )}
          </div>
           {formData.name === "Other" ? (

    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center shadow-sm">

      <div className="flex justify-center mb-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <MessageCircle className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-blue-900">
        Need a Custom Department?
      </h3>

      <p className="text-sm text-blue-700 mt-2 leading-relaxed">
        The selected department is not available right now.
        Please contact our support team to request a new department
        for your facility.
      </p>

      <Button
        type="button"
        className="mt-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
        onClick={
          openContactDialog
        }
      >
        Contact Support
      </Button>

    </div>

  ) : (

    <>
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

          <div className="grid gap-2">
            <Label htmlFor="services">Services</Label>
            <div className="flex gap-2">
              <Input
                id="services"
                value={formData.services}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    services: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && formData.services.trim()) {
                    e.preventDefault();
                    const newService = formData.services.trim();
                    if (!formData.types.includes(newService) && formData.types.length < 10) {
                      setFormData((prev) => ({
                        ...prev,
                        types: [...prev.types, newService],
                        services: "",
                      }));
                    }
                  }
                }}
                placeholder="Type a service and press Enter"
              />
              <Button 
                type="button" 
                onClick={() => {
                  if (formData.services.trim()) {
                    const newService = formData.services.trim();
                    if (!formData.types.includes(newService) && formData.types.length < 10) {
                      setFormData((prev) => ({
                        ...prev,
                        types: [...prev.types, newService],
                        services: "",
                      }));
                    }
                  }
                }}
                disabled={!formData.services.trim()}
              >
                Add
              </Button>
            </div>
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
          </div>

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
          </>)}
        </>
      )}
    </div>
  ) : currentStep === 1 && editingDepartment ? (
    // Edit mode form
    <div className="grid gap-4 py-4">
        <div className="grid gap-2">
            <Label htmlFor="name">Department / Services</Label>
            {!isEditMode ? (
              <>
              <select
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="">Select your Department</option>
                {departmentOptions
                  .filter(dept => !departments.some(d => d.name === dept && d.facility_id === userFacility?.id))
                  .map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                ))}
              </select>
              </>
            ) : (
              <div className="flex h-10 w-full items-center rounded-md border px-3 text-sm bg-gray-100">
                {formData.name || "No department selected"}
              </div>
            )}
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

          <div className="grid gap-2">
            <Label htmlFor="services">Services</Label>
            <div className="flex gap-2">
              <Input
                id="services"
                value={formData.services}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    services: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && formData.services.trim()) {
                    e.preventDefault();
                    const newService = formData.services.trim();
                    if (!formData.types.includes(newService) && formData.types.length < 10) {
                      setFormData((prev) => ({
                        ...prev,
                        types: [...prev.types, newService],
                        services: "",
                      }));
                    }
                  }
                }}
                placeholder="Type a service and press Enter"
              />
              <Button 
                type="button" 
                onClick={() => {
                  if (formData.services.trim()) {
                    const newService = formData.services.trim();
                    if (!formData.types.includes(newService) && formData.types.length < 10) {
                      setFormData((prev) => ({
                        ...prev,
                        types: [...prev.types, newService],
                        services: "",
                      }));
                    }
                  }
                }}
                disabled={!formData.services.trim()}
              >
                Add
              </Button>
            </div>
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
          </div>

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
    </div>
  ) : currentStep === 2 ? (
    // Step 2: Time Slots Configuration
      <div className="grid gap-4 py-4">
      {/* Show success message if department is created */}
      {timeCreated ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-green-600">Time Slots Added Successfully!</h3>
          <p className="text-muted-foreground text-center">
            {formData.name} has been added to {userFacility?.facility_name || "your facility"}.<br />
            You can now configure staff for this department.
          </p>
        </div>
      ) : (
        // Regular department form
        <>
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label>Days of Week</Label>
        <div className="grid grid-cols-2 gap-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={day}
                checked={formData.selectedDays?.includes(day) || false}
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
        {/* <div className="grid gap-2">
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
        </div> */}
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
            min="10"
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
                appointmentType: value,
              }))
            }
            required
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            {/* <SelectContent>
              {appointmentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent> */}
             <SelectContent>
                                            <SelectItem value="consultation">Consultation</SelectItem>
                                            <SelectItem value="tele">TeleConsultation</SelectItem>
                                          </SelectContent>
          </Select>
        </div>
      </div>
    </div>
    </>)}
    </div>
  ) : currentStep === 3 && (
    <div className="grid gap-4 py-4">
                       
                        {!editingStaff && (
                          <>
                            <div className="border-b pb-4">
                              <h3 className="text-lg font-semibold mb-4">User / Services</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="first_name">First Name *</Label>
                                  <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        first_name: e.target.value,
                                      }))
                                    }
                                    placeholder="John"
                                    required
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="last_name">Last Name *</Label>
                                  <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        last_name: e.target.value,
                                      }))
                                    }
                                    placeholder="Doe"
                                    required
                                  />
                                </div>
                              </div>
        
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="email">Email *</Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        email: e.target.value,
                                      }))
                                    }
                                    placeholder="john.doe@hospital.com"
                                    required
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="phone_number">Phone Number</Label>
                                  <Input
                                    id="phone_number"
                                    value={formData.phone_number}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        phone_number: e.target.value,
                                      }))
                                    }
                                    placeholder="+1234567890"
                                  />
                                </div>
                              </div>
        
                              {/* <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="password">Password *</Label>
                                  <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        password: e.target.value,
                                      }))
                                    }
                                    placeholder="••••••••"
                                    required={!editingStaff}
                                    minLength={6}
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Minimum 6 characters
                                  </p>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                  <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        confirmPassword: e.target.value,
                                      }))
                                    }
                                    placeholder="••••••••"
                                    required={!editingStaff}
                                  />
                                </div>
                              </div> */}
                            </div>
                          </>
                        )}
        
                        <div className={!editingStaff ? "pt-4" : ""}>
                          <h3 className="text-lg font-semibold mb-4">Staff Details</h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="employee_id">Employee ID *</Label>
                              <Input
                                id="employee_id"
                                value={formData.employee_id}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    employee_id: e.target.value,
                                  }))
                                }
                                placeholder="EMP-001"
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="position">Position *</Label>
                              <Input
                                id="position"
                                value={formData.position}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    position: e.target.value,
                                  }))
                                }
                                placeholder="e.g., Senior Doctor, Head Nurse"
                                required
                              />
                            </div>
                          </div>
        
                          
        
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="grid gap-2">
                              <Label htmlFor="hire_date">Hire Date *</Label>
                              <Input
                                id="hire_date"
                                type="date"
                                value={formData.hire_date}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    hire_date: e.target.value,
                                  }))
                                }
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="salary">Salary</Label>
                              {/* <Input
                                id="salary"
                                type="number"
                                value={formData.salary}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    salary: parseFloat(e.target.value) || 0,
                                  }))
                                }
                                placeholder="50000"
                                min="0"
                                step="0.01"
                              /> */}
                              <Input
  id="salary"
  type="number"
  value={formData.salary || ''}
  onChange={(e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    setFormData(prev => ({ ...prev, salary: value }));
    if (touchedFields.salary) {
      const error = validateField('salary', value);
      setFieldErrors(prev => ({ ...prev, salary: error }));
    }
  }}
  onBlur={() => handleBlur('salary')}
  className={touchedFields.salary && fieldErrors.salary ? "border-red-500" : ""}
  placeholder="Enter salary"
/>
{renderFieldError('salary')}
                            </div>
                          </div>
        
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="grid gap-2">
                              <Label htmlFor="shift">Shift</Label>
                              <Select
                                value={formData.shift_schedule.shift}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    shift_schedule: {
                                      ...prev.shift_schedule,
                                      shift: value as any,
                                    },
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="morning">Morning</SelectItem>
                                  <SelectItem value="evening">Evening</SelectItem>
                                  <SelectItem value="night">Night</SelectItem>
                                  <SelectItem value="rotating">Rotating</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="is_active">Status</Label>
                              <Select
                                value={formData.is_active.toString()}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    is_active: value === "true",
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Active</SelectItem>
                                  <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
        
                          {editingStaff && (
                            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                              <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> Editing staff member details only. 
                                To change user account information (email, password, name), 
                                please use the user management section.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
  )}
  
  {/* <DialogFooter className="gap-2">
    {currentStep === 1 && !editingDepartment ? (
      departmentCreated ? (
        // After successful creation, show Next button only
        <>
          <Button type="button" variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={() => {
              setCurrentStep(2);
            }}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </>
      ) : (
        // Initial step 1 - Show Add Department button
        <>
          <Button type="button" variant="outline" onClick={resetForm}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading || !formData.name}
          >
            {isLoading ? (
              <>
                <span className="mr-2">Adding...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </>
            ) : (
              "Add Department"
            )}
          </Button>
        </>
      )
    ) : currentStep === 2 && !editingDepartment ? (
      // Step 2 - Show Create Time Slots button
      <>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setCurrentStep(1);
            setDepartmentCreated(true);
          }}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2">Creating...</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </>
          ) : (
            "Create Time Slots"
          )}
        </Button>
      </>
    ) : (
      // For edit mode, show single step form
      <>
        <Button type="button" variant="outline" onClick={resetForm}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="mr-2">Updating...</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </>
          ) : (
            "Update Department"
          )}
        </Button>
      </>
    )}
  </DialogFooter> */}
  {/* <DialogFooter className="gap-2">
  {currentStep === 1 && !editingDepartment ? (
    departmentCreated ? (
      // After successful creation, show Next button only
      <>
        <Button type="button" variant="outline" onClick={resetForm}>
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={() => {
            setCurrentStep(2);
          }}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </>
    ) : (
      // Initial step 1 - Show Add Department button
      <>
        <Button type="button" variant="outline" onClick={resetForm}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !formData.name}
        >
          {isLoading ? (
            <>
              <span className="mr-2">Adding...</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </>
          ) : (
            "Add Department"
          )}
        </Button>
      </>
    )
  ) : currentStep === 2 && !editingDepartment ? (
    // Step 2 - Show Create Time Slots button
     timeCreated ? (
      // After successful creation, show Next button only
      <>
        <Button type="button" variant="outline" onClick={resetForm}>
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={() => {
            setCurrentStep(3);
          }}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </>
    ) : (
    <>
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => {
          setCurrentStep(1);
          setDepartmentCreated(true);
        }}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="mr-2">Creating...</span>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </>
        ) : (
          "Create Time Slots"
        )}
      </Button>
    </>)
  ) : currentStep === 3 && !editingDepartment ? (
    // Step 3 - Show Finish or Go to Staff Management button
    <>
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => {
          setCurrentStep(2);
           setDepartmentCreated(true);
        }}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Button 
  type="submit"
  disabled={isLoading || isCreatingUser}
>
  {isLoading || isCreatingUser ? (
    <>
      <span className="mr-2">Finishing...</span>
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
    </>
  ) : (
    "Finish"
  )}
</Button>
    </>
  ) : (
    // For edit mode, show single step form
    <>
      {/* <Button type="button" variant="outline" onClick={resetForm}>
        Cancel
      </Button> 
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="mr-2">Updating...</span>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </>
        ) : (
          "Update Department"
        )}
      </Button>
    </>
  )}
</DialogFooter> */}
{formData.name !== "Other" &&(
<DialogFooter className="gap-2">
  {currentStep === 1 && editingDepartment  ? (
    // Edit mode - Show Update button only
    <>
      {/* <Button type="button" variant="outline" onClick={resetForm}>
        Cancel
      </Button> */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="mr-2">Updating...</span>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </>
        ) : (
          "Update Department"
        )}
      </Button>
    </>
  ) : currentStep === 1 && !editingDepartment ? (
    // New department mode - Step 1
    departmentCreated ? (
      <>
        <Button type="button" variant="outline" onClick={resetForm}>
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={() => setCurrentStep(2)}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </>
    ) : (
      <>
        <Button type="button" variant="outline" onClick={resetForm}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !formData.name}
        >
          {isLoading ? (
            <>
              <span className="mr-2">Adding...</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </>
          ) : (
            "Add Department"
          )}
        </Button>
      </>
    )
  ) : currentStep === 2 && !editingDepartment ? (
    // New department mode - Step 2
    timeCreated ? (
      <>
        <Button type="button" variant="outline" onClick={resetForm}>
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={() => setCurrentStep(3)}
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </>
    ) : (
      <>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setCurrentStep(1);
            setDepartmentCreated(true);
          }}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="mr-2">Creating...</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </>
          ) : (
            "Create Time Slots"
          )}
        </Button>
      </>
    )
  ) : currentStep === 3 && !editingDepartment ? (
    // New department mode - Step 3
    <>
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => {
          setCurrentStep(2);
          setDepartmentCreated(true);
        }}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Button 
        type="submit"
        disabled={isLoading || isCreatingUser}
      >
        {isLoading || isCreatingUser ? (
          <>
            <span className="mr-2">Finishing...</span>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </>
        ) : (
          "Finish"
        )}
      </Button>
    </>
  ) : null}
</DialogFooter>
)}
</form>
</>
          {/* )} */}
      </DialogContent>
  )}
    </Dialog>

    {/* Time Slots Dialog - Keep this separate for adding time slots to existing departments */}
    {/* <Dialog open={isTimeSlotDialogOpen} onOpenChange={setIsTimeSlotDialogOpen}>
      <DialogTrigger asChild>
        {/* <Button onClick={() => {
          trackTimeSlotAction('add_time_slots_click');
          setEditingSlot(null);
          setIsTimeSlotDialogOpen(true);
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
        <form onSubmit={handleTimeSlotSubmit}>
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
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Days of Week</Label>
              <div className="grid grid-cols-2 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={formData.selectedDays?.includes(day) || false}
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
                      appointmentType: value,
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
              Create Time Slots
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog> */}
  </div>
</div>
      {/* Contact Support Dialog */}
<Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Contact Support</DialogTitle>
      <DialogDescription>
        You have reached the maximum number of departments for your plan.
        Send us a message to request a limit increase.
      </DialogDescription>
    </DialogHeader>
    <form onSubmit={handleContactSubmit} className="space-y-4 mt-4">
      <div>
        <Label htmlFor="contactName">Your Name *</Label>
        <Input
          id="contactName"
          value={contactForm.name}
          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter your name"
          required
        />
      </div>
      <div>
        <Label htmlFor="contactSubject">Subject *</Label>
        <Input
          id="contactSubject"
          value={contactForm.subject}
          onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
          placeholder="e.g., Department limit increase"
          required
        />
      </div>
      <div>
        <Label htmlFor="contactMessage">Message *</Label>
        <Textarea
          id="contactMessage"
          rows={4}
          value={contactForm.message}
          onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Please describe your need for additional departments..."
          required
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={() => setShowContactDialog(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={contactSubmitting}>
          {contactSubmitting ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
          Send Message
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

{showMessage &&(
  <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
          <CardTitle>Department Management</CardTitle>
          <CardDescription>
            Create and manage hospital departments, assign heads, and configure services.
          </CardDescription>
          </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMessage(false)}
            >
              ✕
            </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4 border rounded-lg bg-amber-50 border-amber-200">
            <AlertCircle className="h-12 w-12 text-amber-600 mx-auto" />
            <h3 className="text-lg font-semibold text-amber-800">
              Department Management is not available in your current subscription.
            </h3>
            <p className="text-amber-700 max-w-md mx-auto">
              Please upgrade your subscription plan to create departments,
              manage services, and enable full department management features.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => setShowContactPopup(true)}
            >
              <PhoneIcon className="mr-2 h-4 w-4 m-3" />
              Contact Support
            </Button>
            <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => navigate ("/dashboard/facility/subscription")}
                          >
                            <SubscriptIcon className="mr-2 h-4 w-4" />
                            Subscription
                          </Button>
                          </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showContactPopup} onOpenChange={setShowContactPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Support for Department Management</DialogTitle>
            <DialogDescription>
              Our support team will help you activate department management features.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center space-x-2 py-6">
            <PhoneIcon className="h-5 w-5 text-primary" />
            <a href="tel:+919886499994" className="text-xl font-medium text-primary underline">
              +91 98864 99994
            </a>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactPopup(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
)}

      {/* <Card>
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
                  {/* <TableHead>Head Doctor</TableHead> 
                  <TableHead>Services</TableHead>
                  <TableHead>Staff Count</TableHead>
                  <TableHead>Operating Hours</TableHead>
                  {/* <TableHead>Beds</TableHead> 
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
                    {/* <TableCell>
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
                    </TableCell> 
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
                    </TableCell> 
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
                        {department.name !== "Bed Management" &&
                        <Button
                          size="sm"
                          variant="outline"
                     onClick={() => {
    trackDepartmentAction('delete_click', department);
    handleDelete(department.id);

  }} 

                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card> */}
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
      <>
        {/* Desktop table view – hidden on mobile/tablet */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Staff Count</TableHead>
                <TableHead>Operating Hours</TableHead>
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
                    <div className="max-w-xs">
                      {Array.isArray(department.services) &&
                      department.services.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {department.services.slice(0, 3).map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
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
                      {department.staffCount || "N/A"}
                    </div>
                  </TableCell>
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
                                  slot =>
                                    slot.day_of_week ===
                                    new Date().toLocaleDateString("en-US", {
                                      weekday: "long",
                                    })
                                )
                              ).map((line, i) => (
                                <p key={i} className="text-sm">
                                  {line}
                                </p>
                              ))}
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
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
                          trackDepartmentAction("edit_click", department);
                          handleEdit(department);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {department.name !== "Bed Management" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            trackDepartmentAction("delete_click", department);
                            handleDelete(department.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile/Tablet card view – visible below md breakpoint */}
        <div className="md:hidden space-y-4">
          {departments.map((department) => (
            <div
              key={department.id}
              className="border rounded-lg p-4 bg-white shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-base">{department.name}</h3>
                  {department.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {department.description}
                    </p>
                  )}
                </div>
                <Badge className={getStatusColor(department.is_active)}>
                  {department.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Staff:</span>{" "}
                  <div className="flex items-center mt-0.5">
                    <Users className="mr-1 h-3 w-3" />
                    {department.staffCount || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Hours:</span>
                  <div className="flex items-center mt-0.5">
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
                                  slot =>
                                    slot.day_of_week ===
                                    new Date().toLocaleDateString("en-US", {
                                      weekday: "long",
                                    })
                                )
                              ).map((line, i) => (
                                <p key={i} className="text-sm">
                                  {line}
                                </p>
                              ))}
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Services:</span>
                <div className="mt-1">
                  {Array.isArray(department.services) &&
                  department.services.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {department.services.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
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
                    <span className="text-xs text-muted-foreground">
                      No services listed
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    trackDepartmentAction("edit_click", department);
                    handleEdit(department);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                {department.name !== "Bed Management" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      trackDepartmentAction("delete_click", department);
                      handleDelete(department.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </CardContent>
</Card>
    </div>
  );
};

export default DepartmentManagement;