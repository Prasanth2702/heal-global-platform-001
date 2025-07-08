import DashboardLayout from "@/components/layouts/DashboardLayout";
import SecureDocumentViewer from "@/components/vault/SecureDocumentViewer";

const SecureViewPage = () => {
  // In a real app, these would come from URL params or secure tokens
  const viewerProps = {
    documentId: "doc-123",
    documentName: "Blood Test Report - Jan 2024.pdf",
    accessToken: "secure-token-abc123",
    allowDownload: false, // Preview only
    screenshotProtection: true,
    timeRemaining: 1380 // 23 hours in minutes
  };

  return (
    <SecureDocumentViewer {...viewerProps} />
  );
};

export default SecureViewPage;