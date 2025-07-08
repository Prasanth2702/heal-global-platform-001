import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Users, Phone, Mail, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Staff {
  id: string;
  name: string;
  role: "Doctor" | "Nurse" | "Physiotherapist" | "Allied Staff" | "Technician" | "Administrator";
  department: string;
  specialization?: string;
  phone: string;
  email: string;
  qualification: string;
  experience: number;
  joiningDate: string;
  status: "active" | "inactive" | "on-leave";
  shift: "morning" | "evening" | "night" | "rotating";
}

const StaffManagement = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: "1",
      name: "Dr. Rajesh Kumar",
      role: "Doctor",
      department: "General OPD",
      specialization: "General Medicine",
      phone: "+91-9876543210",
      email: "rajesh.kumar@hospital.com",
      qualification: "MBBS, MD",
      experience: 12,
      joiningDate: "2020-01-15",
      status: "active",
      shift: "morning"
    },
    {
      id: "2",
      name: "Sister Mary Joseph",
      role: "Nurse",
      department: "General OPD",
      phone: "+91-9876543211",
      email: "mary.joseph@hospital.com",
      qualification: "BSc Nursing",
      experience: 8,
      joiningDate: "2021-03-10",
      status: "active",
      shift: "rotating"
    },
    {
      id: "3",
      name: "Mr. Amit Physio",
      role: "Physiotherapist",
      department: "Rehabilitation",
      specialization: "Sports Injury",
      phone: "+91-9876543212",
      email: "amit.physio@hospital.com",
      qualification: "BPT, MPT",
      experience: 6,
      joiningDate: "2022-06-01",
      status: "active",
      shift: "morning"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [formData, setFormData] = useState({
    name: "",
    role: "Doctor" as Staff["role"],
    department: "",
    specialization: "",
    phone: "",
    email: "",
    qualification: "",
    experience: 0,
    joiningDate: "",
    shift: "morning" as Staff["shift"]
  });

  const departments = ["General OPD", "Radiology", "Pathology Lab", "In-house Pharmacy", "Emergency", "Surgery", "ICU"];
  const roles = ["Doctor", "Nurse", "Physiotherapist", "Allied Staff", "Technician", "Administrator"];
  const shifts = ["morning", "evening", "night", "rotating"];

  const filteredStaff = selectedDepartment === "all" 
    ? staff 
    : staff.filter(s => s.department === selectedDepartment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingStaff) {
      setStaff(prev => prev.map(s => 
        s.id === editingStaff.id 
          ? { ...s, ...formData, status: s.status }
          : s
      ));
      toast({
        title: "Staff Updated",
        description: `${formData.name}'s profile has been updated.`,
      });
      setEditingStaff(null);
    } else {
      const newStaff: Staff = {
        id: Date.now().toString(),
        ...formData,
        status: "active"
      };
      setStaff(prev => [...prev, newStaff]);
      toast({
        title: "Staff Added",
        description: `${formData.name} has been added to the team.`,
      });
    }
    
    setFormData({
      name: "",
      role: "Doctor",
      department: "",
      specialization: "",
      phone: "",
      email: "",
      qualification: "",
      experience: 0,
      joiningDate: "",
      shift: "morning"
    });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      role: staffMember.role,
      department: staffMember.department,
      specialization: staffMember.specialization || "",
      phone: staffMember.phone,
      email: staffMember.email,
      qualification: staffMember.qualification,
      experience: staffMember.experience,
      joiningDate: staffMember.joiningDate,
      shift: staffMember.shift
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const staffMember = staff.find(s => s.id === id);
    setStaff(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Staff Removed",
      description: `${staffMember?.name} has been removed from the team.`,
    });
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
          <h2 className="text-2xl font-bold">Staff Management</h2>
          <p className="text-muted-foreground">
            Manage hospital staff across all departments
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStaff(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
              </DialogTitle>
              <DialogDescription>
                {editingStaff ? "Update staff member information" : "Add a new team member to your hospital"}
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
                    <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as Staff["role"] }))}>
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
                      placeholder="email@hospital.com"
                      required
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
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                    <Select value={formData.shift} onValueChange={(value) => setFormData(prev => ({ ...prev, shift: value as Staff["shift"] }))}>
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
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingStaff ? "Update Staff Member" : "Add Staff Member"}
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
            <Users className="mr-2 h-5 w-5" />
            Staff Directory
          </CardTitle>
          <CardDescription>
            {filteredStaff.length} staff members
            {selectedDepartment !== "all" && ` in ${selectedDepartment}`}
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
                      <p className="font-medium">{staffMember.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{staffMember.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{staffMember.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge className={getRoleColor(staffMember.role)} variant="outline">
                        {staffMember.role}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{staffMember.department}</p>
                      {staffMember.specialization && (
                        <p className="text-xs text-muted-foreground">{staffMember.specialization}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{staffMember.qualification}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {staffMember.experience} years
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{staffMember.shift}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(staffMember.status)}>
                      {staffMember.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(staffMember)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(staffMember.id)}
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

export default StaffManagement;