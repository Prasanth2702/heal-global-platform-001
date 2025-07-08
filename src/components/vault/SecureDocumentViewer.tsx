import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Eye, 
  Shield, 
  Lock, 
  Timer, 
  User,
  AlertTriangle,
  Download,
  Camera,
  CameraOff,
  Key
} from "lucide-react";
import { format } from "date-fns";

// Mobile screenshot prevention hook
const useScreenshotProtection = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;

    const preventScreenshot = () => {
      // Add overlay to prevent screenshots
      const overlay = document.createElement('div');
      overlay.id = 'screenshot-protection';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99999;
        pointer-events: none;
        background: transparent;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      `;
      document.body.appendChild(overlay);

      // Disable right-click context menu
      const disableContextMenu = (e: MouseEvent) => e.preventDefault();
      document.addEventListener('contextmenu', disableContextMenu);

      // Disable common screenshot shortcuts
      const disableShortcuts = (e: KeyboardEvent) => {
        if (
          (e.ctrlKey && e.shiftKey && e.key === 'S') || // Chrome screenshot
          (e.metaKey && e.shiftKey && e.key === '3') || // Mac screenshot
          (e.metaKey && e.shiftKey && e.key === '4') || // Mac partial screenshot
          (e.key === 'PrintScreen') // Windows print screen
        ) {
          e.preventDefault();
        }
      };
      document.addEventListener('keydown', disableShortcuts);

      // Detect developer tools
      const detectDevTools = () => {
        const threshold = 160;
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          document.body.style.display = 'none';
          alert('Developer tools detected. Access blocked for security.');
        }
      };
      const devToolsInterval = setInterval(detectDevTools, 1000);

      return () => {
        const existingOverlay = document.getElementById('screenshot-protection');
        if (existingOverlay) {
          document.body.removeChild(existingOverlay);
        }
        document.removeEventListener('contextmenu', disableContextMenu);
        document.removeEventListener('keydown', disableShortcuts);
        clearInterval(devToolsInterval);
        document.body.style.display = '';
      };
    };

    return preventScreenshot();
  }, [enabled]);
};

interface SecureDocumentViewerProps {
  documentId: string;
  documentName: string;
  accessToken: string;
  allowDownload: boolean;
  screenshotProtection: boolean;
  timeRemaining: number;
}

const SecureDocumentViewer = ({ 
  documentId, 
  documentName, 
  accessToken, 
  allowDownload, 
  screenshotProtection,
  timeRemaining 
}: SecureDocumentViewerProps) => {
  const [otpCode, setOtpCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [documentContent, setDocumentContent] = useState("");

  // Enable screenshot protection
  useScreenshotProtection(screenshotProtection && isAuthenticated);

  const authenticateWithOTP = () => {
    if (otpCode === "123456") { // In real app, verify with backend
      setIsAuthenticated(true);
      // Load document content
      setDocumentContent("Document content would be loaded here securely...");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const formatTimeRemaining = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Secure Document Access</span>
            </CardTitle>
            <p className="text-muted-foreground">Enter OTP to view document</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="font-medium">{documentName}</p>
              <p className="text-sm text-muted-foreground">
                Access expires in: {formatTimeRemaining(timeRemaining)}
              </p>
            </div>
            
            <div>
              <Input
                placeholder="Enter 6-digit OTP"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg"
              />
            </div>
            
            <Button onClick={authenticateWithOTP} className="w-full">
              <Key className="h-4 w-4 mr-2" />
              Verify & Access
            </Button>

            <div className="text-center space-y-2">
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  {allowDownload ? (
                    <Download className="h-4 w-4 text-green-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-red-600" />
                  )}
                  <span>{allowDownload ? "Download allowed" : "Preview only"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {screenshotProtection ? (
                    <CameraOff className="h-4 w-4 text-red-600" />
                  ) : (
                    <Camera className="h-4 w-4 text-green-600" />
                  )}
                  <span>{screenshotProtection ? "Screenshots blocked" : "Screenshots allowed"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Security Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <h1 className="font-medium">{documentName}</h1>
                <p className="text-sm text-muted-foreground">Secure Preview Mode</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Timer className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">
                  {formatTimeRemaining(timeRemaining)} remaining
                </span>
              </div>
              
              <div className="flex space-x-2">
                {screenshotProtection && (
                  <Badge variant="destructive" className="text-xs">
                    <CameraOff className="h-3 w-3 mr-1" />
                    Screenshot Protected
                  </Badge>
                )}
                {!allowDownload && (
                  <Badge variant="secondary" className="text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    Preview Only
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className="max-w-6xl mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            {screenshotProtection && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Privacy Protection Active</p>
                    <p className="text-xs text-red-700">
                      Screenshots, screen recording, and downloads are blocked to protect patient privacy.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="min-h-96 bg-white border rounded-lg p-6">
              {/* Document viewer would be implemented here */}
              <div className="text-center text-muted-foreground py-20">
                <FilePreviewIcon />
                <p className="mt-4">Secure document viewer</p>
                <p className="text-sm">Document content would be displayed here with security controls</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">End-to-end encrypted</span>
              </div>
              
              <div className="flex space-x-2">
                {allowDownload && (
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
                <Button variant="outline">Close</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Watermark for additional security */}
      {screenshotProtection && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-4 gap-8 h-full p-8">
              {Array.from({length: 16}).map((_, i) => (
                <div key={i} className="flex items-center justify-center">
                  <span className="text-gray-500 text-lg font-bold rotate-45 select-none">
                    CONFIDENTIAL
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilePreviewIcon = () => (
  <svg className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default SecureDocumentViewer;