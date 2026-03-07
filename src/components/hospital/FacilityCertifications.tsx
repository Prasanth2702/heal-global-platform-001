import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, FileText, Image, Download, Eye, Calendar, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import mixpanelInstance from "@/utils/mixpanel";
interface Certification {
  id: string;
  name: string;
  type: "accreditation" | "license" | "certificate" | "permit";
  issuingAuthority: string;
  certificateNumber: string;
  issueDate: Date;
  expiryDate: Date;
  status: "active" | "expired" | "pending_renewal";
  department?: string;
  description: string;
  documentUrl?: string;
}

interface FacilityImage {
  id: string;
  title: string;
  category: "exterior" | "interior" | "equipment" | "facility" | "certification";
  department?: string;
  description: string;
  imageUrl: string;
  uploadDate: Date;
}

const FacilityCertifications = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"certifications" | "images">("certifications");
  
  // Certifications state
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: "1",
      name: "NABH Accreditation",
      type: "accreditation",
      issuingAuthority: "National Accreditation Board for Hospitals",
      certificateNumber: "NABH/2024/001",
      issueDate: new Date("2024-01-15"),
      expiryDate: new Date("2027-01-15"),
      status: "active",
      description: "National quality and patient safety standards accreditation"
    },
    {
      id: "2",
      name: "Fire Safety Certificate",
      type: "certificate",
      issuingAuthority: "Fire Safety Department",
      certificateNumber: "FSC/2024/789",
      issueDate: new Date("2024-03-10"),
      expiryDate: new Date("2025-03-10"),
      status: "active",
      description: "Fire safety compliance certification for hospital premises"
    },
    {
      id: "3",
      name: "Biomedical Waste License",
      type: "license",
      issuingAuthority: "State Pollution Control Board",
      certificateNumber: "BMW/2023/456",
      issueDate: new Date("2023-06-01"),
      expiryDate: new Date("2024-06-01"),
      status: "pending_renewal",
      description: "License for handling and disposal of biomedical waste"
    }
  ]);

  // Images state
  const [facilityImages, setFacilityImages] = useState<FacilityImage[]>([
    {
      id: "1",
      title: "Main Building Exterior",
      category: "exterior",
      description: "Front view of the hospital main building",
      imageUrl: "/api/placeholder/400/300",
      uploadDate: new Date("2024-01-20")
    },
    {
      id: "2",
      title: "Emergency Department",
      category: "interior",
      department: "Emergency",
      description: "Emergency department reception and waiting area",
      imageUrl: "/api/placeholder/400/300",
      uploadDate: new Date("2024-01-25")
    },
    {
      id: "3",
      title: "MRI Scanner",
      category: "equipment",
      department: "Radiology",
      description: "Latest MRI scanning equipment in radiology department",
      imageUrl: "/api/placeholder/400/300",
      uploadDate: new Date("2024-02-01")
    }
  ]);

  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [editingImage, setEditingImage] = useState<FacilityImage | null>(null);

  const [certFormData, setCertFormData] = useState({
    name: "",
    type: "certificate" as Certification["type"],
    issuingAuthority: "",
    certificateNumber: "",
    issueDate: "",
    expiryDate: "",
    department: "",
    description: ""
  });

  const [imageFormData, setImageFormData] = useState({
    title: "",
    category: "facility" as FacilityImage["category"],
    department: "",
    description: "",
    imageFile: null as File | null
  });

  const certificationTypes = ["accreditation", "license", "certificate", "permit"];
  const imageCategories = ["exterior", "interior", "equipment", "facility", "certification"];
  const departments = ["General OPD", "Radiology", "Pathology Lab", "Emergency", "Surgery", "ICU", "Pharmacy"];
// Add tracking functions
const trackCertificationAction = (action: string, certData?: any, additionalData = {}) => {
  mixpanelInstance.track('Facility Certification Action', {
    action,
    certificationId: certData?.id,
    certificationName: certData?.name,
    certificationType: certData?.type,
    ...additionalData
  });
};

const trackImageAction = (action: string, imageData?: any, additionalData = {}) => {
  mixpanelInstance.track('Facility Image Action', {
    action,
    imageId: imageData?.id,
    imageTitle: imageData?.title,
    imageCategory: imageData?.category,
    ...additionalData
  });
};

const handleTabChange = (tab: "certifications" | "images") => {
  mixpanelInstance.track('Facility Tab Change', { 
    fromTab: activeTab, 
    toTab: tab 
  });
  setActiveTab(tab);
};

  const handleCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     trackCertificationAction(editingCertification ? 'edit_attempt' : 'add_attempt', 
    editingCertification, certFormData);
    if (editingCertification) {
      setCertifications(prev => prev.map(cert => 
        cert.id === editingCertification.id 
          ? { 
              ...cert, 
              ...certFormData,
              issueDate: new Date(certFormData.issueDate),
              expiryDate: new Date(certFormData.expiryDate),
              status: new Date(certFormData.expiryDate) > new Date() ? "active" : "expired"
            }
          : cert
      ));
      toast({
        title: "Certification Updated",
        description: `${certFormData.name} has been updated successfully.`,
      });
      setEditingCertification(null);
      trackCertificationAction('edit_success', { id: editingCertification.id, name: certFormData.name }, { formData: certFormData });
    } else {
      const newCertification: Certification = {
        id: Date.now().toString(),
        ...certFormData,
        issueDate: new Date(certFormData.issueDate),
        expiryDate: new Date(certFormData.expiryDate),
        status: new Date(certFormData.expiryDate) > new Date() ? "active" : "expired"
      };
      setCertifications(prev => [...prev, newCertification]);
      toast({
        title: "Certification Added",
        description: `${certFormData.name} has been added successfully.`,
      });
      trackCertificationAction('add_success', { id: newCertification.id, name: certFormData.name }, { formData: certFormData });
    }
    
    setCertFormData({
      name: "",
      type: "certificate",
      issuingAuthority: "",
      certificateNumber: "",
      issueDate: "",
      expiryDate: "",
      department: "",
      description: ""
    });
    setIsCertDialogOpen(false);
    trackCertificationAction('dialog_close', editingCertification || null);
  };

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackCertificationAction(editingImage ? 'edit_attempt' : 'add_attempt',
    editingImage, imageFormData);
    if (editingImage) {
      setFacilityImages(prev => prev.map(img => 
        img.id === editingImage.id 
          ? { ...img, ...imageFormData }
          : img
      ));
      toast({
        title: "Image Updated",
        description: `${imageFormData.title} has been updated successfully.`,
      });
      setEditingImage(null);
      trackImageAction('edit_success', { id: editingImage.id, title: imageFormData.title }, { formData: imageFormData });
    } else {
      const newImage: FacilityImage = {
        id: Date.now().toString(),
        ...imageFormData,
        imageUrl: "/api/placeholder/400/300", // Mock URL
        uploadDate: new Date()
      };
      setFacilityImages(prev => [...prev, newImage]);
      toast({
        title: "Image Added",
        description: `${imageFormData.title} has been uploaded successfully.`,
      });
      trackImageAction('add_success', { id: newImage.id, title: imageFormData.title }, { formData: imageFormData });
    }
    
    setImageFormData({
      title: "",
      category: "facility",
      department: "",
      description: "",
      imageFile: null
    });
    setIsImageDialogOpen(false);
  };

  const handleEditCertification = (cert: Certification) => {
    setEditingCertification(cert);
    setCertFormData({
      name: cert.name,
      type: cert.type,
      issuingAuthority: cert.issuingAuthority,
      certificateNumber: cert.certificateNumber,
      issueDate: format(cert.issueDate, "yyyy-MM-dd"),
      expiryDate: format(cert.expiryDate, "yyyy-MM-dd"),
      department: cert.department || "",
      description: cert.description
    });
    setIsCertDialogOpen(true);
    trackCertificationAction('dialog_open', editingCertification || null);
  };

  const handleEditImage = (image: FacilityImage) => {
    setEditingImage(image);
    setImageFormData({
      title: image.title,
      category: image.category,
      department: image.department || "",
      description: image.description,
      imageFile: null
    });
    setIsImageDialogOpen(true);
    trackImageAction('dialog_open', editingImage || null);
  };

  const handleDeleteCertification = (id: string) => {
    const cert = certifications.find(c => c.id === id);
    setCertifications(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Certification Deleted",
      description: `${cert?.name} has been removed.`,
    });
    trackCertificationAction('delete', { id, name: cert?.name });
  };

  const handleDeleteImage = (id: string) => {
    const image = facilityImages.find(img => img.id === id);
    setFacilityImages(prev => prev.filter(img => img.id !== id));
    toast({
      title: "Image Deleted",
      description: `${image?.title} has been removed.`,
    });
    trackImageAction('delete', { id, title: image?.title });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "pending_renewal":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "accreditation":
        return "bg-blue-100 text-blue-800";
      case "license":
        return "bg-purple-100 text-purple-800";
      case "certificate":
        return "bg-green-100 text-green-800";
      case "permit":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Facility Management</h2>
          <p className="text-muted-foreground">
            Manage certifications and facility images
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        <Button
          variant={activeTab === "certifications" ? "default" : "ghost"}
          onClick={() => setActiveTab("certifications")}
          className="flex items-center space-x-2"
        >
          <FileText className="h-4 w-4" />
          <span>Certifications</span>
        </Button>
        <Button
          variant={activeTab === "images" ? "default" : "ghost"}
          onClick={() => setActiveTab("images")}
          className="flex items-center space-x-2"
        >
          <Image className="h-4 w-4" />
          <span>Facility Images</span>
        </Button>
      </div>

      {/* Certifications Tab */}
      {activeTab === "certifications" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isCertDialogOpen} onOpenChange={setIsCertDialogOpen}>
              <DialogTrigger asChild>
                <Button   onClick={() => {
    trackCertificationAction('add_certification_click');
    setEditingCertification(null);
    setIsCertDialogOpen(true);
  }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Certification
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingCertification ? "Edit Certification" : "Add New Certification"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCertification ? "Update certification information" : "Add a new certification or license"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCertSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="cert-name">Certification Name</Label>
                      <Input
                        id="cert-name"
                        value={certFormData.name}
                        onChange={(e) => setCertFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter certification name"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="cert-type">Type</Label>
                        <Select value={certFormData.type} onValueChange={(value) => setCertFormData(prev => ({ ...prev, type: value as Certification["type"] }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {certificationTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cert-department">Department (Optional)</Label>
                        <Select value={certFormData.department} onValueChange={(value) => setCertFormData(prev => ({ ...prev, department: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Departments</SelectItem>
                            {departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="cert-authority">Issuing Authority</Label>
                      <Input
                        id="cert-authority"
                        value={certFormData.issuingAuthority}
                        onChange={(e) => setCertFormData(prev => ({ ...prev, issuingAuthority: e.target.value }))}
                        placeholder="Enter issuing authority"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="cert-number">Certificate Number</Label>
                      <Input
                        id="cert-number"
                        value={certFormData.certificateNumber}
                        onChange={(e) => setCertFormData(prev => ({ ...prev, certificateNumber: e.target.value }))}
                        placeholder="Enter certificate number"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="cert-issue">Issue Date</Label>
                        <Input
                          id="cert-issue"
                          type="date"
                          value={certFormData.issueDate}
                          onChange={(e) => setCertFormData(prev => ({ ...prev, issueDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cert-expiry">Expiry Date</Label>
                        <Input
                          id="cert-expiry"
                          type="date"
                          value={certFormData.expiryDate}
                          onChange={(e) => setCertFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="cert-description">Description</Label>
                      <Textarea
                        id="cert-description"
                        value={certFormData.description}
                        onChange={(e) => setCertFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter description"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editingCertification ? "Update Certification" : "Add Certification"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Certifications & Licenses
              </CardTitle>
              <CardDescription>
                {certifications.length} certifications on record
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certification Details</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Certificate Number</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certifications.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-muted-foreground">{cert.issuingAuthority}</p>
                          {cert.department && (
                            <p className="text-xs text-muted-foreground">Department: {cert.department}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(cert.type)} variant="outline">
                          {cert.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{cert.certificateNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-1 h-3 w-3" />
                            {format(cert.issueDate, "MMM d, yyyy")}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Expires: {format(cert.expiryDate, "MMM d, yyyy")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(cert.status)}>
                          {cert.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCertification(cert)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCertification(cert.id)}
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
      )}

      {/* Images Tab */}
      {activeTab === "images" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
              <DialogTrigger asChild>
                <Button  onClick={() => {
    trackImageAction('upload_image_click');
    setEditingImage(null);
    setIsImageDialogOpen(true);
  }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingImage ? "Edit Image" : "Upload New Image"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingImage ? "Update image information" : "Upload a new facility image"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleImageSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="img-title">Image Title</Label>
                      <Input
                        id="img-title"
                        value={imageFormData.title}
                        onChange={(e) => setImageFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter image title"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="img-category">Category</Label>
                        <Select value={imageFormData.category} onValueChange={(value) => setImageFormData(prev => ({ ...prev, category: value as FacilityImage["category"] }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {imageCategories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="img-department">Department (Optional)</Label>
                        <Select value={imageFormData.department} onValueChange={(value) => setImageFormData(prev => ({ ...prev, department: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No specific department</SelectItem>
                            {departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="img-description">Description</Label>
                      <Textarea
                        id="img-description"
                        value={imageFormData.description}
                        onChange={(e) => setImageFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter image description"
                      />
                    </div>

                    {!editingImage && (
                      <div className="grid gap-2">
                        <Label htmlFor="img-file">Image File</Label>
                        <Input
                          id="img-file"
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFormData(prev => ({ ...prev, imageFile: e.target.files?.[0] || null }))}
                          required
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editingImage ? "Update Image" : "Upload Image"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilityImages.map((image) => (
              <Card key={image.id}>
                <CardHeader className="pb-2">
                  <div className="aspect-video bg-muted rounded-md mb-2 overflow-hidden">
                    <img 
                      src={image.imageUrl} 
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg">{image.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{image.category}</Badge>
                    {image.department && (
                      <Badge variant="outline">{image.department}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{image.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(image.uploadDate, "MMM d, yyyy")}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditImage(image)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityCertifications;