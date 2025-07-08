import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Bed, User, Calendar, Search, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  admissionDate: Date;
  diagnosis: string;
  doctor: string;
  emergencyContact: string;
  bloodGroup: string;
  allergies?: string;
}

interface BedInfo {
  id: string;
  bedNumber: string;
  ward: string;
  type: "General" | "ICU" | "Private" | "Semi-Private" | "Emergency";
  floor: number;
  status: "occupied" | "available" | "maintenance" | "reserved";
  patient?: Patient;
  dailyRate: number;
  amenities: string[];
}

interface BedManagementSystemProps {
  facilityId: string;
}

const BedManagementSystem: React.FC<BedManagementSystemProps> = ({ facilityId }) => {
  const { toast } = useToast();
  const [beds, setBeds] = useState<BedInfo[]>([
    {
      id: "1",
      bedNumber: "ICU-001",
      ward: "ICU",
      type: "ICU",
      floor: 3,
      status: "occupied",
      dailyRate: 5000,
      amenities: ["Ventilator", "Monitor", "Private Bathroom"],
      patient: {
        id: "P001",
        name: "John Smith",
        age: 45,
        gender: "Male",
        phone: "+91-9876543210",
        admissionDate: new Date("2024-07-05"),
        diagnosis: "Acute Myocardial Infarction",
        doctor: "Dr. Rajesh Kumar",
        emergencyContact: "+91-9876543211",
        bloodGroup: "O+",
        allergies: "Penicillin"
      }
    },
    {
      id: "2",
      bedNumber: "GW-101",
      ward: "General Ward A",
      type: "General",
      floor: 1,
      status: "occupied",
      dailyRate: 1500,
      amenities: ["TV", "Shared Bathroom"],
      patient: {
        id: "P002",
        name: "Sarah Wilson",
        age: 32,
        gender: "Female",
        phone: "+91-9876543212",
        admissionDate: new Date("2024-07-06"),
        diagnosis: "Pneumonia",
        doctor: "Dr. Priya Sharma",
        emergencyContact: "+91-9876543213",
        bloodGroup: "A+"
      }
    },
    {
      id: "3",
      bedNumber: "PV-201",
      ward: "Private Ward",
      type: "Private",
      floor: 2,
      status: "available",
      dailyRate: 3500,
      amenities: ["AC", "TV", "Private Bathroom", "Refrigerator", "Recliner"]
    },
    {
      id: "4",
      bedNumber: "ICU-002",
      ward: "ICU",
      type: "ICU",
      floor: 3,
      status: "available",
      dailyRate: 5000,
      amenities: ["Ventilator", "Monitor", "Private Bathroom"]
    },
    {
      id: "5",
      bedNumber: "GW-102",
      ward: "General Ward A",
      type: "General",
      floor: 1,
      status: "maintenance",
      dailyRate: 1500,
      amenities: ["TV", "Shared Bathroom"]
    }
  ]);

  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<BedInfo | null>(null);
  const [filterWard, setFilterWard] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [patientFormData, setPatientFormData] = useState({
    name: "",
    age: 0,
    gender: "Male" as Patient["gender"],
    phone: "",
    diagnosis: "",
    doctor: "",
    emergencyContact: "",
    bloodGroup: "",
    allergies: ""
  });

  const wards = ["ICU", "General Ward A", "General Ward B", "Private Ward", "Emergency"];
  const bedTypes = ["General", "ICU", "Private", "Semi-Private", "Emergency"];
  const doctors = ["Dr. Rajesh Kumar", "Dr. Priya Sharma", "Dr. Amit Singh", "Dr. Sarah Johnson"];

  const filteredBeds = beds.filter(bed => {
    const matchesWard = filterWard === "all" || bed.ward === filterWard;
    const matchesStatus = filterStatus === "all" || bed.status === filterStatus;
    const matchesSearch = bed.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bed.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         "";
    return matchesWard && matchesStatus && matchesSearch;
  });

  const handleAdmitPatient = (bed: BedInfo) => {
    setSelectedBed(bed);
    setPatientFormData({
      name: "",
      age: 0,
      gender: "Male",
      phone: "",
      diagnosis: "",
      doctor: "",
      emergencyContact: "",
      bloodGroup: "",
      allergies: ""
    });
    setIsPatientDialogOpen(true);
  };

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBed) return;

    const newPatient: Patient = {
      id: `P${Date.now()}`,
      ...patientFormData,
      admissionDate: new Date()
    };

    setBeds(prev => prev.map(bed => 
      bed.id === selectedBed.id 
        ? { ...bed, status: "occupied" as const, patient: newPatient }
        : bed
    ));

    toast({
      title: "Patient Admitted",
      description: `${patientFormData.name} has been admitted to bed ${selectedBed.bedNumber}.`,
    });

    setIsPatientDialogOpen(false);
    setSelectedBed(null);
  };

  const handleDischarge = (bedId: string) => {
    setBeds(prev => prev.map(bed => 
      bed.id === bedId 
        ? { ...bed, status: "available" as const, patient: undefined }
        : bed
    ));

    const bed = beds.find(b => b.id === bedId);
    toast({
      title: "Patient Discharged",
      description: `Patient has been discharged from bed ${bed?.bedNumber}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "reserved":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ICU":
        return "bg-red-100 text-red-800";
      case "Private":
        return "bg-purple-100 text-purple-800";
      case "General":
        return "bg-blue-100 text-blue-800";
      case "Emergency":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate statistics
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(bed => bed.status === "occupied").length;
  const availableBeds = beds.filter(bed => bed.status === "available").length;
  const maintenanceBeds = beds.filter(bed => bed.status === "maintenance").length;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bed Management System</h2>
          <p className="text-muted-foreground">
            Manage hospital beds, patient admissions, and occupancy
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBeds}</div>
            <p className="text-xs text-muted-foreground">All bed types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{occupiedBeds}</div>
            <p className="text-xs text-muted-foreground">Currently occupied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Bed className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableBeds}</div>
            <p className="text-xs text-muted-foreground">Ready for patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{maintenanceBeds}</div>
            <p className="text-xs text-muted-foreground">Under maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">Current occupancy</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search beds or patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={filterWard} onValueChange={setFilterWard}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Wards</SelectItem>
            {wards.map(ward => (
              <SelectItem key={ward} value={ward}>{ward}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bed Management Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bed className="mr-2 h-5 w-5" />
            Bed Overview
          </CardTitle>
          <CardDescription>
            {filteredBeds.length} beds found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bed Details</TableHead>
                <TableHead>Ward & Type</TableHead>
                <TableHead>Patient Information</TableHead>
                <TableHead>Admission Details</TableHead>
                <TableHead>Daily Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBeds.map((bed) => (
                <TableRow key={bed.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{bed.bedNumber}</p>
                      <p className="text-sm text-muted-foreground">Floor {bed.floor}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {bed.amenities.slice(0, 2).map((amenity, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {bed.amenities.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{bed.amenities.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{bed.ward}</p>
                      <Badge className={getTypeColor(bed.type)} variant="outline">
                        {bed.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {bed.patient ? (
                      <div>
                        <p className="font-medium">{bed.patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {bed.patient.age}y, {bed.patient.gender}
                        </p>
                        <p className="text-sm text-muted-foreground">{bed.patient.phone}</p>
                        <p className="text-xs text-muted-foreground">
                          Blood: {bed.patient.bloodGroup}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No patient</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {bed.patient ? (
                      <div>
                        <p className="text-sm font-medium">{bed.patient.diagnosis}</p>
                        <p className="text-sm text-muted-foreground">{bed.patient.doctor}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {format(bed.patient.admissionDate, "MMM d, yyyy")}
                        </div>
                        {bed.patient.allergies && (
                          <p className="text-xs text-red-600">
                            Allergies: {bed.patient.allergies}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">₹{bed.dailyRate.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">per day</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(bed.status)}>
                      {bed.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {bed.status === "available" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAdmitPatient(bed)}
                        >
                          <User className="mr-1 h-3 w-3" />
                          Admit
                        </Button>
                      )}
                      {bed.status === "occupied" && bed.patient && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDischarge(bed.id)}
                        >
                          Discharge
                        </Button>
                      )}
                      {bed.status === "maintenance" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setBeds(prev => prev.map(b => 
                              b.id === bed.id ? { ...b, status: "available" as const } : b
                            ));
                            toast({
                              title: "Bed Ready",
                              description: `Bed ${bed.bedNumber} is now available.`,
                            });
                          }}
                        >
                          Mark Ready
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Patient Admission Dialog */}
      <Dialog open={isPatientDialogOpen} onOpenChange={setIsPatientDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Admit Patient</DialogTitle>
            <DialogDescription>
              Admit a new patient to bed {selectedBed?.bedNumber}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePatientSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="patient-name">Patient Name</Label>
                  <Input
                    id="patient-name"
                    value={patientFormData.name}
                    onChange={(e) => setPatientFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter patient name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={patientFormData.age}
                    onChange={(e) => setPatientFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                    placeholder="Age"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={patientFormData.gender} onValueChange={(value) => setPatientFormData(prev => ({ ...prev, gender: value as Patient["gender"] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={patientFormData.phone}
                    onChange={(e) => setPatientFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91-XXXXXXXXXX"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input
                    id="diagnosis"
                    value={patientFormData.diagnosis}
                    onChange={(e) => setPatientFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                    placeholder="Primary diagnosis"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="doctor">Attending Doctor</Label>
                  <Select value={patientFormData.doctor} onValueChange={(value) => setPatientFormData(prev => ({ ...prev, doctor: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map(doctor => (
                        <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="emergency-contact">Emergency Contact</Label>
                  <Input
                    id="emergency-contact"
                    value={patientFormData.emergencyContact}
                    onChange={(e) => setPatientFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    placeholder="+91-XXXXXXXXXX"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="blood-group">Blood Group</Label>
                  <Select value={patientFormData.bloodGroup} onValueChange={(value) => setPatientFormData(prev => ({ ...prev, bloodGroup: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="allergies">Allergies (Optional)</Label>
                <Input
                  id="allergies"
                  value={patientFormData.allergies}
                  onChange={(e) => setPatientFormData(prev => ({ ...prev, allergies: e.target.value }))}
                  placeholder="Known allergies or medications to avoid"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Admit Patient</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BedManagementSystem;