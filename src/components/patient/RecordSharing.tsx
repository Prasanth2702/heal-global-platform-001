import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QrCode, Share2, Copy, Clock, Shield, Eye, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SharedRecord {
  id: string;
  documentName: string;
  sharedWith: string;
  shareDate: string;
  accessType: "otp" | "qr" | "link";
  expiresAt: string;
  accessCount: number;
  isActive: boolean;
}

const RecordSharing = () => {
  const { toast } = useToast();
  const [shareMethod, setShareMethod] = useState<"otp" | "qr" | "link">("otp");
  const [otpCode, setOtpCode] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [qrCode, setQrCode] = useState("");

  // Mock data for shared records
  const sharedRecords: SharedRecord[] = [
    {
      id: "1",
      documentName: "Blood Test Report - Complete Blood Count",
      sharedWith: "Dr. Sarah Johnson",
      shareDate: "2024-01-12",
      accessType: "otp",
      expiresAt: "2024-01-19",
      accessCount: 2,
      isActive: true
    },
    {
      id: "2",
      documentName: "ECG Report",
      sharedWith: "Dr. Michael Chen",
      shareDate: "2024-01-10",
      accessType: "qr",
      expiresAt: "2024-01-17",
      accessCount: 1,
      isActive: true
    }
  ];

  const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(otp);
    toast({
      title: "OTP Generated",
      description: `Share this code: ${otp} (Valid for 24 hours)`,
    });
  };

  const generateShareLink = () => {
    const link = `https://nextgenmedical.com/share/${Math.random().toString(36).substring(7)}`;
    setShareLink(link);
    toast({
      title: "Share Link Generated",
      description: "Secure link created with 7-day expiry.",
    });
  };

  const generateQRCode = () => {
    // In real app, generate actual QR code
    setQrCode("QR_CODE_DATA_HERE");
    toast({
      title: "QR Code Generated",
      description: "QR code created for instant access.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Code copied successfully!",
    });
  };

  const revokeAccess = (recordId: string) => {
    toast({
      title: "Access Revoked",
      description: "Document access has been revoked successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Share Medical Records</h2>
        <p className="text-muted-foreground">
          Securely share your medical documents with healthcare professionals
        </p>
      </div>

      {/* Share New Document */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="mr-2 h-5 w-5" />
            Share Document
          </CardTitle>
          <CardDescription>
            Choose how you want to share your medical records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Document Selection */}
          <div>
            <Label htmlFor="document">Select Document to Share</Label>
            <select className="w-full mt-1 px-3 py-2 border rounded-md">
              <option value="">Choose a document...</option>
              <option value="blood-test">Blood Test Report - Complete Blood Count</option>
              <option value="ecg">ECG Report</option>
              <option value="xray">X-Ray Chest</option>
              <option value="prescription">Prescription - Cardiac Medication</option>
            </select>
          </div>

          {/* Share Method Selection */}
          <div>
            <Label>Sharing Method</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <Card 
                className={`cursor-pointer transition-colors ${shareMethod === "otp" ? "border-patient bg-patient/5" : ""}`}
                onClick={() => setShareMethod("otp")}
              >
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-patient" />
                  <h4 className="font-medium">OTP Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Share via secure OTP code
                  </p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-colors ${shareMethod === "qr" ? "border-patient bg-patient/5" : ""}`}
                onClick={() => setShareMethod("qr")}
              >
                <CardContent className="p-4 text-center">
                  <QrCode className="h-8 w-8 mx-auto mb-2 text-patient" />
                  <h4 className="font-medium">QR Code</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate QR for instant access
                  </p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-colors ${shareMethod === "link" ? "border-patient bg-patient/5" : ""}`}
                onClick={() => setShareMethod("link")}
              >
                <CardContent className="p-4 text-center">
                  <Copy className="h-8 w-8 mx-auto mb-2 text-patient" />
                  <h4 className="font-medium">Secure Link</h4>
                  <p className="text-sm text-muted-foreground">
                    Share via encrypted link
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sharing Options */}
          <div>
            <Label htmlFor="doctor">Share With (Doctor/Hospital)</Label>
            <Input
              id="doctor"
              placeholder="Enter doctor name or hospital"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Access Expires In</Label>
              <select className="w-full mt-1 px-3 py-2 border rounded-md">
                <option value="24h">24 Hours</option>
                <option value="3d">3 Days</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
              </select>
            </div>
            <div>
              <Label htmlFor="access-limit">Max Access Count</Label>
              <select className="w-full mt-1 px-3 py-2 border rounded-md">
                <option value="1">1 Time</option>
                <option value="3">3 Times</option>
                <option value="5">5 Times</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
          </div>

          {/* Generate Share Code/Link */}
          <div className="space-y-4">
            {shareMethod === "otp" && (
              <div>
                <Button onClick={generateOTP} variant="patient" className="w-full">
                  <Shield className="mr-2 h-4 w-4" />
                  Generate OTP Code
                </Button>
                {otpCode && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">OTP Code:</p>
                        <p className="text-2xl font-mono text-patient">{otpCode}</p>
                        <p className="text-sm text-muted-foreground">Valid for 24 hours</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(otpCode)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {shareMethod === "qr" && (
              <div>
                <Button onClick={generateQRCode} variant="patient" className="w-full">
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Code
                </Button>
                {qrCode && (
                  <div className="mt-4 p-4 bg-muted rounded-lg text-center">
                    <div className="w-32 h-32 bg-white border mx-auto mb-2 flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scan this QR code to access the document
                    </p>
                  </div>
                )}
              </div>
            )}

            {shareMethod === "link" && (
              <div>
                <Button onClick={generateShareLink} variant="patient" className="w-full">
                  <Copy className="mr-2 h-4 w-4" />
                  Generate Secure Link
                </Button>
                {shareLink && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">Secure Link:</p>
                        <p className="text-sm text-muted-foreground break-all">{shareLink}</p>
                        <p className="text-sm text-muted-foreground">Expires in 7 days</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(shareLink)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Shares */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Active Shares
          </CardTitle>
          <CardDescription>
            Manage your currently shared documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sharedRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{record.documentName}</h4>
                  <p className="text-sm text-muted-foreground">
                    Shared with {record.sharedWith} on {new Date(record.shareDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {record.accessType.toUpperCase()} Access
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      <Clock className="inline h-3 w-3 mr-1" />
                      Expires: {new Date(record.expiresAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Accessed: {record.accessCount} times
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {record.isActive ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Expired</Badge>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => revokeAccess(record.id)}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))}

            {sharedRecords.length === 0 && (
              <div className="text-center py-8">
                <Share2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Active Shares</h3>
                <p className="text-muted-foreground">
                  Documents you share will appear here.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordSharing;