import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Building2, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: string;
  name: string;
  type: "OPD" | "Diagnostics" | "Pharmacy" | "Lab" | "Emergency" | "Surgery" | "ICU" | "Other";
  head: string;
  staffCount: number;
  operatingHours: string;
  status: "active" | "inactive";
  description: string;
}

const DepartmentManagement = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "General OPD",
      type: "OPD",
      head: "Dr. Rajesh Kumar",
      staffCount: 12,
      operatingHours: "8:00 AM - 6:00 PM",
      status: "active",
      description: "General outpatient consultations"
    },
    {
      id: "2",
      name: "Radiology",
      type: "Diagnostics",
      head: "Dr. Priya Sharma",
      staffCount: 8,
      operatingHours: "24/7",
      status: "active",
      description: "X-ray, MRI, CT scan services"
    },
    {
      id: "3",
      name: "Pathology Lab",
      type: "Lab",
      head: "Dr. Amit Singh",
      staffCount: 15,
      operatingHours: "6:00 AM - 10:00 PM",
      status: "active",
      description: "Blood tests, tissue analysis"
    },
    {
      id: "4",
      name: "In-house Pharmacy",
      type: "Pharmacy",
      head: "Mr. Suresh Patel",
      staffCount: 6,
      operatingHours: "8:00 AM - 10:00 PM",
      status: "active",
      description: "Prescription medications and supplies"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "OPD" as Department["type"],
    head: "",
    operatingHours: "",
    description: ""
  });

  const departmentTypes = ["OPD", "Diagnostics", "Pharmacy", "Lab", "Emergency", "Surgery", "ICU", "Other"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDepartment) {
      setDepartments(prev => prev.map(dept => 
        dept.id === editingDepartment.id 
          ? { ...dept, ...formData, staffCount: dept.staffCount }
          : dept
      ));
      toast({
        title: "Department Updated",
        description: `${formData.name} has been updated successfully.`,
      });
      setEditingDepartment(null);
    } else {
      const newDepartment: Department = {
        id: Date.now().toString(),
        ...formData,
        staffCount: 0,
        status: "active"
      };
      setDepartments(prev => [...prev, newDepartment]);
      toast({
        title: "Department Added",
        description: `${formData.name} has been added successfully.`,
      });
    }
    
    setFormData({ name: "", type: "OPD", head: "", operatingHours: "", description: "" });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      type: department.type,
      head: department.head,
      operatingHours: department.operatingHours,
      description: department.description
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const department = departments.find(d => d.id === id);
    setDepartments(prev => prev.filter(dept => dept.id !== id));
    toast({
      title: "Department Deleted",
      description: `${department?.name} has been removed.`,
    });
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Department Management</h2>
          <p className="text-muted-foreground">
            Manage hospital departments and their operations
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingDepartment(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingDepartment ? "Edit Department" : "Add New Department"}
              </DialogTitle>
              <DialogDescription>
                {editingDepartment ? "Update department information" : "Create a new department in your hospital"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter department name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Department Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Department["type"] }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    {departmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="head">Department Head</Label>
                  <Input
                    id="head"
                    value={formData.head}
                    onChange={(e) => setFormData(prev => ({ ...prev, head: e.target.value }))}
                    placeholder="Enter department head name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hours">Operating Hours</Label>
                  <Input
                    id="hours"
                    value={formData.operatingHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, operatingHours: e.target.value }))}
                    placeholder="e.g., 8:00 AM - 6:00 PM"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of department"
                  />
                </div>
              </div>
              <DialogFooter>
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
            {departments.length} departments registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Department Head</TableHead>
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
                      <p className="text-sm text-muted-foreground">{department.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{department.type}</Badge>
                  </TableCell>
                  <TableCell>{department.head}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {department.staffCount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {department.operatingHours}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(department.status)}>
                      {department.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(department)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(department.id)}
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

export default DepartmentManagement;