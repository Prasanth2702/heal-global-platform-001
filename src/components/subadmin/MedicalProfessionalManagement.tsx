import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Users, UserCheck, Phone, Mail, Calendar, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, subDays } from "date-fns";

interface MedicalProfessional {
  id: string;
  name: string;
  role: "Doctor" | "Nurse" | "Physiotherapist" | "Technician" | "Pharmacist";
  specialization?: string;
  qualification: string;
  licenseNumber: string;
  phone: string;
  email: string;
  department: string;
  experience: number;
  joiningDate: Date;
  status: "active" | "inactive" | "on-leave";
  shift: "morning" | "evening" | "night" | "rotating";
  consultationFee?: number;
  isAvailable: boolean;
}

interface MedicalProfessionalManagementProps {
  facilityId: string;
}

const MedicalProfessionalManagement: React.FC<MedicalProfessionalManagementProps> = ({ facilityId }) => {
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<MedicalProfessional[]>([
    {
      id: "1",
      name: "Dr. Rajesh Kumar",
      role: "Doctor",
      specialization: "Cardiology",
      qualification: "MBBS, MD",
      licenseNumber: "MH/DOC/2024/001",
      phone: "+91-9876543210",
      email: "rajesh.kumar@apollo.com",
      department: "Cardiology",
      experience: 12,
      joiningDate: new Date("2022-01-15"),
      status: "active",
      shift: "morning",
      consultationFee: 1500,
      isAvailable: true
    },
    {
      id: "2",
      name: "Sister Mary Joseph",
      role: "Nurse",
      qualification: "BSc Nursing",
      licenseNumber: "MH/NUR/2024/002",
      phone: "+91-9876543211",
      email: "mary.joseph@apollo.com",
      department: "ICU",
      experience: 8,
      joiningDate: new Date("2021-03-10"),
      status: "active",
      shift: "night",
      isAvailable: true
    },
    {
      id: "3",
      name: "Mr. Amit Physio",
      role: "Physiotherapist",
      specialization: "Sports Injury",
      qualification: "BPT, MPT",
      licenseNumber: "MH/PHY/2024/003",
      phone: "+91-9876543212",
      email: "amit.physio@apollo.com",
      department: "Physiotherapy",
      experience: 6,
      joiningDate: new Date("2023-06-01"),
      status: "active",
      shift: "morning",
      consultationFee: 800,
      isAvailable: false
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<MedicalProfessional | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    role: "Doctor" as MedicalProfessional["role"],
    specialization: "",
    qualification: "",
    licenseNumber: "",
    phone: "",
    email: "",
    department: "",
    experience: 0,
    joiningDate: "",
    shift: "morning" as MedicalProfessional["shift"],
    consultationFee: 0
  });

  const departments = ["Cardiology", "ICU", "Emergency", "Physiotherapy", "Radiology", "Pathology", "Pharmacy"];
  const roles = ["Doctor", "Nurse", "Physiotherapist", "Technician", "Pharmacist"];
  const shifts = ["morning", "evening", "night", "rotating"];

  const filteredProfessionals = professionals.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prof.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || prof.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || prof.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProfessional) {
      setProfessionals(prev => prev.map(prof => 
        prof.id === editingProfessional.id 
          ? { 
              ...prof, 
              ...formData, 
              joiningDate: new Date(formData.joiningDate),
              isAvailable: prof.isAvailable
            }
          : prof
      ));
      toast({
        title: "Professional Updated",
        description: `${formData.name}'s profile has been updated.`,
      });
      setEditingProfessional(null);
    } else {
      const newProfessional: MedicalProfessional = {
        id: Date.now().toString(),
        ...formData,
        joiningDate: new Date(formData.joiningDate),
        status: "active",
        isAvailable: true
      };
      setProfessionals(prev => [...prev, newProfessional]);
      toast({
        title: "Professional Added",
        description: `${formData.name} has been added to your facility.`,
      });
    }
    
    setFormData({
      name: "",
      role: "Doctor",
      specialization: "",
      qualification: "",
      licenseNumber: "",
      phone: "",
      email: "",
      department: "",
      experience: 0,
      joiningDate: "",
      shift: "morning",
      consultationFee: 0
    });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (professional: MedicalProfessional) => {
    setEditingProfessional(professional);
    setFormData({
      name: professional.name,
      role: professional.role,
      specialization: professional.specialization || "",
      qualification: professional.qualification,
      licenseNumber: professional.licenseNumber,
      phone: professional.phone,
      email: professional.email,
      department: professional.department,
      experience: professional.experience,
      joiningDate: format(professional.joiningDate, "yyyy-MM-dd"),
      shift: professional.shift,
      consultationFee: professional.consultationFee || 0
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const professional = professionals.find(p => p.id === id);
    setProfessionals(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Professional Removed",
      description: `${professional?.name} has been removed from your facility.`,
    });
  };

  const toggleAvailability = (id: string) => {
    setProfessionals(prev => prev.map(prof => 
      prof.id === id ? { ...prof, isAvailable: !prof.isAvailable } : prof
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Doctor":
        return "bg-blue-100 text-blue-800";
      case "Nurse":
        return "bg-pink-100 text-pink-800";
      case "Physiotherapist":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Medical Professional Management</h2>
          <p className="text-muted-foreground">
            Manage doctors, nurses, and other medical staff in your facility
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProfessional(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Professional
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProfessional ? "Edit Medical Professional" : "Add New Medical Professional"}
              </DialogTitle>
              <DialogDescription>
                {editingProfessional ? "Update professional information" : "Add a new medical professional to your facility"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as MedicalProfessional["role"] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
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
                  <div className="grid gap-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                      placeholder="e.g., Cardiology, General"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input
                      id="qualification"
                      value={formData.qualification}
                      onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                      placeholder="e.g., MBBS, MD"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                      placeholder="Medical license number"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91-XXXXXXXXXX"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@facility.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="joiningDate">Joining Date</Label>
                    <Input
                      id="joiningDate"
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, joiningDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="shift">Shift</Label>
                    <Select value={formData.shift} onValueChange={(value) => setFormData(prev => ({ ...prev, shift: value as MedicalProfessional["shift"] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {shifts.map(shift => (
                          <SelectItem key={shift} value={shift}>{shift}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(formData.role === "Doctor" || formData.role === "Physiotherapist") && (
                  <div className="grid gap-2">
                    <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                    <Input
                      id="consultationFee"
                      type="number"
                      value={formData.consultationFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, consultationFee: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingProfessional ? "Update Professional" : "Add Professional"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search professionals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="on-leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{professionals.length}</div>
            <p className="text-xs text-muted-foreground">Medical professionals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{professionals.filter(p => p.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Now</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {professionals.filter(p => p.isAvailable && p.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Ready for patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{professionals.filter(p => p.role === "Doctor").length}</div>
            <p className="text-xs text-muted-foreground">Qualified doctors</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Medical Staff Directory
          </CardTitle>
          <CardDescription>
            {filteredProfessionals.length} professionals found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name & Contact</TableHead>
                <TableHead>Role & Department</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfessionals.map((professional) => (
                <TableRow key={professional.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{professional.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{professional.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{professional.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge className={getRoleColor(professional.role)} variant="outline">
                        {professional.role}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{professional.department}</p>
                      {professional.specialization && (
                        <p className="text-xs text-muted-foreground">{professional.specialization}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{professional.qualification}</p>
                      <p className="text-xs text-muted-foreground">{professional.licenseNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {professional.experience} years
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={professional.isAvailable ? "default" : "outline"}>
                        {professional.isAvailable ? "Available" : "Busy"}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{professional.shift} shift</p>
                      {professional.consultationFee && (
                        <p className="text-xs text-muted-foreground">₹{professional.consultationFee}/session</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(professional.status)}>
                      {professional.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleAvailability(professional.id)}
                      >
                        {professional.isAvailable ? "Set Busy" : "Set Available"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(professional)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(professional.id)}
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

export default MedicalProfessionalManagement;