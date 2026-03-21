// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Clock, User, Calendar, CheckCircle, XCircle, AlertCircle, Search } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { format } from "date-fns";

// interface AppointmentFlow {
//   id: string;
//   patientName: string;
//   patientId: string;
//   department: string;
//   doctor: string;
//   appointmentTime: Date;
//   status: "scheduled" | "checked_in" | "in_consultation" | "completed" | "no_show" | "cancelled";
//   checkInTime?: Date;
//   consultationStartTime?: Date;
//   consultationEndTime?: Date;
//   waitingTime?: number; // in minutes
//   consultationDuration?: number; // in minutes
//   priority: "normal" | "urgent" | "emergency";
//   notes?: string;
// }

// const AppointmentFlow = () => {
//   const { toast } = useToast();
//   const [appointments, setAppointments] = useState<AppointmentFlow[]>([
//     {
//       id: "1",
//       patientName: "John Smith",
//       patientId: "P001",
//       department: "General OPD",
//       doctor: "Dr. Rajesh Kumar",
//       appointmentTime: new Date(2024, 6, 8, 9, 0),
//       status: "checked_in",
//       checkInTime: new Date(2024, 6, 8, 8, 45),
//       priority: "normal",
//       waitingTime: 15
//     },
//     {
//       id: "2",
//       patientName: "Sarah Wilson",
//       patientId: "P002",
//       department: "Cardiology",
//       doctor: "Dr. Priya Sharma",
//       appointmentTime: new Date(2024, 6, 8, 9, 30),
//       status: "in_consultation",
//       checkInTime: new Date(2024, 6, 8, 9, 15),
//       consultationStartTime: new Date(2024, 6, 8, 9, 25),
//       priority: "urgent",
//       waitingTime: 10
//     },
//     {
//       id: "3",
//       patientName: "Mike Johnson",
//       patientId: "P003",
//       department: "Emergency",
//       doctor: "Dr. Amit Singh",
//       appointmentTime: new Date(2024, 6, 8, 10, 0),
//       status: "scheduled",
//       priority: "emergency"
//     },
//     {
//       id: "4",
//       patientName: "Emily Davis",
//       patientId: "P004",
//       department: "General OPD",
//       doctor: "Dr. Rajesh Kumar",
//       appointmentTime: new Date(2024, 6, 8, 8, 30),
//       status: "completed",
//       checkInTime: new Date(2024, 6, 8, 8, 20),
//       consultationStartTime: new Date(2024, 6, 8, 8, 35),
//       consultationEndTime: new Date(2024, 6, 8, 9, 0),
//       priority: "normal",
//       waitingTime: 15,
//       consultationDuration: 25
//     }
//   ]);

//   const [statusFilter, setStatusFilter] = useState("all");
//   const [departmentFilter, setDepartmentFilter] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredAppointments = appointments.filter(apt => {
//     const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
//     const matchesDepartment = departmentFilter === "all" || apt.department === departmentFilter;
//     const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          apt.patientId.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesStatus && matchesDepartment && matchesSearch;
//   });

//   const handleStatusUpdate = (appointmentId: string, newStatus: AppointmentFlow["status"]) => {
//     setAppointments(prev => prev.map(apt => {
//       if (apt.id === appointmentId) {
//         const updatedApt = { ...apt, status: newStatus };
        
//         // Update timestamps based on status
//         const now = new Date();
//         switch (newStatus) {
//           case "checked_in":
//             updatedApt.checkInTime = now;
//             break;
//           case "in_consultation":
//             updatedApt.consultationStartTime = now;
//             if (apt.checkInTime) {
//               updatedApt.waitingTime = Math.round((now.getTime() - apt.checkInTime.getTime()) / (1000 * 60));
//             }
//             break;
//           case "completed":
//             updatedApt.consultationEndTime = now;
//             if (apt.consultationStartTime) {
//               updatedApt.consultationDuration = Math.round((now.getTime() - apt.consultationStartTime.getTime()) / (1000 * 60));
//             }
//             break;
//         }
        
//         return updatedApt;
//       }
//       return apt;
//     }));

//     toast({
//       title: "Status Updated",
//       description: `Appointment status changed to ${newStatus.replace("_", " ")}.`,
//     });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "scheduled":
//         return "bg-blue-100 text-blue-800";
//       case "checked_in":
//         return "bg-yellow-100 text-yellow-800";
//       case "in_consultation":
//         return "bg-green-100 text-green-800";
//       case "completed":
//         return "bg-gray-100 text-gray-800";
//       case "no_show":
//         return "bg-red-100 text-red-800";
//       case "cancelled":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "emergency":
//         return "bg-red-100 text-red-800";
//       case "urgent":
//         return "bg-orange-100 text-orange-800";
//       case "normal":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "scheduled":
//         return <Clock className="h-4 w-4" />;
//       case "checked_in":
//         return <User className="h-4 w-4" />;
//       case "in_consultation":
//         return <AlertCircle className="h-4 w-4" />;
//       case "completed":
//         return <CheckCircle className="h-4 w-4" />;
//       case "no_show":
//       case "cancelled":
//         return <XCircle className="h-4 w-4" />;
//       default:
//         return <Clock className="h-4 w-4" />;
//     }
//   };

//   const departments = ["General OPD", "Cardiology", "Emergency", "Radiology", "Pathology Lab"];
//   const statuses = ["scheduled", "checked_in", "in_consultation", "completed", "no_show", "cancelled"];

//   // Calculate statistics
//   const totalAppointments = appointments.length;
//   const checkedInCount = appointments.filter(apt => apt.status === "checked_in").length;
//   const inConsultationCount = appointments.filter(apt => apt.status === "in_consultation").length;
//   const completedCount = appointments.filter(apt => apt.status === "completed").length;
//   const averageWaitTime = appointments.filter(apt => apt.waitingTime).reduce((sum, apt) => sum + (apt.waitingTime || 0), 0) / 
//                          appointments.filter(apt => apt.waitingTime).length || 0;

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalAppointments}</div>
//             <p className="text-xs text-muted-foreground">Today's schedule</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Checked In</CardTitle>
//             <User className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{checkedInCount}</div>
//             <p className="text-xs text-muted-foreground">Waiting for consultation</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">In Consultation</CardTitle>
//             <AlertCircle className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{inConsultationCount}</div>
//             <p className="text-xs text-muted-foreground">Currently with doctor</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
//             <Clock className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{Math.round(averageWaitTime)}min</div>
//             <p className="text-xs text-muted-foreground">Average waiting time</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Filters */}
//       <div className="flex items-center space-x-4">
//         <div className="flex items-center space-x-2">
//           <Search className="h-4 w-4 text-muted-foreground" />
//           <Input
//             placeholder="Search patients..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-64"
//           />
//         </div>
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-[150px]">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Status</SelectItem>
//             {statuses.map(status => (
//               <SelectItem key={status} value={status}>
//                 {status.replace("_", " ")}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">All Departments</SelectItem>
//             {departments.map(dept => (
//               <SelectItem key={dept} value={dept}>{dept}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Calendar className="mr-2 h-5 w-5" />
//             Patient Flow & Check-ins
//           </CardTitle>
//           <CardDescription>
//             Real-time appointment tracking and patient flow management
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Patient Info</TableHead>
//                 <TableHead>Department & Doctor</TableHead>
//                 <TableHead>Appointment Time</TableHead>
//                 <TableHead>Priority</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Timing</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredAppointments.map((appointment) => (
//                 <TableRow key={appointment.id}>
//                   <TableCell>
//                     <div>
//                       <p className="font-medium">{appointment.patientName}</p>
//                       <p className="text-sm text-muted-foreground">ID: {appointment.patientId}</p>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div>
//                       <p className="font-medium">{appointment.department}</p>
//                       <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center">
//                       <Clock className="mr-1 h-3 w-3" />
//                       {format(appointment.appointmentTime, "HH:mm")}
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Badge className={getPriorityColor(appointment.priority)} variant="outline">
//                       {appointment.priority}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center space-x-2">
//                       {getStatusIcon(appointment.status)}
//                       <Badge className={getStatusColor(appointment.status)}>
//                         {appointment.status.replace("_", " ")}
//                       </Badge>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="text-xs">
//                       {appointment.checkInTime && (
//                         <p>Check-in: {format(appointment.checkInTime, "HH:mm")}</p>
//                       )}
//                       {appointment.waitingTime && (
//                         <p>Wait: {appointment.waitingTime}min</p>
//                       )}
//                       {appointment.consultationDuration && (
//                         <p>Duration: {appointment.consultationDuration}min</p>
//                       )}
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex space-x-1">
//                       {appointment.status === "scheduled" && (
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleStatusUpdate(appointment.id, "checked_in")}
//                         >
//                           Check In
//                         </Button>
//                       )}
//                       {appointment.status === "checked_in" && (
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleStatusUpdate(appointment.id, "in_consultation")}
//                         >
//                           Start
//                         </Button>
//                       )}
//                       {appointment.status === "in_consultation" && (
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleStatusUpdate(appointment.id, "completed")}
//                         >
//                           Complete
//                         </Button>
//                       )}
//                       {(appointment.status === "scheduled" || appointment.status === "checked_in") && (
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
//                         >
//                           Cancel
//                         </Button>
//                       )}
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

// export default AppointmentFlow;

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Clock, User, Calendar, CheckCircle, XCircle, AlertCircle, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface AppointmentFlow {
  id: string;
  patientName: string;
  patientId: string;
  department: string;
  departmentId?: string;
  doctor: string;
  doctorId?: string;
  appointmentTime: Date;
  status: "scheduled" | "checked_in" | "in_consultation" | "completed" | "no_show" | "cancelled";
  checkInTime?: Date;
  consultationStartTime?: Date;
  consultationEndTime?: Date;
  waitingTime?: number;
  consultationDuration?: number;
  priority: "normal" | "urgent" | "emergency";
  notes?: string;
}

const AppointmentFlow = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<AppointmentFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [facilityId, setFacilityId] = useState<string | null>(null);

  // Fetch facility ID on mount
  // useEffect(() => {
  //   const getFacilityId = async () => {
  //     const { data: { user } } = await supabase.auth.getUser();
  //     if (!user) return;

  //     const { data } = await supabase
  //       .from("facilities")
  //       .select("id")
  //       .eq("admin_user_id", user.id)
  //       .single();

  //     if (data) {
  //       setFacilityId(data.id);
  //     }
  //   };
  //   getFacilityId();
  // }, []);
useEffect(() => {
  const getFacilityId = async () => {

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    /* -----------------------------
    STEP 1 : CHECK PROFILE ROLE
    ------------------------------*/

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!profile) return;

    /* -----------------------------
    STEP 2 : ADMIN
    ------------------------------*/

    if (profile.role === "hospital_admin") {

      const { data: facility } = await supabase
        .from("facilities")
        .select("id")
        .eq("admin_user_id", user.id)
        .maybeSingle();

      if (facility) {
        setFacilityId(facility.id);
      }

      return;
    }

    /* -----------------------------
    STEP 3 : STAFF
    ------------------------------*/

    if (profile.role === "hospital_staff") {

      const { data: staff } = await supabase
        .from("staff")
        .select("facility_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (staff) {
        setFacilityId(staff.facility_id);
      }

    }

  };

  getFacilityId();

}, []);
  // Fetch appointments
  useEffect(() => {
    if (!facilityId) return;

 const fetchAppointments = async () => {
  setLoading(true);
  try {
    // Step 1: Fetch appointments first
    const appointments = await fetchAppointmentsData();
    if (!appointments || appointments.length === 0) {
      setAppointments([]);
      setDepartments([]);
      return;
    }

    // Step 2: Extract all related IDs
    const { patientIds, departmentIds, doctorIds } = extractRelatedIds(appointments);

    // Step 3: Fetch related data in parallel
    const [patients, departments, doctors] = await Promise.all([
      fetchPatientsByIds(patientIds),
      fetchDepartmentsByIds(departmentIds),
      fetchDoctorsByIds(doctorIds)
    ]);

    // Step 4: Transform data by merging appointments with related data
    const transformedData = transformAppointmentData(
      appointments, 
      patients, 
      departments, 
      doctors
    );

    // Step 5: Update state
    updateAppointmentState(transformedData);

  } catch (error) {
    handleFetchError(error);
  } finally {
    setLoading(false);
  }
};

// Step 1: Fetch appointments
const fetchAppointmentsData = async () => {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("facility_id", facilityId)
    .order("appointment_date", { ascending: true });

  if (error) throw error;
  return data || [];
};

// Step 2: Extract all related IDs
const extractRelatedIds = (appointments: any[]) => {
  const patientIds = new Set<string>();
  const departmentIds = new Set<string>();
  const doctorIds = new Set<string>();

  appointments.forEach(app => {
    if (app.patient_id) patientIds.add(app.patient_id);
    if (app.department_id) departmentIds.add(app.department_id);
    if (app.doctor_id) doctorIds.add(app.doctor_id);
  });

  return {
    patientIds: Array.from(patientIds),
    departmentIds: Array.from(departmentIds),
    doctorIds: Array.from(doctorIds)
  };
};

// Step 3a: Fetch patients by IDs
const fetchPatientsByIds = async (patientIds: string[]) => {
  if (patientIds.length === 0) return [];
  
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .in("id", patientIds);

  if (error) {
    console.error("Error fetching patients:", error);
    return [];
  }
  return data || [];
};

// Step 3b: Fetch departments by IDs
const fetchDepartmentsByIds = async (departmentIds: string[]) => {
  if (departmentIds.length === 0) return [];
  
  const { data, error } = await supabase
    .from("departments")
    .select("id, name")
    .in("id", departmentIds);

  if (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
  return data || [];
};

// Step 3c: Fetch doctors by IDs
const fetchDoctorsByIds = async (doctorIds: string[]) => {
  if (doctorIds.length === 0) return [];
  
  try {
    // Step 1: Fetch medical professionals data
    const medicalProfessionals = await fetchMedicalProfessionals(doctorIds);
    
    if (!medicalProfessionals || medicalProfessionals.length === 0) {
      return [];
    }

    // Step 2: Extract user IDs for profile fetching
    const userIds = extractUserIds(medicalProfessionals);
    
    // Step 3: Fetch profiles data
    const profiles = await fetchProfiles(userIds);
    
    // Step 4: Merge data and format
    const formattedDoctors = mergeDoctorWithProfiles(medicalProfessionals, profiles);
    
    return formattedDoctors;
    
  } catch (error) {
    return handleDoctorFetchError(error);
  }
};

// Step 1: Fetch medical professionals
const fetchMedicalProfessionals = async (doctorIds: string[]) => {
  const { data, error } = await supabase
    .from("medical_professionals")
    .select(`* `)
    .in("user_id", doctorIds);

  if (error) {
    console.error("Error fetching medical professionals:", error);
    throw error;
  }
  return data || [];
};

// Step 2: Extract user IDs from medical professionals
const extractUserIds = (medicalProfessionals: any[]) => {
  return medicalProfessionals
    .map(mp => mp.user_id)
    .filter(id => id); // Remove null/undefined
};

// Step 3: Fetch profiles data
const fetchProfiles = async (userIds: string[]) => {
  if (userIds.length === 0) return [];
  
  const { data, error } = await supabase
    .from("profiles")
    .select(`*`)
    .in("user_id", userIds);

  if (error) {
    console.error("Error fetching profiles:", error);
    throw error;
  }
  return data || [];
};

// Step 4: Merge medical professionals with profiles
const mergeDoctorWithProfiles = (medicalProfessionals: any[], profiles: any[]) => {
  // Create profile lookup map for O(1) access
  const profileMap = createProfileMap(profiles);
  
  // Merge each medical professional with their profile
  return medicalProfessionals.map(mp => {
    const profile = profileMap.get(mp.user_id);
    
    return {
      id: mp.id,
      user_id: mp.user_id,
      first_name: mp.first_name,
      last_name: mp.last_name,
      medical_speciality: mp.medical_speciality,
      years_experience: mp.years_experience,
      rating: mp.rating,
      profiles: profile ? {
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        phone_number: profile.phone_number
      } : null,
      // Additional computed fields
      displayName: formatDoctorName(mp, profile),
      fullName: profile ? 
        `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 
        `${mp.first_name || ''} ${mp.last_name || ''}`.trim()
    };
  });
};

// Helper: Create profile lookup map
const createProfileMap = (profiles: any[]) => {
  const map = new Map();
  profiles.forEach(profile => {
    map.set(profile.user_id, profile);
  });
  return map;
};

// Helper: Format doctor name with Dr. prefix
const formatDoctorName = (medicalProf: any, profile: any) => {
  if (profile?.first_name || profile?.last_name) {
    return `Dr. ${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  }
  if (medicalProf?.first_name || medicalProf?.last_name) {
    return `Dr. ${medicalProf.first_name || ''} ${medicalProf.last_name || ''}`.trim();
  }
  return "Unknown Doctor";
};

// Error handler
const handleDoctorFetchError = (error: any) => {
  console.error("Error in fetchDoctorsByIds:", error);
  // You could add toast notification here if needed
  return [];
};

// Step 4: Transform data by creating lookup maps and merging
const transformAppointmentData = (
  appointments: any[],
  patients: any[],
  departments: any[],
  doctors: any[]
) => {
  // Create lookup maps for O(1) access
  const patientMap = createPatientMap(patients);
  const departmentMap = createDepartmentMap(departments);
  const doctorMap = createDoctorMap(doctors);

  // Transform each appointment
  return appointments.map(app => {
    const patient = patientMap.get(app.patient_id);
    const department = departmentMap.get(app.department_id);
    const doctor = doctorMap.get(app.doctor_id);

    return {
      id: app.id,
      patientName: patient ? 
        `${patient.first_name || ''} ${patient.last_name || ''}`.trim() : 
        "Unknown Patient",
      patientId: app.patient_id,
      department: department?.name || "General",
      departmentId: app.department_id,
      doctor: doctor?.displayName || app.doctor_name || "Unknown Doctor",
      doctorId: app.doctor_id,
      appointmentTime: new Date(app.appointment_date),
      status: app.status || "scheduled",
      checkInTime: app.check_in_time ? new Date(app.check_in_time) : undefined,
      consultationStartTime: app.consultation_start_time ? new Date(app.consultation_start_time) : undefined,
      consultationEndTime: app.consultation_end_time ? new Date(app.consultation_end_time) : undefined,
      waitingTime: app.waiting_time,
      consultationDuration: app.duration_minutes,
      priority: app.priority || "normal",
      notes: app.notes
    };
  });
};

// Helper: Create patient lookup map
const createPatientMap = (patients: any[]) => {
  const map = new Map();
  patients.forEach(patient => {
    map.set(patient.id, patient);
  });
  return map;
};

// Helper: Create department lookup map
const createDepartmentMap = (departments: any[]) => {
  const map = new Map();
  departments.forEach(dept => {
    map.set(dept.id, dept);
  });
  return map;
};

// Helper: Create doctor lookup map with display name
const createDoctorMap = (doctors: any[]) => {
  const map = new Map();
  doctors.forEach(doctor => {
    const profileData = doctor.profiles;
    map.set(doctor.user_id || doctor.id, {
      ...doctor,
      displayName: profileData ? 
        `Dr. ${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() : 
        "Unknown Doctor"
    });
  });
  return map;
};

// Step 5: Update state with transformed data
const updateAppointmentState = (transformedData: AppointmentFlow[]) => {
  setAppointments(transformedData);
  
  // Extract unique departments for filter
  const uniqueDepts = [...new Set(transformedData.map(a => a.department))];
  setDepartments(uniqueDepts);
};

// Error handler
const handleFetchError = (error: any) => {
  console.error("Error fetching appointments:", error);
  toast({
    title: "Error",
    description: "Failed to load appointments",
    variant: "destructive"
  });
};

    fetchAppointments();
  }, [facilityId, toast]);

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || apt.department === departmentFilter;
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesDepartment && matchesSearch;
  });

  const handleStatusUpdate = async (appointmentId: string, newStatus: AppointmentFlow["status"]) => {
    try {
      const now = new Date();
      const updateData: any = { status: newStatus };

      // Update timestamps based on status
      switch (newStatus) {
        case "checked_in":
          updateData.check_in_time = now.toISOString();
          break;
        case "in_consultation":
          updateData.consultation_start_time = now.toISOString();
          // Calculate waiting time
          const currentApp = appointments.find(a => a.id === appointmentId);
          if (currentApp?.checkInTime) {
            const waitTime = Math.round((now.getTime() - currentApp.checkInTime.getTime()) / (1000 * 60));
            updateData.waiting_time = waitTime;
          }
          break;
        case "completed":
          updateData.completed_at = now.toISOString();
          updateData.consultation_end_time = now.toISOString();
          // Calculate duration
          const app = appointments.find(a => a.id === appointmentId);
          if (app?.consultationStartTime) {
            const duration = Math.round((now.getTime() - app.consultationStartTime.getTime()) / (1000 * 60));
            updateData.duration_minutes = duration;
          }
          break;
      }

      const { error } = await supabase
        .from("appointments")
        .update(updateData)
        .eq("id", appointmentId);

      if (error) throw error;

      // Update local state
      setAppointments(prev => prev.map(apt => {
        if (apt.id === appointmentId) {
          const updatedApt = { ...apt, status: newStatus };
          
          if (newStatus === "checked_in") {
            updatedApt.checkInTime = now;
          } else if (newStatus === "in_consultation") {
            updatedApt.consultationStartTime = now;
            if (apt.checkInTime) {
              updatedApt.waitingTime = Math.round((now.getTime() - apt.checkInTime.getTime()) / (1000 * 60));
            }
          } else if (newStatus === "completed") {
            updatedApt.consultationEndTime = now;
            if (apt.consultationStartTime) {
              updatedApt.consultationDuration = Math.round((now.getTime() - apt.consultationStartTime.getTime()) / (1000 * 60));
            }
          }
          
          return updatedApt;
        }
        return apt;
      }));

      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${newStatus.replace("_", " ")}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "checked_in":
        return "bg-yellow-100 text-yellow-800";
      case "in_consultation":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "no_show":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-800";
      case "urgent":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4" />;
      case "checked_in":
        return <User className="h-4 w-4" />;
      case "in_consultation":
        return <AlertCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "no_show":
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const statuses = ["scheduled", "checked_in", "in_consultation", "completed", "no_show", "cancelled"];

  // Calculate statistics
  const totalAppointments = appointments.length;
  const checkedInCount = appointments.filter(apt => apt.status === "checked_in").length;
  const inConsultationCount = appointments.filter(apt => apt.status === "in_consultation").length;
  const completedCount = appointments.filter(apt => apt.status === "completed").length;
  const averageWaitTime = appointments.filter(apt => apt.waitingTime).reduce((sum, apt) => sum + (apt.waitingTime || 0), 0) / 
                         appointments.filter(apt => apt.waitingTime).length || 0;

  if (loading) {
    return <div className="flex justify-center p-8">Loading appointments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">Today's schedule</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkedInCount}</div>
            <p className="text-xs text-muted-foreground">Waiting for consultation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Consultation</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inConsultationCount}</div>
            <p className="text-xs text-muted-foreground">Currently with doctor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageWaitTime) || 0}min</div>
            <p className="text-xs text-muted-foreground">Average waiting time</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>
                {status.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Departments" />
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
            <Calendar className="mr-2 h-5 w-5" />
            Patient Flow & Check-ins
          </CardTitle>
          <CardDescription>
            Real-time appointment tracking and patient flow management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Info</TableHead>
                <TableHead>Department & Doctor</TableHead>
                <TableHead>Appointment Time</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timing</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No appointments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.patientName}</p>
                        <p className="text-sm text-muted-foreground">ID: {appointment.patientId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{appointment.department}</p>
                        <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {format(appointment.appointmentTime, "HH:mm")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(appointment.priority)} variant="outline">
                        {appointment.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(appointment.status)}
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        {appointment.checkInTime && (
                          <p>Check-in: {format(appointment.checkInTime, "HH:mm")}</p>
                        )}
                        {appointment.waitingTime && (
                          <p>Wait: {appointment.waitingTime}min</p>
                        )}
                        {appointment.consultationDuration && (
                          <p>Duration: {appointment.consultationDuration}min</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {appointment.status === "scheduled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(appointment.id, "checked_in")}
                          >
                            Check In
                          </Button>
                        )}
                        {appointment.status === "checked_in" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(appointment.id, "in_consultation")}
                          >
                            Start
                          </Button>
                        )}
                        {appointment.status === "in_consultation" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(appointment.id, "completed")}
                          >
                            Complete
                          </Button>
                        )}
                        {(appointment.status === "scheduled" || appointment.status === "checked_in") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentFlow;