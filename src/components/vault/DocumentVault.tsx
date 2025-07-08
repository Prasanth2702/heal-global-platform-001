import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Image, 
  Download, 
  Share2, 
  Shield, 
  Eye,
  Calendar,
  User,
  Lock,
  Trash2,
  Search,
  Filter,
  Star,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

interface MedicalDocument {
  id: string;
  name: string;
  type: "lab-report" | "prescription" | "discharge-summary" | "scan" | "other";
  uploadDate: Date;
  fileSize: string;
  encryptionStatus: "encrypted" | "encrypting" | "failed";
  sharedWith: Array<{doctorName: string, accessExpiry: Date}>;
  tags: string[];
  isStarred: boolean;
  aiSummaryAvailable: boolean;
}

const DocumentVault = () => {
  const [documents, setDocuments] = useState<MedicalDocument[]>([
    {
      id: "1",
      name: "Blood Test Report - Jan 2024.pdf",
      type: "lab-report",
      uploadDate: new Date("2024-01-15"),
      fileSize: "2.4 MB",
      encryptionStatus: "encrypted",
      sharedWith: [{doctorName: "Dr. Smith", accessExpiry: new Date("2024-01-20")}],
      tags: ["blood-test", "routine"],
      isStarred: true,
      aiSummaryAvailable: true
    },
    {
      id: "2",
      name: "Cardiology Prescription.pdf",
      type: "prescription",
      uploadDate: new Date("2024-01-10"),
      fileSize: "1.2 MB",
      encryptionStatus: "encrypted",
      sharedWith: [],
      tags: ["cardiology", "medication"],
      isStarred: false,
      aiSummaryAvailable: true
    },
    {
      id: "3",
      name: "Chest X-Ray.jpg",
      type: "scan",
      uploadDate: new Date("2024-01-08"),
      fileSize: "5.1 MB",
      encryptionStatus: "encrypted",
      sharedWith: [],
      tags: ["x-ray", "chest"],
      isStarred: false,
      aiSummaryAvailable: false
    }
  ]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadProgress(0);
          // Add new document to the list
          console.log("File uploaded and encrypted");
        }
      }, 200);
    }
  };

  const shareDocument = (documentId: string) => {
    console.log("Generating secure share link for document:", documentId);
    // Here you would generate OTP or QR code
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lab-report":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "prescription":
        return <FileText className="h-4 w-4 text-green-600" />;
      case "discharge-summary":
        return <FileText className="h-4 w-4 text-purple-600" />;
      case "scan":
        return <Image className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEncryptionBadge = (status: string) => {
    switch (status) {
      case "encrypted":
        return <Badge className="bg-green-500"><Shield className="h-3 w-3 mr-1" />Encrypted</Badge>;
      case "encrypting":
        return <Badge variant="secondary">Encrypting...</Badge>;
      case "failed":
        return <Badge variant="destructive">Encryption Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Secure Document Vault</span>
              </CardTitle>
              <p className="text-muted-foreground">
                HIPAA-compliant encrypted storage for your medical records
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-green-600">
                <Lock className="h-3 w-3 mr-1" />
                AES-256 Encrypted
              </Badge>
              <Badge variant="outline">
                {documents.length} Documents
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">My Documents</TabsTrigger>
          <TabsTrigger value="shared">Shared Access</TabsTrigger>
          <TabsTrigger value="ai-summary">AI Summaries</TabsTrigger>
          <TabsTrigger value="compliance">Privacy & Compliance</TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <div className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Medical Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports PDF, JPEG, PNG up to 50MB. Files are automatically encrypted.
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button asChild>
                      <span>Select Files</span>
                    </Button>
                  </label>
                  
                  {isUploading && (
                    <div className="mt-4">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Uploading and encrypting... {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents or tags..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select 
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="border rounded-md px-3 py-2"
                    >
                      <option value="all">All Types</option>
                      <option value="lab-report">Lab Reports</option>
                      <option value="prescription">Prescriptions</option>
                      <option value="discharge-summary">Discharge Summaries</option>
                      <option value="scan">Medical Scans</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents List */}
            <div className="grid gap-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="hover:bg-accent">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="mt-1">
                          {getTypeIcon(doc.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium">{doc.name}</h3>
                            {doc.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            {doc.aiSummaryAvailable && (
                              <Badge variant="outline" className="text-xs">AI Summary</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{format(doc.uploadDate, "MMM dd, yyyy")}</span>
                            </span>
                            <span>{doc.fileSize}</span>
                            <span className="capitalize">{doc.type.replace("-", " ")}</span>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            {getEncryptionBadge(doc.encryptionStatus)}
                            {doc.sharedWith.length > 0 && (
                              <Badge variant="secondary">
                                Shared with {doc.sharedWith.length} doctor(s)
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => shareDocument(doc.id)}>
                            <Share2 className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Shared Access Tab */}
        <TabsContent value="shared">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Grant Temporary Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctor-email">Doctor's Email</Label>
                    <Input id="doctor-email" placeholder="doctor@hospital.com" />
                  </div>
                  <div>
                    <Label htmlFor="access-duration">Access Duration</Label>
                    <select className="w-full border rounded-md px-3 py-2">
                      <option value="1">1 Hour</option>
                      <option value="24">24 Hours</option>
                      <option value="72">72 Hours</option>
                      <option value="168">1 Week</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Select Documents to Share</Label>
                  <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center space-x-2">
                        <input type="checkbox" id={`share-${doc.id}`} />
                        <label htmlFor={`share-${doc.id}`} className="text-sm">
                          {doc.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button>Generate OTP Access</Button>
                  <Button variant="outline">Generate QR Code</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Shared Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.filter(doc => doc.sharedWith.length > 0).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Shared with: {doc.sharedWith.map(s => s.doctorName).join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          Expires: {format(doc.sharedWith[0].accessExpiry, "MMM dd, yyyy HH:mm")}
                        </p>
                        <Button variant="outline" size="sm">Revoke Access</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Summary Tab */}
        <TabsContent value="ai-summary">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Document Summaries</CardTitle>
              <p className="text-muted-foreground">
                Get intelligent summaries of your medical documents (Premium feature)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {documents.filter(doc => doc.aiSummaryAvailable).map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{doc.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">AI Summary:</h4>
                      <p className="text-sm text-muted-foreground">
                        This blood test report shows normal glucose levels (95 mg/dL), 
                        slightly elevated cholesterol (210 mg/dL), and normal kidney function markers. 
                        All other parameters are within normal ranges.
                      </p>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm">View Full Report</Button>
                      <Button variant="outline" size="sm">Share Summary</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>HIPAA Compliance & Privacy</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">HIPAA Compliant</h4>
                      <p className="text-sm text-green-700">
                        This vault meets HIPAA security and privacy requirements with end-to-end encryption,
                        access logging, and secure data transmission.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Encryption Standard</h4>
                    <p className="text-sm text-muted-foreground">AES-256 encryption at rest and in transit</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Access Logging</h4>
                    <p className="text-sm text-muted-foreground">All access attempts are logged and monitored</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Data Location</h4>
                    <p className="text-sm text-muted-foreground">Stored in HIPAA-compliant data centers</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Backup & Recovery</h4>
                    <p className="text-sm text-muted-foreground">Automated encrypted backups</p>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Privacy Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Allow AI Analysis</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable AI-powered document analysis and summaries
                        </p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Anonymous Analytics</Label>
                        <p className="text-sm text-muted-foreground">
                          Help improve our service with anonymous usage data
                        </p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Marketing Communications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new features and health tips
                        </p>
                      </div>
                      <input type="checkbox" className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Rights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download All My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      View Access Log
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Request Data Deletion
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentVault;