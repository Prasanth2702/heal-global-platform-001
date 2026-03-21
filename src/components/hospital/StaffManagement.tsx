// // import { useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Badge } from "@/components/ui/badge";
// // import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { Plus, Edit, Trash2, Users, Phone, Mail, Calendar } from "lucide-react";
// // import { useToast } from "@/hooks/use-toast";

// // interface Staff {
// //   id: string;
// //   name: string;
// //   role: "Doctor" | "Nurse" | "Physiotherapist" | "Allied Staff" | "Technician" | "Administrator";
// //   department: string;
// //   specialization?: string;
// //   phone: string;
// //   email: string;
// //   qualification: string;
// //   experience: number;
// //   joiningDate: string;
// //   status: "active" | "inactive" | "on-leave";
// //   shift: "morning" | "evening" | "night" | "rotating";
// // }

// // const StaffManagement = () => {
// //   const { toast } = useToast();
// //   const [staff, setStaff] = useState<Staff[]>([
// //     {
// //       id: "1",
// //       name: "Dr. Rajesh Kumar",
// //       role: "Doctor",
// //       department: "General OPD",
// //       specialization: "General Medicine",
// //       phone: "+91-9876543210",
// //       email: "rajesh.kumar@hospital.com",
// //       qualification: "MBBS, MD",
// //       experience: 12,
// //       joiningDate: "2020-01-15",
// //       status: "active",
// //       shift: "morning"
// //     },
// //     {
// //       id: "2",
// //       name: "Sister Mary Joseph",
// //       role: "Nurse",
// //       department: "General OPD",
// //       phone: "+91-9876543211",
// //       email: "mary.joseph@hospital.com",
// //       qualification: "BSc Nursing",
// //       experience: 8,
// //       joiningDate: "2021-03-10",
// //       status: "active",
// //       shift: "rotating"
// //     },
// //     {
// //       id: "3",
// //       name: "Mr. Amit Physio",
// //       role: "Physiotherapist",
// //       department: "Rehabilitation",
// //       specialization: "Sports Injury",
// //       phone: "+91-9876543212",
// //       email: "amit.physio@hospital.com",
// //       qualification: "BPT, MPT",
// //       experience: 6,
// //       joiningDate: "2022-06-01",
// //       status: "active",
// //       shift: "morning"
// //     }
// //   ]);

// //   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
// //   const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
// //   const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     role: "Doctor" as Staff["role"],
// //     department: "",
// //     specialization: "",
// //     phone: "",
// //     email: "",
// //     qualification: "",
// //     experience: 0,
// //     joiningDate: "",
// //     shift: "morning" as Staff["shift"]
// //   });

// //   const departments = ["General OPD", "Radiology", "Pathology Lab", "In-house Pharmacy", "Emergency", "Surgery", "ICU"];
// //   const roles = ["Doctor", "Nurse", "Physiotherapist", "Allied Staff", "Technician", "Administrator"];
// //   const shifts = ["morning", "evening", "night", "rotating"];

// //   const filteredStaff = selectedDepartment === "all" 
// //     ? staff 
// //     : staff.filter(s => s.department === selectedDepartment);

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
    
// //     if (editingStaff) {
// //       setStaff(prev => prev.map(s => 
// //         s.id === editingStaff.id 
// //           ? { ...s, ...formData, status: s.status }
// //           : s
// //       ));
// //       toast({
// //         title: "Staff Updated",
// //         description: `${formData.name}'s profile has been updated.`,
// //       });
// //       setEditingStaff(null);
// //     } else {
// //       const newStaff: Staff = {
// //         id: Date.now().toString(),
// //         ...formData,
// //         status: "active"
// //       };
// //       setStaff(prev => [...prev, newStaff]);
// //       toast({
// //         title: "Staff Added",
// //         description: `${formData.name} has been added to the team.`,
// //       });
// //     }
    
// //     setFormData({
// //       name: "",
// //       role: "Doctor",
// //       department: "",
// //       specialization: "",
// //       phone: "",
// //       email: "",
// //       qualification: "",
// //       experience: 0,
// //       joiningDate: "",
// //       shift: "morning"
// //     });
// //     setIsAddDialogOpen(false);
// //   };

// //   const handleEdit = (staffMember: Staff) => {
// //     setEditingStaff(staffMember);
// //     setFormData({
// //       name: staffMember.name,
// //       role: staffMember.role,
// //       department: staffMember.department,
// //       specialization: staffMember.specialization || "",
// //       phone: staffMember.phone,
// //       email: staffMember.email,
// //       qualification: staffMember.qualification,
// //       experience: staffMember.experience,
// //       joiningDate: staffMember.joiningDate,
// //       shift: staffMember.shift
// //     });
// //     setIsAddDialogOpen(true);
// //   };

// //   const handleDelete = (id: string) => {
// //     const staffMember = staff.find(s => s.id === id);
// //     setStaff(prev => prev.filter(s => s.id !== id));
// //     toast({
// //       title: "Staff Removed",
// //       description: `${staffMember?.name} has been removed from the team.`,
// //     });
// //   };

// //   const getStatusColor = (status: string) => {
// //     switch (status) {
// //       case "active":
// //         return "bg-green-100 text-green-800";
// //       case "inactive":
// //         return "bg-red-100 text-red-800";
// //       case "on-leave":
// //         return "bg-yellow-100 text-yellow-800";
// //       default:
// //         return "bg-gray-100 text-gray-800";
// //     }
// //   };

// //   const getRoleColor = (role: string) => {
// //     switch (role) {
// //       case "Doctor":
// //         return "bg-blue-100 text-blue-800";
// //       case "Nurse":
// //         return "bg-pink-100 text-pink-800";
// //       case "Physiotherapist":
// //         return "bg-purple-100 text-purple-800";
// //       default:
// //         return "bg-gray-100 text-gray-800";
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h2 className="text-2xl font-bold">Staff Management</h2>
// //           <p className="text-muted-foreground">
// //             Manage hospital staff across all departments
// //           </p>
// //         </div>
// //         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
// //           <DialogTrigger asChild>
// //             <Button onClick={() => setEditingStaff(null)}>
// //               <Plus className="mr-2 h-4 w-4" />
// //               Add Staff Member
// //             </Button>
// //           </DialogTrigger>
// //           <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
// //             <DialogHeader>
// //               <DialogTitle>
// //                 {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
// //               </DialogTitle>
// //               <DialogDescription>
// //                 {editingStaff ? "Update staff member information" : "Add a new team member to your hospital"}
// //               </DialogDescription>
// //             </DialogHeader>
// //             <form onSubmit={handleSubmit}>
// //               <div className="grid gap-4 py-4">
// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="name">Full Name</Label>
// //                     <Input
// //                       id="name"
// //                       value={formData.name}
// //                       onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
// //                       placeholder="Enter full name"
// //                       required
// //                     />
// //                   </div>
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="role">Role</Label>
// //                     <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as Staff["role"] }))}>
// //                       <SelectTrigger>
// //                         <SelectValue />
// //                       </SelectTrigger>
// //                       <SelectContent>
// //                         {roles.map(role => (
// //                           <SelectItem key={role} value={role}>{role}</SelectItem>
// //                         ))}
// //                       </SelectContent>
// //                     </Select>
// //                   </div>
// //                 </div>
                
// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="department">Department</Label>
// //                     <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
// //                       <SelectTrigger>
// //                         <SelectValue placeholder="Select department" />
// //                       </SelectTrigger>
// //                       <SelectContent>
// //                         {departments.map(dept => (
// //                           <SelectItem key={dept} value={dept}>{dept}</SelectItem>
// //                         ))}
// //                       </SelectContent>
// //                     </Select>
// //                   </div>
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="specialization">Specialization</Label>
// //                     <Input
// //                       id="specialization"
// //                       value={formData.specialization}
// //                       onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
// //                       placeholder="e.g., Cardiology, General"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="phone">Phone Number</Label>
// //                     <Input
// //                       id="phone"
// //                       value={formData.phone}
// //                       onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
// //                       placeholder="+91-XXXXXXXXXX"
// //                       required
// //                     />
// //                   </div>
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="email">Email</Label>
// //                     <Input
// //                       id="email"
// //                       type="email"
// //                       value={formData.email}
// //                       onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
// //                       placeholder="email@hospital.com"
// //                       required
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="qualification">Qualification</Label>
// //                     <Input
// //                       id="qualification"
// //                       value={formData.qualification}
// //                       onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
// //                       placeholder="e.g., MBBS, MD"
// //                       required
// //                     />
// //                   </div>
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="experience">Experience (Years)</Label>
// //                     <Input
// //                       id="experience"
// //                       type="number"
// //                       value={formData.experience}
// //                       onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
// //                       placeholder="0"
// //                       min="0"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="joiningDate">Joining Date</Label>
// //                     <Input
// //                       id="joiningDate"
// //                       type="date"
// //                       value={formData.joiningDate}
// //                       onChange={(e) => setFormData(prev => ({ ...prev, joiningDate: e.target.value }))}
// //                       required
// //                     />
// //                   </div>
// //                   <div className="grid gap-2">
// //                     <Label htmlFor="shift">Shift</Label>
// //                     <Select value={formData.shift} onValueChange={(value) => setFormData(prev => ({ ...prev, shift: value as Staff["shift"] }))}>
// //                       <SelectTrigger>
// //                         <SelectValue />
// //                       </SelectTrigger>
// //                       <SelectContent>
// //                         {shifts.map(shift => (
// //                           <SelectItem key={shift} value={shift}>{shift}</SelectItem>
// //                         ))}
// //                       </SelectContent>
// //                     </Select>
// //                   </div>
// //                 </div>
// //               </div>
// //               <DialogFooter>
// //                 <Button type="submit">
// //                   {editingStaff ? "Update Staff Member" : "Add Staff Member"}
// //                 </Button>
// //               </DialogFooter>
// //             </form>
// //           </DialogContent>
// //         </Dialog>
// //       </div>

// //       <div className="flex items-center space-x-4">
// //         <Label htmlFor="department-filter">Filter by Department:</Label>
// //         <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
// //           <SelectTrigger className="w-[200px]">
// //             <SelectValue />
// //           </SelectTrigger>
// //           <SelectContent>
// //             <SelectItem value="all">All Departments</SelectItem>
// //             {departments.map(dept => (
// //               <SelectItem key={dept} value={dept}>{dept}</SelectItem>
// //             ))}
// //           </SelectContent>
// //         </Select>
// //       </div>

// //       <Card>
// //         <CardHeader>
// //           <CardTitle className="flex items-center">
// //             <Users className="mr-2 h-5 w-5" />
// //             Staff Directory
// //           </CardTitle>
// //           <CardDescription>
// //             {filteredStaff.length} staff members
// //             {selectedDepartment !== "all" && ` in ${selectedDepartment}`}
// //           </CardDescription>
// //         </CardHeader>
// //         <CardContent>
// //           <Table>
// //             <TableHeader>
// //               <TableRow>
// //                 <TableHead>Name & Contact</TableHead>
// //                 <TableHead>Role & Department</TableHead>
// //                 <TableHead>Qualification</TableHead>
// //                 <TableHead>Experience</TableHead>
// //                 <TableHead>Shift</TableHead>
// //                 <TableHead>Status</TableHead>
// //                 <TableHead>Actions</TableHead>
// //               </TableRow>
// //             </TableHeader>
// //             <TableBody>
// //               {filteredStaff.map((staffMember) => (
// //                 <TableRow key={staffMember.id}>
// //                   <TableCell>
// //                     <div>
// //                       <p className="font-medium">{staffMember.name}</p>
// //                       <div className="flex items-center space-x-2 mt-1">
// //                         <Phone className="h-3 w-3 text-muted-foreground" />
// //                         <span className="text-sm text-muted-foreground">{staffMember.phone}</span>
// //                       </div>
// //                       <div className="flex items-center space-x-2">
// //                         <Mail className="h-3 w-3 text-muted-foreground" />
// //                         <span className="text-sm text-muted-foreground">{staffMember.email}</span>
// //                       </div>
// //                     </div>
// //                   </TableCell>
// //                   <TableCell>
// //                     <div>
// //                       <Badge className={getRoleColor(staffMember.role)} variant="outline">
// //                         {staffMember.role}
// //                       </Badge>
// //                       <p className="text-sm text-muted-foreground mt-1">{staffMember.department}</p>
// //                       {staffMember.specialization && (
// //                         <p className="text-xs text-muted-foreground">{staffMember.specialization}</p>
// //                       )}
// //                     </div>
// //                   </TableCell>
// //                   <TableCell>{staffMember.qualification}</TableCell>
// //                   <TableCell>
// //                     <div className="flex items-center">
// //                       <Calendar className="mr-1 h-3 w-3" />
// //                       {staffMember.experience} years
// //                     </div>
// //                   </TableCell>
// //                   <TableCell>
// //                     <Badge variant="outline">{staffMember.shift}</Badge>
// //                   </TableCell>
// //                   <TableCell>
// //                     <Badge className={getStatusColor(staffMember.status)}>
// //                       {staffMember.status}
// //                     </Badge>
// //                   </TableCell>
// //                   <TableCell>
// //                     <div className="flex space-x-2">
// //                       <Button
// //                         size="sm"
// //                         variant="outline"
// //                         onClick={() => handleEdit(staffMember)}
// //                       >
// //                         <Edit className="h-3 w-3" />
// //                       </Button>
// //                       <Button
// //                         size="sm"
// //                         variant="outline"
// //                         onClick={() => handleDelete(staffMember.id)}
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

// // export default StaffManagement;

// import { useState, useEffect } from "react";
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
// import {
//   Plus,
//   Edit,
//   Trash2,
//   Users,
//   Phone,
//   Mail,
//   Calendar,
//   Building,
// } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
// import mixpanelInstance from "@/utils/mixpanel";
// // Types based on your Supabase schema
// interface Profile {
//   id: string;
//   user_id: string;
//   email: string;
//   phone_number: string;
//   role: string;
//   first_name: string;
//   last_name: string;
//   avatar_url?: string;
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

// interface Facility {
//   id: string;
//   facility_name: string;
//   facility_type: string;
//   city: string;
//   state: string;
// }

// interface Staff {
//   id: string;
//   facility_id: string;
//   user_id: string;
//   department_id: string;
//   position: string;
//   employee_id: string;
//   hire_date: string;
//   salary: number;
//   shift_schedule: {
//     shift: "morning" | "evening" | "night" | "rotating";
//     start_time?: string;
//     end_time?: string;
//   };
//   permissions: any;
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
//   profile?: Profile;
//   department?: Department;
//   facility?: Facility;
// }

// interface CombinedStaffData extends Staff {
//   profile: Profile;
//   department: Department;
//   facility: Facility;
// }

// const StaffManagement = () => {
//   const { toast } = useToast();
//   const [staff, setStaff] = useState<CombinedStaffData[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [facilities, setFacilities] = useState<Facility[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [editingStaff, setEditingStaff] = useState<CombinedStaffData | null>(null);
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
//   const [selectedFacility, setSelectedFacility] = useState<string>("all");

//   const [formData, setFormData] = useState({
//     user_id: "",
//     employee_id: "",
//     position: "",
//     department_id: "",
//     facility_id: "",
//     hire_date: "",
//     salary: 0,
//     shift_schedule: {
//       shift: "morning" as "morning" | "evening" | "night" | "rotating",
//       start_time: "09:00",
//       end_time: "17:00",
//     },
//     permissions: {},
//     is_active: true,
//   });

//   // Track if current user already has a staff record
//   const [currentUserId, setCurrentUserId] = useState<string>("");
//   const [userHasStaff, setUserHasStaff] = useState<boolean>(false);
// // Add tracking functions
// const trackStaffAction = (action: string, staffData?: any, additionalData = {}) => {
//   mixpanelInstance.track('Staff Management Action', {
//     action,
//     staffId: staffData?.id,
//     staffName: staffData?.profile ? 
//       `${staffData.profile.first_name} ${staffData.profile.last_name}` : undefined,
//     departmentId: staffData?.department_id,
//     facilityId: staffData?.facility_id,
//     ...additionalData
//   });
// };

//   useEffect(() => {
//     // Get current user id
//     const fetchUser = async () => {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (user && user.id) {
//         setCurrentUserId(user.id);
//       }
//     };
//     fetchUser();
//   }, []);

//    // Add maintenance access check
//   const [isMaintenance, setIsMaintenance] = useState(false);
//   const [maintenanceDeptId, setMaintenanceDeptId] = useState<string | null>(null);
  
//   // Check if current user is maintenance staff
//   useEffect(() => {
//     const checkMaintenanceAccess = async () => {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (!user) return;

//       try {
//         // Find Maintenance department
//         const { data: deptData } = await supabase
//           .from("departments")
//           .select("id")
//           .ilike("name", "%maintenance%")
//           .maybeSingle();

//         if (deptData) {
//           setMaintenanceDeptId(deptData.id);

//           // Check if user is in Maintenance department
//           const { data: staffData } = await supabase
//             .from("staff")
//             .select("id")
//             .eq("user_id", user.id)
//             .eq("department_id", deptData.id)
//             .eq("is_active", true)
//             .maybeSingle();

//           setIsMaintenance(!!staffData);
//         }
//       } catch (error) {
//         console.error("Error checking maintenance access:", error);
//       }
//     };

//     checkMaintenanceAccess();
//   }, []);
//   useEffect(() => {
//     // Check if current user has a staff record
//     if (currentUserId && staff.length > 0) {
//       setUserHasStaff(staff.some(s => s.user_id === currentUserId));
//     }
//   }, [currentUserId, staff]);

//   // Fetch initial data
//   useEffect(() => {
//     fetchData();
//   }, []);

// const fetchData = async () => {
//   try {
//     setIsLoading(true);

//     /* ============================
//        1. FETCH STAFF
//     ============================ */
//     const { data: staffData, error: staffError } = await supabase
//       .from("staff")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (staffError) throw staffError;

//     /* ============================
//        2. FETCH PROFILES
//     ============================ */
//     const { data: profilesData, error: profilesError } = await supabase
//       .from("profiles")
//       .select("*");

//     if (profilesError) throw profilesError;

//     /* ============================
//        3. FETCH DEPARTMENTS
//     ============================ */
//     const { data: departmentsData, error: deptError } = await supabase
//       .from("departments")
//       .select("id, name")
//       .eq("is_active", true);

//     if (deptError) throw deptError;

//     /* ============================
//        4. FETCH FACILITIES
//     ============================ */
//     const { data: facilitiesData, error: facilityError } = await supabase
//       .from("facilities")
//       .select("id, facility_name, facility_type, city, state");

//     if (facilityError) throw facilityError;

//     /* ============================
//        5. CREATE LOOKUP MAPS
//     ============================ */
//     const profileMap = new Map(profilesData?.map((p) => [p.user_id, p]));

//     const departmentMap = new Map(departmentsData?.map((d) => [d.id, d]));

//     const facilityMap = new Map(facilitiesData?.map((f) => [f.id, f]));

//     /* ============================
//        6. MERGE DATA
//     ============================ */
//     const combinedStaff: CombinedStaffData[] =
//       staffData?.map((staff) => ({
//         ...staff,
//         profile: profileMap.get(staff.user_id),
//         department: departmentMap.get(staff.department_id),
//         facility: facilityMap.get(staff.facility_id),
//       })) || [];

//     /* ============================
//        7. SET STATE
//     ============================ */
//     setStaff(combinedStaff);
//     setDepartments(departmentsData || []);
//     setFacilities(facilitiesData || []);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     toast({
//       title: "Error",
//       description: "Failed to load staff data",
//       variant: "destructive",
//     });
//   } finally {
//     setIsLoading(false);
//   }
// };


//   const filteredStaff = staff.filter((s) => {
//     const departmentMatch =
//       selectedDepartment === "all" || s.department_id === selectedDepartment;
//     const facilityMatch =
//       selectedFacility === "all" || s.facility_id === selectedFacility;
//     return departmentMatch && facilityMatch;
//   });

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   trackStaffAction(editingStaff ? 'edit_attempt' : 'add_attempt', 
//     editingStaff, { employee_id: formData.employee_id, position: formData.position });
//   // Validate required UUID fields are not empty
//   if (!formData.facility_id || formData.facility_id.trim() === "") {
//     toast({
//       title: "Facility Required",
//       description: "Please select a facility.",
//       variant: "destructive",
//     });

//     return;
//   }
//   if (!formData.department_id || formData.department_id.trim() === "") {
//     toast({
//       title: "Department Required",
//       description: "Please select a department.",
//       variant: "destructive",
//     });
//     return;
//   }

//   try {
//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     if (userError || !user) {
//       toast({
//         title: "Error",
//         description: "User not authenticated. Please log in again.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Check for duplicate employee_id in the same facility
//     const { data: duplicateStaff, error: dupError } = await supabase
//       .from("staff")
//       .select("id")
//       .eq("facility_id", formData.facility_id)
//       .eq("employee_id", formData.employee_id);
//     if (dupError) {
//       toast({
//         title: "Error",
//         description: "Failed to check for duplicate Employee ID.",
//         variant: "destructive",
//       });
//       return;
//     }
//     // if (duplicateStaff && duplicateStaff.length > 0) {
//     //   toast({
//     //     title: "Duplicate Employee ID",
//     //     description: `Employee ID '${formData.employee_id}' already exists in this facility. Please use a unique Employee ID for each facility.`,
//     //     variant: "destructive",
//     //   });
//     //   return;
//     // }
//     // Prepare the data with the current user's ID
//     const staffData = {
//       ...formData,
//       user_id: formData.user_id && formData.user_id.trim() !== "" ? formData.user_id : user.id, // Use form data user_id if provided and not empty, otherwise use current user
//       updated_at: new Date().toISOString(),
//     };

//     if (editingStaff) {
//       // Update existing staff
//       const { error } = await supabase
//         .from("staff")
//         .update(staffData)
//         .eq("id", editingStaff.id);

//       if (error) throw error;

//       toast({
//         title: "Staff Updated",
//         description: `Staff member has been updated successfully.`,
//       });
//     } else {
//       // Add new staff - always use current user's ID for new staff
//       const finalData = {
//         ...staffData,
//         user_id: user.id, // Always use current user's ID for new staff
//         created_at: new Date().toISOString(),
//       };

//       const { data, error } = await supabase
//         .from("staff")
//         .insert([finalData])
//         .select()
//         .single();

//       if (error) throw error;

//       toast({
//         title: "Staff Added",
//         description: `New staff member has been added successfully.`,
//       });
//     }
//  trackStaffAction(editingStaff ? 'edit_success' : 'add_success', 
//       { employee_id: formData.employee_id });
//     // Reset form and refresh data
//     resetForm();
//     fetchData();
//   } catch (error) {
//     console.error("Error saving staff:", error);
//     toast({
//       title: "Error",
//       description: "Failed to save staff data",
//       variant: "destructive",
//     });
//     trackStaffAction(editingStaff ? 'edit_failed' : 'add_failed', 
//       undefined, { error: error.message });
//   }
// };

//   const handleEdit = (staffMember: CombinedStaffData) => {
//     setEditingStaff(staffMember);
//     setFormData({
//       user_id: staffMember.user_id,
//       employee_id: staffMember.employee_id,
//       position: staffMember.position,
//       department_id: staffMember.department_id,
//       facility_id: staffMember.facility_id,
//       hire_date: staffMember.hire_date,
//       salary: staffMember.salary,
//       shift_schedule: {
//         shift: staffMember.shift_schedule.shift,
//         start_time: staffMember.shift_schedule.start_time,
//         end_time: staffMember.shift_schedule.end_time,
//       },
//       permissions: staffMember.permissions,
//       is_active: staffMember.is_active,
//     });
//     setIsAddDialogOpen(true);
//     trackStaffAction('edit_opened', staffMember, { employee_id: staffMember.employee_id });
//   };

//   const handleDelete = async (id: string) => {
//     trackStaffAction('delete_attempt', { id }); 
//     try {
//       const staffMember = staff.find((s) => s.id === id);

//       const { error } = await supabase.from("staff").delete().eq("id", id);

//       if (error) throw error;

//       setStaff((prev) => prev.filter((s) => s.id !== id));
//       toast({
//         title: "Staff Removed",
//         description: `${staffMember?.profile?.first_name} ${staffMember?.profile?.last_name} has been removed.`,
//       });
//       trackStaffAction('delete_success', staffMember, { employee_id: staffMember?.employee_id });
//     } catch (error) {
//       console.error("Error deleting staff:", error);
//       toast({
//         title: "Error",
//         description: "Failed to delete staff member",
//         variant: "destructive",
//       });
//       trackStaffAction('delete_failed', undefined, { error: error.message });
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       user_id: "",
//       employee_id: "",
//       position: "",
//       department_id: "",
//       facility_id: "",
//       hire_date: "",
//       salary: 0,
//       shift_schedule: {
//         shift: "morning" as "morning" | "evening" | "night" | "rotating",
//         start_time: "09:00",
//         end_time: "17:00",
//       },
//       permissions: {},
//       is_active: true,
//     });
//     setEditingStaff(null);
//     setIsAddDialogOpen(false);
//   };

//   const getStatusColor = (isActive: boolean) => {
//     return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
//   };

//   const getPositionColor = (position: string) => {
//     const positionLower = position.toLowerCase();
//     if (positionLower.includes("doctor") || positionLower.includes("dr")) {
//       return "bg-blue-100 text-blue-800";
//     } else if (positionLower.includes("nurse")) {
//       return "bg-pink-100 text-pink-800";
//     } else if (
//       positionLower.includes("therapist") ||
//       positionLower.includes("physio")
//     ) {
//       return "bg-purple-100 text-purple-800";
//     } else {
//       return "bg-gray-100 text-gray-800";
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   // Add to filter changes
// const handleFacilityFilter = (value: string) => {
//   trackStaffAction('filter_by_facility', undefined, { 
//     fromFilter: selectedFacility, 
//     toFilter: value 
//   });
//   setSelectedFacility(value);
// };

// const handleDepartmentFilter = (value: string) => {
//   trackStaffAction('filter_by_department', undefined, { 
//     fromFilter: selectedDepartment, 
//     toFilter: value 
//   });
//   setSelectedDepartment(value);
// };

//   const calculateExperience = (hireDate: string) => {
//     const hire = new Date(hireDate);
//     const today = new Date();
//     const years = today.getFullYear() - hire.getFullYear();
//     const months = today.getMonth() - hire.getMonth();

//     if (months < 0) {
//       return `${years - 1} years, ${12 + months} months`;
//     }
//     return `${years} years, ${months} months`;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-2 text-muted-foreground">Loading staff data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Staff Management</h2>
//           <p className="text-muted-foreground">
//             Manage hospital staff across all departments and facilities
//           </p>
//         </div>
//         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//           {/* <DialogTrigger asChild>
//             <Button
//               onClick={() => setEditingStaff(null)}
//               disabled={userHasStaff && !editingStaff}
//               title={userHasStaff && !editingStaff ? "You can only apply as staff once." : undefined}
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               Add Staff Member
//             </Button>
//           </DialogTrigger> */}
//             <DialogTrigger asChild>
//     {(isMaintenance || !userHasStaff || editingStaff) ? (
//       <Button   onClick={() => {
//     trackStaffAction('add_staff_click');
//     setEditingStaff(null);
//     setIsAddDialogOpen(true);
//   }}>
//         <Plus className="mr-2 h-4 w-4" />
//         Add Staff Member
//       </Button>
//     ) : (
//       <Button 
//         disabled 
//         variant="outline"
//         title="Only maintenance staff can add multiple staff members"
//       >
//         <Plus className="mr-2 h-4 w-4" />
//         Add Staff Member
//       </Button>
//     )}
//   </DialogTrigger>
//           <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>
//                 {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
//               </DialogTitle>
//               <DialogDescription>
//                 {editingStaff
//                   ? "Update staff member information"
//                   : "Add a new team member to your hospital"}
//               </DialogDescription>
//             </DialogHeader>
//             <form onSubmit={handleSubmit}>
//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="employee_id">Employee ID</Label>
//                     <Input
//                       id="employee_id"
//                       value={formData.employee_id}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           employee_id: e.target.value,
//                         }))
//                       }
//                       placeholder="EMP-001"
//                       required
//                     />
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="position">Position</Label>
//                     <Input
//                       id="position"
//                       value={formData.position}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           position: e.target.value,
//                         }))
//                       }
//                       placeholder="e.g., Senior Doctor, Head Nurse"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   {/* <div className="grid gap-2">
//                     <Label htmlFor="facility_id">Facility</Label>
//                     <Select
//                       value={formData.facility_id}
//                       onValueChange={(value) =>
//                         setFormData((prev) => ({ ...prev, facility_id: value }))
//                       }
//                       required
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select facility" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {facilities.map((facility) => (
//                           <SelectItem key={facility.id} value={facility.id}>
//                             {facility.facility_name} ({facility.city})
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                       <SelectContent>
//                         {departments.map((dept) => (
//                           <SelectItem key={dept.id} value={dept.id}>
//                             {dept.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div> */}
//                   <div className="grid gap-2">
//                     <Label htmlFor="department_id">Department</Label>
//                     <Select
//                       value={formData.department_id}
//                       onValueChange={(value) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           department_id: value,
//                         }))
//                       }
//                       required
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select department" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {departments.map((dept) => (
//                           <SelectItem key={dept.id} value={dept.id}>
//                             {dept.type}{dept.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>

                      
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="hire_date">Hire Date</Label>
//                     <Input
//                       id="hire_date"
//                       type="date"
//                       value={formData.hire_date}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           hire_date: e.target.value,
//                         }))
//                       }
//                       required
//                     />
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="salary">Salary</Label>
//                     <Input
//                       id="salary"
//                       type="number"
//                       value={formData.salary}
//                       onChange={(e) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           salary: parseFloat(e.target.value) || 0,
//                         }))
//                       }
//                       placeholder="50000"
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="grid gap-2">
//                     <Label htmlFor="shift">Shift</Label>
//                     <Select
//                       value={formData.shift_schedule.shift}
//                       onValueChange={(value) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           shift_schedule: {
//                             ...prev.shift_schedule,
//                             shift: value as any,
//                           },
//                         }))
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="morning">Morning</SelectItem>
//                         <SelectItem value="evening">Evening</SelectItem>
//                         <SelectItem value="night">Night</SelectItem>
//                         <SelectItem value="rotating">Rotating</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="grid gap-2">
//                     <Label htmlFor="is_active">Status</Label>
//                     <Select
//                       value={formData.is_active.toString()}
//                       onValueChange={(value) =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           is_active: value === "true",
//                         }))
//                       }
//                     >
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="true">Active</SelectItem>
//                         <SelectItem value="false">Inactive</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//               </div>
//               <DialogFooter>
//                 <Button type="button" variant="outline" onClick={resetForm}>
//                   Cancel
//                 </Button>
//                 <Button type="submit">
//                   {editingStaff ? "Update Staff Member" : "Add Staff Member"}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="facility-filter">Filter by Facility:</Label>
//           <Select value={selectedFacility} onValueChange={setSelectedFacility}>
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Facilities</SelectItem>
//               {facilities.map((facility) => (
//                 <SelectItem key={facility.id} value={facility.id}>
//                   {facility.facility_name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="department-filter">Filter by Department:</Label>
//           <Select
//             value={selectedDepartment}
//             onValueChange={setSelectedDepartment}
//           >
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Departments</SelectItem>
//               {departments.map((dept) => (
//                 <SelectItem key={dept.id} value={dept.id}>
//                   {dept.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Users className="mr-2 h-5 w-5" />
//             Staff Directory
//           </CardTitle>
//           <CardDescription>
//             {filteredStaff.length} staff members
//             {selectedFacility !== "all" && ` in selected facility`}
//             {selectedDepartment !== "all" && ` and department`}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {filteredStaff.length === 0 ? (
//             <div className="text-center py-8">
//               <Users className="h-12 w-12 mx-auto text-muted-foreground" />
//               <h3 className="mt-4 text-lg font-semibold">No Staff Members</h3>
//               <p className="text-muted-foreground mt-2">
//                 {selectedDepartment !== "all" || selectedFacility !== "all"
//                   ? "No staff found with the selected filters."
//                   : "Get started by adding your first staff member."}
//               </p>
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Staff Details</TableHead>
//                   <TableHead>Position & Department</TableHead>
//                   {/* <TableHead>Facility</TableHead> */}
//                   <TableHead>Experience</TableHead>
//                   <TableHead>Shift</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredStaff.map((staffMember) => (
//                   <TableRow key={staffMember.id}>
//                     <TableCell>
//                       <div>
//                         <p className="font-medium">
//                           {staffMember.profile?.first_name}{" "}
//                           {staffMember.profile?.last_name}
//                         </p>
//                         <p className="text-sm text-muted-foreground">
//                           {staffMember.employee_id}
//                         </p>
//                         <div className="flex items-center space-x-2 mt-1">
//                           <Phone className="h-3 w-3 text-muted-foreground" />
//                           <span className="text-sm text-muted-foreground">
//                             {staffMember.profile?.phone_number || "N/A"}
//                           </span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Mail className="h-3 w-3 text-muted-foreground" />
//                           <span className="text-sm text-muted-foreground">
//                             {staffMember.profile?.email || "N/A"}
//                           </span>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div>
//                         <Badge
//                           className={getPositionColor(staffMember.position)}
//                           variant="outline"
//                         >
//                           {staffMember.position}
//                         </Badge>
//                         <p className="text-sm text-muted-foreground mt-1">
//                           {staffMember.department?.name || "N/A"}
//                         </p>
//                       </div>
//                     </TableCell>
//                     {/* <TableCell>
//                       <div className="flex items-center">
//                         <Building className="h-3 w-3 mr-1 text-muted-foreground" />
//                         <span className="text-sm">
//                           {staffMember.facility?.facility_name || "N/A"}
//                         </span>
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         {staffMember.facility?.city},{" "}
//                         {staffMember.facility?.state}
//                       </p>
//                     </TableCell> */}
//                     <TableCell>
//                       <div className="flex items-center">
//                         <Calendar className="mr-1 h-3 w-3" />
//                         <span className="text-sm">
//                           Hired: {formatDate(staffMember.hire_date)}
//                         </span>
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         {calculateExperience(staffMember.hire_date)}
//                       </p>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="outline">
//                         {staffMember.shift_schedule?.shift || "N/A"}
//                       </Badge>
//                       {staffMember.shift_schedule?.start_time &&
//                         staffMember.shift_schedule?.end_time && (
//                           <p className="text-xs text-muted-foreground mt-1">
//                             {staffMember.shift_schedule.start_time} -{" "}
//                             {staffMember.shift_schedule.end_time}
//                           </p>
//                         )}
//                     </TableCell>
//                     <TableCell>
//                       <Badge className={getStatusColor(staffMember.is_active)}>
//                         {staffMember.is_active ? "Active" : "Inactive"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex space-x-2">
//                         {/* <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleEdit(staffMember)}
//                           disabled={staffMember.user_id !== currentUserId}
//                           title={staffMember.user_id !== currentUserId ? "You can only edit your own staff record." : undefined}
//                         >
//                           <Edit className="h-3 w-3" />
//                         </Button> */}
//                          {(isMaintenance || staffMember.user_id === currentUserId) ? (
//       <Button
//         size="sm"
//         variant="outline"
//         onClick={() => handleEdit(staffMember)}
//         title={isMaintenance ? "Maintenance access - full edit rights" : "Edit your own record"}
//       >
//         <Edit className="h-3 w-3" />
//       </Button>
//     ) : (
//       <Button
//         size="sm"
//         variant="ghost"
//         disabled
//         title="You can only edit your own staff record"
//       >
//         <Edit className="h-3 w-3 opacity-50" />
//       </Button>
//     )}
//                         {/* <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleDelete(staffMember.id)}
//                           disabled={staffMember.user_id !== currentUserId}
//                           title={staffMember.user_id !== currentUserId ? "You can only edit your own staff record." : undefined}
//                         >
//                           <Trash2 className="h-3 w-3" />
//                         </Button> */}
//                          {(isMaintenance || staffMember.user_id === currentUserId) ? (
//       <Button
//         size="sm"
//         variant="outline"
//         onClick={() => {
//           if (window.confirm('Are you sure you want to delete this staff member?')) {
//             handleDelete(staffMember.id);
//           }
//         }}
//         className="text-red-600 hover:text-red-700"
//         title={isMaintenance ? "Maintenance access - full delete rights" : "Delete your own record"}
//       >
//         <Trash2 className="h-3 w-3" />
//       </Button>
//     ) : (
//       <Button
//         size="sm"
//         variant="ghost"
//         disabled
//         className="text-red-300"
//         title="You can only delete your own staff record"
//       >
//         <Trash2 className="h-3 w-3 opacity-50" />
//       </Button>
//     )}
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

// export default StaffManagement;

import { useState, useEffect } from "react";
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
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Phone,
  Mail,
  Calendar,
  Building,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import mixpanelInstance from "@/utils/mixpanel";
import { useUser } from "@/hooks/useUser";

// Types based on your Supabase schema
interface Profile {
  id: string;
  user_id: string;
  email: string;
  phone_number: string;
  role: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
 profile_id?: string;
  created_at: string;
  updated_at: string;
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
  facility_type: string;
  city: string;
  state: string;
  admin_user_id: string;
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

const StaffManagement = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const [staff, setStaff] = useState<CombinedStaffData[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<CombinedStaffData | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedFacility, setSelectedFacility] = useState<string>("all");
  const [userFacility, setUserFacility] = useState<Facility | null>(null);
 const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [formData, setFormData] = useState({
     // User account fields
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    user_id: "",
    employee_id: "",
    position: "",
    department_id: "",
    facility_id: "",
    hire_date: "",
    salary: 0,
    shift_schedule: {
      shift: "morning" as "morning" | "evening" | "night" | "rotating",
      start_time: "09:00",
      end_time: "17:00",
    },
    permissions: {},
    is_active: true,
    specialization: "",
  qualifications: [],
  employment_type: "full-time",
  joining_date: "",
  status: "active",
  role: "hospital_staff",
  });

  // Track if current user already has a staff record
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [userHasStaff, setUserHasStaff] = useState<boolean>(false);
  
  // Add tracking functions
  const trackStaffAction = (action: string, staffData?: any, additionalData = {}) => {
    mixpanelInstance.track('Staff Management Action', {
      action,
      staffId: staffData?.id,
      staffName: staffData?.profile ? 
        `${staffData.profile.first_name} ${staffData.profile.last_name}` : undefined,
      departmentId: staffData?.department_id,
      facilityId: staffData?.facility_id,
      ...additionalData
    });
  };

  useEffect(() => {
    // Get current user id
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && user.id) {
        setCurrentUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  // Get user's facility on component mount
  useEffect(() => {
    const getUserFacility = async () => {
      if (!user) return;

      try {
        // Find facility where admin_user_id = current user's ID
        const { data: facilityData, error: facilityError } = await supabase
          .from("facilities")
          .select("id, facility_name, facility_type, city, state, admin_user_id")
          .eq("admin_user_id", user.id)
          .maybeSingle();

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
          // Set selected facility to user's facility by default
          setSelectedFacility(facilityData.id);
        }
      } catch (error: any) {
        console.error("Error fetching user facility:", error);
        setUserFacility(null);
      }
    };

    getUserFacility();
  }, [user]);

  // Add maintenance access check
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [maintenanceDeptId, setMaintenanceDeptId] = useState<string | null>(null);
  
  // Check if current user is maintenance staff
//   useEffect(() => {
//     const checkMaintenanceAccess = async () => {
//       const { data: { user }, error } = await supabase.auth.getUser();
//       if (!user) return;
// const role = user?.user_metadata?.role;
// console.log("ROLE:", role);
//       try {
//         // Find Maintenance department
//         const { data: deptData } = await supabase
//           .from("departments")
//           .select("id")
//           .ilike("name", "%maintenance%")
//           .maybeSingle();

//         if (deptData) {
//           setMaintenanceDeptId(deptData.id);

//           // Check if user is in Maintenance department
//           const { data: staffData } = await supabase
//             .from("staff")
//             .select("id")
//             .eq("user_id", user.id)
//             .eq("department_id", deptData.id)
//             .eq("is_active", true)
//             .maybeSingle();

//           setIsMaintenance(!!staffData);
//         }
//       } catch (error) {
//         console.error("Error checking maintenance access:", error);
//       }
//     };

//     checkMaintenanceAccess();
//   }, []);

  // useEffect(() => {
  //   // Check if current user has a staff record
  //   if (currentUserId && staff.length > 0) {
  //     setUserHasStaff(staff.some(s => s.user_id === currentUserId));
  //   }
  // }, [currentUserId, staff]);

  // Fetch initial data
  useEffect(() => {
    if (userFacility?.id) {
      fetchData();
    }
  }, [userFacility]);

  const fetchData = async () => {
    if (!userFacility?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      /* ============================
         1. FETCH STAFF for user's facility only
      ============================ */
      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .select("*")
        .eq("facility_id", userFacility.id) // Filter by user's facility
        .order("created_at", { ascending: false });

      if (staffError) throw staffError;

      /* ============================
         2. FETCH PROFILES
      ============================ */
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      /* ============================
         3. FETCH DEPARTMENTS for user's facility only
      ============================ */
      const { data: departmentsData, error: deptError } = await supabase
        .from("departments")
        .select("id, name")
        .eq("facility_id", userFacility.id) // Filter by user's facility
        .eq("is_active", true);

      if (deptError) throw deptError;

      /* ============================
         4. FETCH FACILITIES (just the user's facility)
      ============================ */
      const { data: facilitiesData, error: facilityError } = await supabase
        .from("facilities")
        .select("id, facility_name, facility_type, city, state")
        .eq("id", userFacility.id); // Only get user's facility

      if (facilityError) throw facilityError;

      /* ============================
         5. CREATE LOOKUP MAPS
      ============================ */
      const profileMap = new Map(profilesData?.map((p) => [p.user_id, p]));
      const departmentMap = new Map(departmentsData?.map((d) => [d.id, d]));
      const facilityMap = new Map(facilitiesData?.map((f) => [f.id, f]));

      /* ============================
         6. MERGE DATA
      ============================ */
      const combinedStaff: CombinedStaffData[] =
        staffData?.map((staff) => ({
          ...staff,
          profile: profileMap.get(staff.user_id),
          department: departmentMap.get(staff.department_id),
          facility: facilityMap.get(staff.facility_id),
        })) || [];

      /* ============================
         7. SET STATE
      ============================ */
      setStaff(combinedStaff);
      setDepartments(departmentsData || []);
      setFacilities(facilitiesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load staff data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStaff = staff.filter((s) => {
    const departmentMatch = selectedDepartment === "all" || s.department_id === selectedDepartment;
    const facilityMatch = selectedFacility === "all" || s.facility_id === selectedFacility;
    return departmentMatch && facilityMatch;
  });

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!userFacility?.id) {
//     toast({
//       title: "Error",
//       description: "Facility not found",
//       variant: "destructive",
//     });
//     return;
//   }

//   // ===============================
//   // ✅ VALIDATION
//   // ===============================
//   if (!formData.first_name || !formData.last_name) {
//     return toast({
//       title: "Missing Fields",
//       description: "First & Last name required",
//       variant: "destructive",
//     });
//   }

//   if (!formData.email || !formData.phone_number) {
//     return toast({
//       title: "Missing Fields",
//       description: "Email & Phone required",
//       variant: "destructive",
//     });
//   }

//   if (!formData.department_id) {
//     return toast({
//       title: "Department Required",
//       description: "Select department",
//       variant: "destructive",
//     });
//   }

//   // Password validation (only for new user)
//   if (!editingStaff) {
//     if (formData.password !== formData.confirmPassword) {
//       return toast({
//         title: "Password mismatch",
//         description: "Passwords do not match",
//         variant: "destructive",
//       });
//     }

//     if (formData.password.length < 6) {
//       return toast({
//         title: "Weak password",
//         description: "Minimum 6 characters required",
//         variant: "destructive",
//       });
//     }
//   }

//   setIsCreatingUser(true);

//   try {
//     // ===============================
//     // ✅ CHECK DUPLICATE EMPLOYEE ID
//     // ===============================
//     let query = supabase
//       .from("staff")
//       .select("id")
//       .eq("facility_id", userFacility.id)
//       .eq("employee_id", formData.employee_id);

//     if (editingStaff) {
//       query = query.neq("id", editingStaff.id);
//     }

//     const { data: duplicate, error: dupError } = await query;

//     if (dupError) throw dupError;

//     if (duplicate && duplicate.length > 0) {
//       throw new Error("Employee ID already exists");
//     }

//     let userId = formData.user_id;

//     // ===============================
//     // ✅ CREATE AUTH USER (ONLY NEW)
//     // ===============================
//     if (!editingStaff) {
//       const { data: authData, error: authError } =
//         await supabase.auth.signUp({
//           email: formData.email,
//           password: formData.password,
//           options: {
//             data: {
//               first_name: formData.first_name,
//               last_name: formData.last_name,
//               role: "hospital_staff", // ✅ stored in metadata
//               phone_number: formData.phone_number,
//             },
//           },
//         });

//       if (authError) throw authError;

//       if (!authData.user?.id) {
//         throw new Error("User creation failed");
//       }

//       userId = authData.user.id;

//       // ===============================
//       // ✅ CHECK PROFILE EXISTS
//       // ===============================
//       const { data: existingProfile, error: profileCheckError } =
//         await supabase
//           .from("profiles")
//           .select("id")
//           .eq("user_id", userId)
//           .maybeSingle();

//       if (profileCheckError) throw profileCheckError;
//  const { data, error } = await supabase
//       .from('profiles')
//       .update({
//         phone_number: formData.phone_number,
//         role: 'hospital_admin',
//         email: formData.email
//       })
//       .eq('email', formData.email);
//       // ===============================
//       // ✅ CREATE PROFILE
//       // ===============================
//       if (!existingProfile) {
//         const { error: profileError } = await supabase
//           .from("profiles")
//           .insert([
//             {
//               user_id: userId,
//               email: formData.email,
//               phone_number: formData.phone_number,
//               first_name: formData.first_name,
//               last_name: formData.last_name,
//               role: "hospital_staff", // ✅ IMPORTANT
//               created_at: new Date().toISOString(),
//               updated_at: new Date().toISOString(),
//             },
//           ]);

//         if (profileError) throw profileError;
//       }

//       toast({
//         title: "User Created",
//         description: "Hospital staff account created successfully",
//       });
//     }

//     // ===============================
//     // ✅ STAFF TABLE DATA
//     // ===============================
//     const staffPayload = {
//       facility_id: userFacility.id,
//       department_id: formData.department_id,
//       employee_id: formData.employee_id,
//       position: formData.position,
//       hire_date: formData.hire_date,
//       user_id: userId,
//       updated_at: new Date().toISOString(),
//     };

//     // ===============================
//     // ✅ UPDATE / INSERT STAFF
//     // ===============================
//     if (editingStaff) {
//       const { error } = await supabase
//         .from("staff")
//         .update(staffPayload)
//         .eq("id", editingStaff.id);

//       if (error) throw error;

//       toast({
//         title: "Updated",
//         description: "Staff updated successfully",
//       });
//     } else {
//       const { error } = await supabase
//         .from("staff")
//         .insert([
//           {
//             ...staffPayload,
//             created_at: new Date().toISOString(),
//           },
//         ]);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "Hospital staff added successfully",
//       });
//     }

//     // ===============================
//     // ✅ RESET + REFRESH
//     // ===============================
//     resetForm();
//     fetchData();
//     setIsAddDialogOpen(false);

//   } catch (err: any) {
//     console.error("ERROR:", err);

//     toast({
//       title: "Error",
//       description: err.message || "Something went wrong",
//       variant: "destructive",
//     });
//   } finally {
//     setIsCreatingUser(false);
//   }
// };

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!userFacility?.id) {
//     toast({
//       title: "Error",
//       description: "Facility not found",
//       variant: "destructive",
//     });
//     return;
//   }

//   // ===============================
//   // ✅ GET CURRENT USER ROLE
//   // ===============================
//   const { data: { user: currentUser } } = await supabase.auth.getUser();
//   const currentUserRole = currentUser?.user_metadata?.role;
  
//   // Get role from profiles table for more reliable permissions
//   const { data: currentProfile } = await supabase
//     .from('profiles')
//     .select('role')
//     .eq('user_id', currentUser?.id)
//     .single();
  
//   const userRole = currentProfile?.role || currentUserRole;

//   // ===============================
//   // ✅ ROLE-BASED ACCESS CONTROL
//   // ===============================
  
//   // Only admin and maintenance can create new staff
//   if (!editingStaff && !['admin', 'maintenance', 'hospital_admin'].includes(userRole || '')) {
//     return toast({
//       title: "Access Denied",
//       description: "You don't have permission to add new staff members",
//       variant: "destructive",
//     });
//   }

//   // Only admin and maintenance can edit other staff members
//   if (editingStaff && editingStaff.user_id !== currentUser?.id) {
//     if (!['admin', 'maintenance', 'hospital_admin'].includes(userRole || '')) {
//       return toast({
//         title: "Access Denied",
//         description: "You can only edit your own profile",
//         variant: "destructive",
//       });
//     }
//   }

//   // Only admin and maintenance can set admin roles
//   const isSettingAdminRole = formData.role === 'admin' || formData.role === 'hospital_admin';
//   if (isSettingAdminRole && !['admin', 'maintenance'].includes(userRole || '')) {
//     return toast({
//       title: "Access Denied",
//       description: "You don't have permission to create admin accounts",
//       variant: "destructive",
//     });
//   }

//   // ===============================
//   // ✅ VALIDATION
//   // ===============================
//   if (!formData.first_name || !formData.last_name) {
//     return toast({
//       title: "Missing Fields",
//       description: "First & Last name required",
//       variant: "destructive",
//     });
//   }

//   if (!formData.email || !formData.phone_number) {
//     return toast({
//       title: "Missing Fields",
//       description: "Email & Phone required",
//       variant: "destructive",
//     });
//   }

//   if (!formData.department_id) {
//     return toast({
//       title: "Department Required",
//       description: "Select department",
//       variant: "destructive",
//     });
//   }

//   // Password validation (only for new user)
//   if (!editingStaff) {
//     if (formData.password !== formData.confirmPassword) {
//       return toast({
//         title: "Password mismatch",
//         description: "Passwords do not match",
//         variant: "destructive",
//       });
//     }

//     if (formData.password.length < 6) {
//       return toast({
//         title: "Weak password",
//         description: "Minimum 6 characters required",
//         variant: "destructive",
//       });
//     }
//   }

//   setIsCreatingUser(true);

//   try {
//     // ===============================
//     // ✅ CHECK DUPLICATE EMPLOYEE ID
//     // ===============================
//     let query = supabase
//       .from("staff")
//       .select("id")
//       .eq("facility_id", userFacility.id)
//       .eq("employee_id", formData.employee_id);

//     if (editingStaff) {
//       query = query.neq("id", editingStaff.id);
//     }

//     const { data: duplicate, error: dupError } = await query;

//     if (dupError) throw dupError;

//     if (duplicate && duplicate.length > 0) {
//       throw new Error("Employee ID already exists");
//     }

//     let userId = formData.user_id;

//     // ===============================
//     // ✅ CREATE AUTH USER (ONLY NEW)
//     // ===============================
//     if (!editingStaff) {
//       // Determine the role for the new user
//       const newUserRole = formData.role || "hospital_staff";
      
//       const { data: authData, error: authError } =
//         await supabase.auth.signUp({
//           email: formData.email,
//           password: formData.password,
//           options: {
//             data: {
//               first_name: formData.first_name,
//               last_name: formData.last_name,
//               role: newUserRole, // ✅ Use the determined role
//               phone_number: formData.phone_number,
//               created_by: currentUser?.id, // Track who created this user
//               created_by_role: userRole, // Track the creator's role
//             },
//           },
//         });

//       if (authError) throw authError;

//       if (!authData.user?.id) {
//         throw new Error("User creation failed");
//       }

//       userId = authData.user.id;

//       // ===============================
//       // ✅ CHECK PROFILE EXISTS
//       // ===============================
//       const { data: existingProfile, error: profileCheckError } =
//         await supabase
//           .from("profiles")
//           .select("id")
//           .eq("user_id", userId)
//           .maybeSingle();

//       if (profileCheckError) throw profileCheckError;
//  const { data, error } = await supabase
//       .from('profiles')
//       .update({
//         phone_number: formData.phone_number,
//         role: 'hospital_admin',
//         email: formData.email
//       })
//       .eq('email', formData.email);
//       // ===============================
//       // ✅ CREATE PROFILE
//       // ===============================
//       if (!existingProfile) {
//         const { error: profileError } = await supabase
//           .from("profiles")
//           .insert([
//             {
//               user_id: userId,
//               email: formData.email,
//               phone_number: formData.phone_number,
//               first_name: formData.first_name,
//               last_name: formData.last_name,
//               role: newUserRole, // ✅ IMPORTANT - use the determined role
//               created_at: new Date().toISOString(),
//               updated_at: new Date().toISOString(),
//             },
//           ]);

//         if (profileError) throw profileError;
//       }

//       toast({
//         title: "User Created",
//         description: `Hospital staff account created successfully with role: ${newUserRole}`,
//       });
//     }

//     // ===============================
//     // ✅ STAFF TABLE DATA
//     // ===============================
//     const staffPayload = {
//       facility_id: userFacility.id,
//       department_id: formData.department_id,
//       employee_id: formData.employee_id,
//       position: formData.position,
//       hire_date: formData.hire_date,
//       user_id: userId,
//       updated_at: new Date().toISOString(),
//     };

//     // ===============================
//     // ✅ UPDATE / INSERT STAFF
//     // ===============================
//     if (editingStaff) {
//       const { error } = await supabase
//         .from("staff")
//         .update(staffPayload)
//         .eq("id", editingStaff.id);

//       if (error) throw error;

//       toast({
//         title: "Updated",
//         description: "Staff updated successfully",
//       });
//     } else {
//       const { error } = await supabase
//         .from("staff")
//         .insert([
//           {
//             ...staffPayload,
//             created_at: new Date().toISOString(),
//           },
//         ]);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "Hospital staff added successfully",
//       });
//     }

//     // ===============================
//     // ✅ RESET + REFRESH
//     // ===============================
//     resetForm();
//     fetchData();
//     setIsAddDialogOpen(false);

//   } catch (err: any) {
//     console.error("ERROR:", err);

//     toast({
//       title: "Error",
//       description: err.message || "Something went wrong",
//       variant: "destructive",
//     });
//   } finally {
//     setIsCreatingUser(false);
//   }
// };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!userFacility?.id) {
    toast({
      title: "Error",
      description: "Facility not found",
      variant: "destructive",
    });
    return;
  }

  // ===============================
  // ✅ VALIDATION
  // ===============================
// ===============================
// ✅ VALIDATION
// ===============================

// Staff details validation (always required)
if (!formData.department_id) {
  return toast({
    title: "Department Required",
    description: "Select department",
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

  if (formData.password !== formData.confirmPassword) {
    return toast({
      title: "Password mismatch",
      description: "Passwords do not match",
      variant: "destructive",
    });
  }

  if (formData.password.length < 6) {
    return toast({
      title: "Weak password",
      description: "Minimum 6 characters required",
      variant: "destructive",
    });
  }
}

  setIsCreatingUser(true);

  try {
    // ===============================
    // ✅ CHECK DUPLICATE EMPLOYEE ID
    // ===============================
    let query = supabase
      .from("staff")
      .select("id")
      .eq("facility_id", userFacility.id)
      .eq("employee_id", formData.employee_id);

    if (editingStaff) {
      query = query.neq("id", editingStaff.id);
    }

    const { data: duplicate, error: dupError } = await query;

    if (dupError) throw dupError;

    if (duplicate && duplicate.length > 0) {
      throw new Error("Employee ID already exists");
    }

    let userId = formData.user_id;

    // ===============================
    // ✅ CREATE AUTH USER (ONLY NEW)
    // ===============================
    if (!editingStaff) {
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.first_name,
              last_name: formData.last_name,
              role: "hospital_staff",
              phone_number: formData.phone_number,
            },
          },
        });

      if (authError) throw authError;

      if (!authData.user?.id) {
        throw new Error("User creation failed");
      }

      userId = authData.user.id;

      // ===============================
      // ✅ GET IDENTITY DATA FROM AUTH RESPONSE
      // ===============================
      const identityData = authData.user.identities?.[0]?.identity_data || {};
      
      // ===============================
      // ✅ CHECK IF PROFILE EXISTS BY USER_ID
      // ===============================
      const { data: existingProfile, error: profileCheckError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

      if (profileCheckError) throw profileCheckError;

      // ===============================
      // ✅ CREATE OR UPDATE PROFILE BASED ON USER_ID
      // ===============================
      if (!existingProfile) {
        // Create new profile if it doesn't exist
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              user_id: userId,
              email: formData.email || identityData.email,
              phone_number: formData.phone_number || identityData.phone_number,
              first_name: formData.first_name || identityData.first_name,
              last_name: formData.last_name || identityData.last_name,
              role: "hospital_staff",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (profileError) throw profileError;
        
        toast({
          title: "Profile Created",
          description: "User profile created successfully from signup data",
        });
      } else {
        // Update existing profile if it exists
        const { error: profileUpdateError } = await supabase
          .from("profiles")
          .update({
            email: formData.email || identityData.email,
            phone_number: formData.phone_number || identityData.phone_number,
            first_name: formData.first_name || identityData.first_name,
            last_name: formData.last_name || identityData.last_name,
            role: "hospital_staff",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        if (profileUpdateError) throw profileUpdateError;
        
        toast({
          title: "Profile Updated",
          description: "Existing profile updated with signup data",
        });
      }

      toast({
        title: "User Created",
        description: "Hospital staff account created successfully",
      });
    }

    // ===============================
    // ✅ STAFF TABLE DATA
    // ===============================
    const staffPayload = {
      facility_id: userFacility.id,
      department_id: formData.department_id,
      employee_id: formData.employee_id,
      position: formData.position,
      hire_date: formData.hire_date,
      user_id: userId,
       shift_schedule: {
        shift: formData.shift_schedule.shift,
        start_time: formData.shift_schedule.start_time,
        end_time: formData.shift_schedule.end_time,
      },
      is_active: formData.is_active,
      updated_at: new Date().toISOString(),
    };

    // ===============================
    // ✅ UPDATE / INSERT STAFF
    // ===============================
    if (editingStaff) {
      const { error } = await supabase
        .from("staff")
        .update(staffPayload)
        .eq("id", editingStaff.id);

      if (error) throw error;

      // ===============================
      // ✅ UPDATE PROFILE FOR EXISTING USER
      // ===============================
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          email: formData.email,
          role: "hospital_staff",
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (profileError) throw profileError;

      toast({
        title: "Updated",
        description: "Staff updated successfully",
      });
    } else {
      const { error } = await supabase
        .from("staff")
        .insert([
          {
            ...staffPayload,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hospital staff added successfully",
      });
    }

    // ===============================
    // ✅ RESET + REFRESH
    // ===============================
    resetForm();
    fetchData();
    setIsAddDialogOpen(false);

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
  const handleEdit = (staffMember: CombinedStaffData) => {
    setEditingStaff(staffMember);
    setFormData({
      // // User account fields
      // email: staffMember.profile?.email || "",
      // password: "",
      // confirmPassword: "",
      // first_name: staffMember.profile?.first_name || "",
      // last_name: staffMember.profile?.last_name || "",
      // phone_number: staffMember.profile?.phone_number || "",
      
      user_id: staffMember.user_id,
      employee_id: staffMember.employee_id,
      position: staffMember.position,
      department_id: staffMember.department_id,
      facility_id: staffMember.facility_id,
      hire_date: staffMember.hire_date,
      salary: staffMember.salary,
      shift_schedule: {
        shift: staffMember.shift_schedule.shift,
        start_time: staffMember.shift_schedule.start_time,
        end_time: staffMember.shift_schedule.end_time,
      },
      permissions: staffMember.permissions,
      is_active: staffMember.is_active,
       email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    specialization: "",
    qualifications: [],
    employment_type: "full-time",
    joining_date: "",
    status: "active",
    role: "hospital_staff",
// specialization: staffMember.specialization || "",
//     qualifications: staffMember.qualifications || [],
//     employment_type: staffMember.employment_type || "full-time",
//     joining_date: staffMember.joining_date || "",
//     status: staffMember.status || "active",
//     role: staffMember.profile?.role || "hospital_staff",
    });
    setIsAddDialogOpen(true);
    trackStaffAction('edit_opened', staffMember, { employee_id: staffMember.employee_id });
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

    trackStaffAction('delete_attempt', { id }); 
    
    try {
      const staffMember = staff.find((s) => s.id === id);

      const { error } = await supabase
        .from("staff")
        .delete()
        .eq("id", id)
        .eq("facility_id", userFacility.id); // Ensure user can only delete their own facility staff

      if (error) throw error;

      setStaff((prev) => prev.filter((s) => s.id !== id));
      toast({
        title: "Staff Removed",
        description: `${staffMember?.profile?.first_name} ${staffMember?.profile?.last_name} has been removed.`,
      });
      trackStaffAction('delete_success', staffMember, { employee_id: staffMember?.employee_id });
    } catch (error: any) {
      console.error("Error deleting staff:", error);
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
      trackStaffAction('delete_failed', undefined, { error: error.message });
    }
  };

  const resetForm = () => {
    setFormData({
         email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      user_id: "",
      employee_id: "",
      position: "",
      department_id: "",
      facility_id: userFacility?.id || "", // Default to user's facility
      hire_date: "",
      salary: 0,
      shift_schedule: {
        shift: "morning" as "morning" | "evening" | "night" | "rotating",
        start_time: "09:00",
        end_time: "17:00",
      },
      permissions: {},
      is_active: true,
      specialization: "",
    qualifications: [],
    employment_type: "full-time",
    joining_date: "",
    status: "active",
    role: "hospital_staff",
    });
    setEditingStaff(null);
    setIsAddDialogOpen(false);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getPositionColor = (position: string) => {
    const positionLower = position.toLowerCase();
    if (positionLower.includes("doctor") || positionLower.includes("dr")) {
      return "bg-blue-100 text-blue-800";
    } else if (positionLower.includes("nurse")) {
      return "bg-pink-100 text-pink-800";
    } else if (
      positionLower.includes("therapist") ||
      positionLower.includes("physio")
    ) {
      return "bg-purple-100 text-purple-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Add to filter changes
  const handleFacilityFilter = (value: string) => {
    trackStaffAction('filter_by_facility', undefined, { 
      fromFilter: selectedFacility, 
      toFilter: value 
    });
    setSelectedFacility(value);
  };

  const handleDepartmentFilter = (value: string) => {
    trackStaffAction('filter_by_department', undefined, { 
      fromFilter: selectedDepartment, 
      toFilter: value 
    });
    setSelectedDepartment(value);
  };

  const calculateExperience = (hireDate: string) => {
    const hire = new Date(hireDate);
    const today = new Date();
    const years = today.getFullYear() - hire.getFullYear();
    const months = today.getMonth() - hire.getMonth();

    if (months < 0) {
      return `${years - 1} years, ${12 + months} months`;
    }
    return `${years} years, ${months} months`;
  };

  if (!userFacility && !isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Building className="h-12 w-12 mx-auto text-muted-foreground" />
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
          <p className="mt-2 text-muted-foreground">Loading staff data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Staff Management</h2>
          <p className="text-muted-foreground">
            Manage staff for {userFacility?.facility_name || "your facility"}
          </p>
        </div>
        {/* <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            {(isMaintenance || !userHasStaff || editingStaff) ? (
              <Button onClick={() => {
                trackStaffAction('add_staff_click');
                resetForm();
                setIsAddDialogOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            ) : (
              <Button 
                disabled 
                variant="outline"
                title="Only maintenance staff can add multiple staff members"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
              </DialogTitle>
              <DialogDescription>
                {editingStaff
                  ? "Update staff member information"
                  : `Add a new team member to ${userFacility?.facility_name || "your facility"}`}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="employee_id">Employee ID</Label>
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
                    <Label htmlFor="position">Position</Label>
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="department_id">Department</Label>
                    <Select
                      value={formData.department_id}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          department_id: value,
                        }))
                      }
                      required
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="hire_date">Hire Date</Label>
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
                    <Input
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
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStaff ? "Update Staff Member" : "Add Staff Member"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog> */}
         <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    {(isMaintenance || !userHasStaff || editingStaff) ? (
                      <Button onClick={() => {
                        trackStaffAction('add_staff_click');
                        resetForm();
                        setIsAddDialogOpen(true);
                      }}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Staff Member
                      </Button>
                    ) : (
                      <Button 
                        disabled 
                        variant="outline"
                        title="Only maintenance staff can add multiple staff members"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Staff Member
                      </Button>
                    )}
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingStaff
                          ? "Update staff member information"
                          : `Create a new user account and add them as staff to ${userFacility?.facility_name || "your facility"}`}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                         <div className="border-b pb-4">
                        <h3 className="text-lg font-semibold mb-4">Department / Services </h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="grid gap-2">
                              <Label htmlFor="department_id">Department *</Label>
                              <Select
                                value={formData.department_id}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    department_id: value,
                                  }))
                                }
                                required
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
                          </div>
                          </div>
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
        
                              <div className="grid grid-cols-2 gap-4 mt-4">
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
                              </div>
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
                              <Input
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
                              />
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
                      
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isCreatingUser}>
                          {isCreatingUser ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Creating...
                            </>
                          ) : (
                            editingStaff ? "Update Staff Member" : "Create Staff Member"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="facility-filter">Filter by Facility:</Label>
          <Select value={selectedFacility} onValueChange={handleFacilityFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Facilities</SelectItem>
              {facilities.map((facility) => (
                <SelectItem key={facility.id} value={facility.id}>
                  {facility.facility_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department-filter">Filter by Department:</Label>
          <Select
            value={selectedDepartment}
            onValueChange={handleDepartmentFilter}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Staff Directory - {userFacility?.facility_name}
          </CardTitle>
          <CardDescription>
            {filteredStaff.length} staff members in {userFacility?.facility_name}
            {selectedDepartment !== "all" && ` in selected department`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No Staff Members</h3>
              <p className="text-muted-foreground mt-2">
                {selectedDepartment !== "all"
                  ? "No staff found with the selected filters."
                  : `Get started by adding your first staff member to ${userFacility?.facility_name}.`}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Details</TableHead>
                  <TableHead>Position & Department</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {staffMember.profile?.first_name}{" "}
                          {staffMember.profile?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {staffMember.employee_id}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {staffMember.profile?.phone_number || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {staffMember.profile?.email || "N/A"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge
                          className={getPositionColor(staffMember.position)}
                          variant="outline"
                        >
                          {staffMember.position}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {staffMember.department?.name || "N/A"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        <span className="text-sm">
                          Hired: {formatDate(staffMember.hire_date)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {calculateExperience(staffMember.hire_date)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {staffMember.shift_schedule?.shift || "N/A"}
                      </Badge>
                      {staffMember.shift_schedule?.start_time &&
                        staffMember.shift_schedule?.end_time && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {staffMember.shift_schedule.start_time} -{" "}
                            {staffMember.shift_schedule.end_time}
                          </p>
                        )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(staffMember.is_active)}>
                        {staffMember.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* {(isMaintenance || staffMember.user_id === currentUserId) ? ( */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(staffMember)}
                            title={isMaintenance ? "Maintenance access - full edit rights" : "Edit your own record"}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        {/* ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled
                            title="You can only edit your own staff record"
                          >
                            <Edit className="h-3 w-3 opacity-50" />
                          </Button>
                        )} */}
                        {/* {(isMaintenance || staffMember.user_id === currentUserId) ? ( */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this staff member?')) {
                                handleDelete(staffMember.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-700"
                            title={isMaintenance ? "Maintenance access - full delete rights" : "Delete your own record"}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        {/* ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled
                            className="text-red-300"
                            title="You can only delete your own staff record"
                          >
                            <Trash2 className="h-3 w-3 opacity-50" />
                          </Button> */}
                        {/* )} */}
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

export default StaffManagement;