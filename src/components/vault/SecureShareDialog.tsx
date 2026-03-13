import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Share2, 
  Eye, 
  Shield, 
  Clock, 
  QrCode,
  Mail,
  Key,
  FileText,
  Download,
  Camera,
  CameraOff,
  Timer,
  User,
  Lock
} from "lucide-react";
import { format, addHours, addDays } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface MedicalDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: Date;
  fileSize: string;
  isSelected?: boolean;
}

interface SecureShareDialogProps {
  documents: MedicalDocument[];
  onShare: (shareConfig: ShareConfiguration) => void;
}

interface ShareConfiguration {
  selectedDocuments: string[];
  doctorEmail: string;
  accessDuration: number;
  accessType: "preview-only" | "download-allowed";
  screenshotProtection: boolean;
  otpAccess: boolean;
  qrAccess: boolean;
  notes: string;
}

const SecureShareDialog = ({ documents, onShare }: SecureShareDialogProps) => {
  const [shareConfig, setShareConfig] = useState<ShareConfiguration>({
    selectedDocuments: [],
    doctorEmail: "",
    accessDuration: 24,
    accessType: "preview-only",
    screenshotProtection: true,
    otpAccess: true,
    qrAccess: false,
    notes: ""
  });

  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  const handleDocumentSelection = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocs([...selectedDocs, documentId]);
    } else {
      setSelectedDocs(selectedDocs.filter(id => id !== documentId));
    }
    setShareConfig({
      ...shareConfig,
      selectedDocuments: checked 
        ? [...shareConfig.selectedDocuments, documentId]
        : shareConfig.selectedDocuments.filter(id => id !== documentId)
    });
  };

  const generateSecureAccess = () => {
    if (shareConfig.selectedDocuments.length === 0) {
      toast({
        title: "No Documents Selected",
        description: "Please select at least one document to share"
      });
      return;
    }
    if (!shareConfig.doctorEmail) {
      toast({
        title: "Invalid Doctor Email",
        description: "Please enter a valid doctor's email address"
      });
      return;
    }
    onShare(shareConfig);
  };

  const getExpiryTime = () => {
    return format(addHours(new Date(), shareConfig.accessDuration), "PPP p");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Share2 className="h-4 w-4" />
          <span>Secure Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Secure Document Sharing</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Document Selection */}
          <div>
            <Label className="text-base font-medium">Select Documents to Share</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Choose specific documents that the doctor can access
            </p>
            <div className="max-h-60 overflow-y-auto border rounded-lg p-3 space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center space-x-3 p-2 hover:bg-accent rounded">
                  <Checkbox
                    id={`doc-${doc.id}`}
                    checked={selectedDocs.includes(doc.id)}
                    onCheckedChange={(checked) => handleDocumentSelection(doc.id, checked as boolean)}
                  />
                  <div className="flex items-center space-x-2 flex-1">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.type} • {doc.fileSize} • {format(doc.uploadDate, "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedDocs.length > 0 && (
              <p className="text-sm text-green-600 mt-2">
                ✓ {selectedDocs.length} document(s) selected for sharing
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Access Configuration */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="doctor-email">Doctor's Email Address</Label>
                <Input
                  id="doctor-email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  value={shareConfig.doctorEmail}
                  onChange={(e) => setShareConfig({...shareConfig, doctorEmail: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="access-duration">Access Duration</Label>
                <Select 
                  value={shareConfig.accessDuration.toString()} 
                  onValueChange={(value) => setShareConfig({...shareConfig, accessDuration: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Hour</SelectItem>
                    <SelectItem value="6">6 Hours</SelectItem>
                    <SelectItem value="24">24 Hours</SelectItem>
                    <SelectItem value="72">72 Hours</SelectItem>
                    <SelectItem value="168">1 Week</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Access will expire on: {getExpiryTime()}
                </p>
              </div>

              <div>
                <Label htmlFor="access-notes">Additional Notes (Optional)</Label>
                <Input
                  id="access-notes"
                  placeholder="Purpose of sharing, specific instructions..."
                  value={shareConfig.notes}
                  onChange={(e) => setShareConfig({...shareConfig, notes: e.target.value})}
                />
              </div>
            </div>

            {/* Privacy & Security Settings */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Access Type</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="preview-only"
                      name="accessType"
                      checked={shareConfig.accessType === "preview-only"}
                      onChange={() => setShareConfig({...shareConfig, accessType: "preview-only"})}
                    />
                    <label htmlFor="preview-only" className="flex items-center space-x-2 text-sm">
                      <Eye className="h-4 w-4" />
                      <span>Preview Only (Recommended)</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="download-allowed"
                      name="accessType"
                      checked={shareConfig.accessType === "download-allowed"}
                      onChange={() => setShareConfig({...shareConfig, accessType: "download-allowed"})}
                    />
                    <label htmlFor="download-allowed" className="flex items-center space-x-2 text-sm">
                      <Download className="h-4 w-4" />
                      <span>Allow Downloads</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Security Features</Label>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CameraOff className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Screenshot Protection</span>
                  </div>
                  <Checkbox
                    checked={shareConfig.screenshotProtection}
                    onCheckedChange={(checked) => setShareConfig({...shareConfig, screenshotProtection: checked as boolean})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Key className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">OTP Authentication</span>
                  </div>
                  <Checkbox
                    checked={shareConfig.otpAccess}
                    onCheckedChange={(checked) => setShareConfig({...shareConfig, otpAccess: checked as boolean})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <QrCode className="h-4 w-4 text-green-600" />
                    <span className="text-sm">QR Code Access</span>
                  </div>
                  <Checkbox
                    checked={shareConfig.qrAccess}
                    onCheckedChange={(checked) => setShareConfig({...shareConfig, qrAccess: checked as boolean})}
                  />
                </div>
              </div>

              {shareConfig.accessType === "preview-only" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Maximum Privacy</p>
                      <p className="text-xs text-green-700">
                        Documents can only be viewed, not downloaded or saved. Screenshots are blocked on mobile devices.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Share Summary */}
          {selectedDocs.length > 0 && (
            <div className="border rounded-lg p-4 bg-accent">
              <h4 className="font-medium mb-2">Sharing Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Documents:</strong> {selectedDocs.length} selected</p>
                  <p><strong>Recipient:</strong> {shareConfig.doctorEmail || "Not specified"}</p>
                  <p><strong>Access Type:</strong> {shareConfig.accessType.replace("-", " ").toUpperCase()}</p>
                </div>
                <div>
                  <p><strong>Duration:</strong> {shareConfig.accessDuration} hours</p>
                  <p><strong>Screenshot Protection:</strong> {shareConfig.screenshotProtection ? "✓ Enabled" : "✗ Disabled"}</p>
                  <p><strong>Authentication:</strong> {shareConfig.otpAccess ? "OTP" : ""} {shareConfig.qrAccess ? "+ QR" : ""}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button 
              onClick={generateSecureAccess}
              disabled={selectedDocs.length === 0 || !shareConfig.doctorEmail}
            >
              Generate Secure Access
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SecureShareDialog;