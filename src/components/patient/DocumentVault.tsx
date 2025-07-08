import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Image, Download, Share2, Eye, Trash2, QrCode, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Document {
  id: string;
  name: string;
  type: "report" | "prescription" | "image" | "insurance" | "other";
  uploadDate: string;
  size: string;
  doctor?: string;
  isShared: boolean;
  url: string;
}

const DocumentVault = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Mock data - will be replaced with real data from Supabase
  const documents: Document[] = [
    {
      id: "1",
      name: "Blood Test Report - Complete Blood Count",
      type: "report",
      uploadDate: "2024-01-12",
      size: "2.3 MB",
      doctor: "Dr. Sarah Johnson",
      isShared: false,
      url: "#"
    },
    {
      id: "2",
      name: "ECG Report",
      type: "report",
      uploadDate: "2024-01-10",
      size: "1.8 MB",
      doctor: "Dr. Sarah Johnson",
      isShared: true,
      url: "#"
    },
    {
      id: "3",
      name: "Prescription - Cardiac Medication",
      type: "prescription",
      uploadDate: "2024-01-08",
      size: "512 KB",
      doctor: "Dr. Sarah Johnson",
      isShared: false,
      url: "#"
    },
    {
      id: "4",
      name: "X-Ray Chest",
      type: "image",
      uploadDate: "2024-01-05",
      size: "4.2 MB",
      doctor: "Dr. Michael Chen",
      isShared: false,
      url: "#"
    },
    {
      id: "5",
      name: "Health Insurance Card",
      type: "insurance",
      uploadDate: "2024-01-01",
      size: "1.1 MB",
      isShared: false,
      url: "#"
    }
  ];

  const documentTypes = [
    { value: "all", label: "All Documents" },
    { value: "report", label: "Medical Reports" },
    { value: "prescription", label: "Prescriptions" },
    { value: "image", label: "Medical Images" },
    { value: "insurance", label: "Insurance Documents" },
    { value: "other", label: "Other Documents" }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.doctor?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        toast({
          title: "Document Uploaded",
          description: `${file.name} has been securely uploaded to your vault.`,
        });
      });
    }
  };

  const handleShare = (documentId: string) => {
    toast({
      title: "Share Document",
      description: "Opening sharing options with OTP and QR code access...",
    });
    // Open sharing modal
  };

  const handleDownload = (documentId: string, documentName: string) => {
    toast({
      title: "Downloading Document",
      description: `${documentName} is being downloaded...`,
    });
    // Handle download
  };

  const handleDelete = (documentId: string) => {
    toast({
      title: "Document Deleted",
      description: "Document has been permanently removed from your vault.",
    });
    // Handle deletion
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-8 w-8 text-blue-500" />;
      case "report":
      case "prescription":
        return <FileText className="h-8 w-8 text-green-500" />;
      case "insurance":
        return <Shield className="h-8 w-8 text-purple-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "report":
        return "bg-green-100 text-green-800";
      case "prescription":
        return "bg-blue-100 text-blue-800";
      case "image":
        return "bg-purple-100 text-purple-800";
      case "insurance":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Digital Medical Vault</h2>
          <p className="text-muted-foreground">
            Securely store and manage your medical documents
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button 
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Documents
          </Button>
          <Button variant="patient">
            <QrCode className="mr-2 h-4 w-4" />
            Quick Share
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Documents</Label>
              <Input
                id="search"
                placeholder="Search by document name, doctor, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="type-filter">Document Type</Label>
              <select
                id="type-filter"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-medium transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                {getDocumentIcon(document.type)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost">
                      •••
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleDownload(document.id, document.name)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare(document.id)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(document.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm leading-tight">
                    {document.name}
                  </h4>
                  {document.doctor && (
                    <p className="text-xs text-muted-foreground mt-1">
                      by {document.doctor}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className={getTypeBadgeColor(document.type)}
                  >
                    {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                  </Badge>
                  {document.isShared && (
                    <Badge variant="outline" className="text-xs">
                      <Share2 className="mr-1 h-3 w-3" />
                      Shared
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</p>
                  <p>Size: {document.size}</p>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleShare(document.id)}
                  >
                    <Share2 className="mr-1 h-3 w-3" />
                    Share
                  </Button>
                  <Button 
                    size="sm" 
                    variant="patient" 
                    className="flex-1"
                    onClick={() => handleDownload(document.id, document.name)}
                  >
                    <Download className="mr-1 h-3 w-3" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Documents Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedType !== "all" 
                ? "Try adjusting your search criteria." 
                : "Upload your first medical document to get started."}
            </p>
            <Button 
              variant="patient"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Documents
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentVault;