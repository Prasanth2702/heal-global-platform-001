import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Eye, Clock, User, Building, FileText, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, subDays } from "date-fns";

interface PendingRegistration {
  id: string;
  name: string;
  type: "doctor" | "hospital" | "patient";
  email: string;
  phone: string;
  specialization?: string;
  licenseNumber?: string;
  address: string;
  city: string;
  state: string;
  documents: string[];
  submittedAt: Date;
  status: "pending" | "under_review" | "approved" | "rejected";
  reviewNotes?: string;
  priority: "normal" | "high" | "urgent";
}

const RegistrationApprovals = () => {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<PendingRegistration[]>([
    {
      id: "1",
      name: "Dr. Amit Sharma",
      type: "doctor",
      email: "amit.sharma@email.com",
      phone: "+91-9876543210",
      specialization: "Cardiology",
      licenseNumber: "MH/DOC/2024/001",
      address: "123 Medical Plaza",
      city: "Mumbai",
      state: "Maharashtra",
      documents: ["Medical License", "ID Proof", "Specialization Certificate"],
      submittedAt: subDays(new Date(), 2),
      status: "pending",
      priority: "high"
    },
    {
      id: "2",
      name: "City Hospital",
      type: "hospital",
      email: "admin@cityhospital.com",
      phone: "+91-9876543211",
      licenseNumber: "MH/HOS/2024/002",
      address: "456 Healthcare Avenue",
      city: "Pune",
      state: "Maharashtra",
      documents: ["Hospital License", "Registration Certificate", "Fire Safety Certificate"],
      submittedAt: subDays(new Date(), 1),
      status: "under_review",
      priority: "normal"
    },
    {
      id: "3",
      name: "Sarah Wilson",
      type: "patient",
      email: "sarah.wilson@email.com",
      phone: "+91-9876543212",
      address: "789 Residential Complex",
      city: "Bangalore",
      state: "Karnataka",
      documents: ["ID Proof", "Address Proof"],
      submittedAt: subDays(new Date(), 3),
      status: "pending",
      priority: "normal"
    }
  ]);

  const [selectedRegistration, setSelectedRegistration] = useState<PendingRegistration | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRegistrations = registrations.filter(reg => {
    const matchesStatus = statusFilter === "all" || reg.status === statusFilter;
    const matchesType = typeFilter === "all" || reg.type === typeFilter;
    const matchesSearch = reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const handleApproval = (registrationId: string, approved: boolean) => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === registrationId 
        ? { 
            ...reg, 
            status: approved ? "approved" : "rejected",
            reviewNotes: reviewNotes || (approved ? "Application approved" : "Application rejected")
          }
        : reg
    ));

    const registration = registrations.find(r => r.id === registrationId);
    toast({
      title: approved ? "Registration Approved" : "Registration Rejected",
      description: `${registration?.name}'s application has been ${approved ? "approved" : "rejected"}.`,
    });

    setIsReviewDialogOpen(false);
    setSelectedRegistration(null);
    setReviewNotes("");
  };

  const handleReview = (registration: PendingRegistration) => {
    setSelectedRegistration(registration);
    setReviewNotes(registration.reviewNotes || "");
    setIsReviewDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "doctor":
        return "bg-blue-100 text-blue-800";
      case "hospital":
        return "bg-purple-100 text-purple-800";
      case "patient":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "under_review":
        return <Eye className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const pendingCount = registrations.filter(r => r.status === "pending").length;
  const underReviewCount = registrations.filter(r => r.status === "under_review").length;
  const approvedCount = registrations.filter(r => r.status === "approved").length;
  const rejectedCount = registrations.filter(r => r.status === "rejected").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Registration Approvals</h2>
          <p className="text-muted-foreground">
            Review and approve new user registrations
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{underReviewCount}</div>
            <p className="text-xs text-muted-foreground">Being reviewed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search registrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="doctor">Doctors</SelectItem>
            <SelectItem value="hospital">Hospitals</SelectItem>
            <SelectItem value="patient">Patients</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Registration Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Registration Applications
          </CardTitle>
          <CardDescription>
            {filteredRegistrations.length} applications found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant Details</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact Information</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{registration.name}</p>
                      {registration.specialization && (
                        <p className="text-sm text-muted-foreground">{registration.specialization}</p>
                      )}
                      {registration.licenseNumber && (
                        <p className="text-xs text-muted-foreground">License: {registration.licenseNumber}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(registration.type)} variant="outline">
                      {registration.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{registration.email}</p>
                      <p className="text-sm text-muted-foreground">{registration.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{registration.city}</p>
                      <p className="text-xs text-muted-foreground">{registration.state}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(registration.priority)} variant="outline">
                      {registration.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {format(registration.submittedAt, "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(registration.status)}
                      <Badge className={getStatusColor(registration.status)}>
                        {registration.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReview(registration)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      {(registration.status === "pending" || registration.status === "under_review") && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRegistration(registration);
                              setReviewNotes("Application approved after review");
                              handleApproval(registration.id, true);
                            }}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRegistration(registration);
                              setReviewNotes("Application rejected due to incomplete documentation");
                              handleApproval(registration.id, false);
                            }}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Registration Application</DialogTitle>
            <DialogDescription>
              Review application details and provide approval decision
            </DialogDescription>
          </DialogHeader>
          
          {selectedRegistration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm">{selectedRegistration.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <Badge className={getTypeColor(selectedRegistration.type)} variant="outline">
                    {selectedRegistration.type}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedRegistration.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{selectedRegistration.phone}</p>
                </div>
              </div>

              {selectedRegistration.specialization && (
                <div>
                  <Label className="text-sm font-medium">Specialization</Label>
                  <p className="text-sm">{selectedRegistration.specialization}</p>
                </div>
              )}

              {selectedRegistration.licenseNumber && (
                <div>
                  <Label className="text-sm font-medium">License Number</Label>
                  <p className="text-sm">{selectedRegistration.licenseNumber}</p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="text-sm">{selectedRegistration.address}, {selectedRegistration.city}, {selectedRegistration.state}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Documents Submitted</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedRegistration.documents.map((doc, index) => (
                    <Badge key={index} variant="outline">{doc}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="review-notes">Review Notes</Label>
                <Textarea
                  id="review-notes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Enter review notes..."
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={() => selectedRegistration && handleApproval(selectedRegistration.id, false)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={() => selectedRegistration && handleApproval(selectedRegistration.id, true)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegistrationApprovals;