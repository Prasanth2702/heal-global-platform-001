// MyDocuments.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Image,
  File,
  Download,
  Trash2,
  Share2,
  Loader2,
  Eye,
} from "lucide-react";
import { Progress } from "../ui/progress";

// Type matching the documents table
interface Document {
  id: string;
  owner_id: string;
  uploaded_by: string | null;
  appointment_id: string | null;
  medical_record_id: string | null;
  name: string;
  type: 'medical_record' | 'prescription' | 'lab_report' | 'image' | 'insurance' | 'id_proof' | 'other';
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  description: string | null;
  tags: any;
  is_shared: boolean;
  shared_with: any;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

// Helper: format file size
const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return "N/A";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
};

// Helper: get file icon based on type/mime
const getFileIcon = (doc: Document) => {
  const mime = doc.mime_type || "";
  if (mime.startsWith("image/")) return <Image className="h-5 w-5 text-blue-500" />;
  if (mime === "application/pdf") return <FileText className="h-5 w-5 text-red-500" />;
  switch (doc.type) {
    case "prescription":
      return <FileText className="h-5 w-5 text-green-600" />;
    case "medical_record":
      return <FileText className="h-5 w-5 text-purple-500" />;
    case "lab_report":
      return <FileText className="h-5 w-5 text-orange-500" />;
    case "insurance":
      return <File className="h-5 w-5 text-blue-600" />;
    case "id_proof":
      return <File className="h-5 w-5 text-gray-700" />;
    default:
      return <File className="h-5 w-5 text-gray-500" />;
  }
};

export default function MyDocuments() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
const [storageUsage, setStorageUsage] = useState<{
  total_gb: number;
  storage_limit_gb: number;
  utilization_percentage: number;
  remaining_gb: number;
  is_exceeded: boolean;
  file_count: number;
  loading: boolean;
  error: string | null;
  storage_limit_mb:number;
}>({
  total_gb: 0,
  storage_limit_gb: 0,
  utilization_percentage: 0,
  remaining_gb: 0,
  is_exceeded: false,
  file_count: 0,
  loading: false,
  error: null,
  storage_limit_mb:0,
});

const [currentPage, setCurrentPage] = useState(1);
const documentsPerPage = 10;

useEffect(() => {
  const fetchStorageUsage = async () => {
    try {
      // Get logged in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.id) return;

      // Loading state
      setStorageUsage((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      // Get session token
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error("No access token");
      }

      // Call edge function
      const response = await fetch(
        `https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/calculate-storage-usage?owner_id=${user.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Update state
      setStorageUsage({
        ...data,
        loading: false,
        error: null,
      });

    } catch (err: any) {
      console.error("Storage usage error:", err);

      setStorageUsage((prev) => ({
        ...prev,
        loading: false,
        error: err.message || "Could not load storage info",
      }));
    }
  };

  fetchStorageUsage();
}, []);

  // Fetch documents where owner_id = current user
  const fetchDocuments = async () => {
    setLoading(true);
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your documents.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("owner_id", user.id)
      .eq("is_deleted", false)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Could not load your documents.",
        variant: "destructive",
      });
    } else {
      setDocuments(data || []);
    }
    setLoading(false);
  };
  


  // Real-time subscription for changes to documents owned by the user
  useEffect(() => {
    fetchDocuments();

    let channel: any;
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel("my-documents")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "documents",
            filter: `owner_id=eq.${user.id}`,
          },
          () => fetchDocuments()
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // Handle document download
  const handleDownload = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from("patient_files")
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `Downloading ${doc.name}`,
      });
    } catch (err) {
      console.error("Download error:", err);
      toast({
        title: "Download failed",
        description: "Could not download the file.",
        variant: "destructive",
      });
    }
  };

  // Handle delete (soft delete)
  const handleDelete = async (doc: Document) => {
    if (!confirm(`Are you sure you want to delete "${doc.name}"?`)) return;

    const { error } = await supabase
      .from("documents")
      .update({ is_deleted: true, updated_at: new Date().toISOString() })
      .eq("id", doc.id);

    if (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Document deleted",
        description: `${doc.name} has been removed.`,
      });
      fetchDocuments(); // refresh list
    }
  };

  // Filter documents by type
  const filteredDocuments = documents.filter((doc) => {
    if (activeTab === "all") return true;
    return doc.type === activeTab;
  });

   // Pagination Logic
const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);

const startIndex = (currentPage - 1) * documentsPerPage;
const endIndex = startIndex + documentsPerPage;

const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);


  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Empty state
  if (documents.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle>No Documents Found</CardTitle>
            <CardDescription>
              You haven't uploaded any documents yet. When you upload documents
              (e.g., prescriptions, reports), they will appear here.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">My Documents</h1>
        {/* <Button onClick={() => navigate("/upload-document")}>
          <FileText className="mr-2 h-4 w-4" /> Upload Document
        </Button> */}
      </div>

                        {/* Storage Usage Indicator */}
<div className="hidden md:block mb-4">
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 min-w-[200px]">
    {storageUsage.loading ? (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <span className="text-xs text-gray-500">Loading storage...</span>
      </div>
    ) : storageUsage.error ? (
      <div className="text-xs text-red-500">⚠️ {storageUsage.error}</div>
    ) : (
      <>
        <>
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 shadow-sm">
    
    {/* Header */}
    <div className="flex justify-between items-center text-xs mb-2">
      <span className="font-semibold text-blue-900">
        Storage Utilization
      </span>

      <span
        className={`font-medium px-2 py-1 rounded-md ${
          storageUsage.is_exceeded
            ? "bg-red-100 text-red-700"
            : storageUsage.utilization_percentage > 80
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {storageUsage.total_gb.toFixed(1)} Mb /{" "}
        {storageUsage.storage_limit_mb} Mb
      </span>
    </div>

    {/* Progress */}
    <div className="bg-white rounded-full p-[2px]">
      <Progress
        value={storageUsage.utilization_percentage}
        className="h-2 bg-gray-100"
        indicatorClassName={
          storageUsage.utilization_percentage > 90
            ? "bg-red-500"
            : storageUsage.utilization_percentage > 70
            ? "bg-yellow-500"
            : "bg-green-500"
        }
      />
    </div>

    {/* Footer */}
    <div className="flex justify-between items-center text-[11px] mt-2">
      <span className="text-gray-600 font-medium">
        {storageUsage.utilization_percentage.toFixed(0)}% used
      </span>

      <span className="text-green-700 font-medium">
        {storageUsage.remaining_gb.toFixed(1)} Mb free
      </span>
    </div>

    {/* Warning */}
    {storageUsage.is_exceeded && (
      <div className="mt-2 bg-red-50 border border-red-200 text-red-700 text-[11px] px-2 py-1 rounded-md">
        ⚠️ Storage limit exceeded. Please remove unused files or upgrade storage.
      </div>
    )}
  </div>
</>
      </>
    )}
  </div>
</div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => {
    setActiveTab(value);
    setCurrentPage(1);
  }}>
       <TabsList className="mb-6 flex flex-wrap gap-2 bg-transparent">
  {[
    { value: "all", label: "All", color: "bg-gray-100 text-gray-700 data-[state=active]:bg-gray-700 data-[state=active]:text-white" },
    { value: "medical_record", label: "Medical Records", color: "bg-blue-100 text-blue-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white" },
    { value: "prescription", label: "Prescriptions", color: "bg-green-100 text-green-700 data-[state=active]:bg-green-600 data-[state=active]:text-white" },
    { value: "lab_report", label: "Lab Reports", color: "bg-purple-100 text-purple-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white" },
    { value: "image", label: "Images", color: "bg-pink-100 text-pink-700 data-[state=active]:bg-pink-600 data-[state=active]:text-white" },
    { value: "insurance", label: "Insurance", color: "bg-amber-100 text-amber-700 data-[state=active]:bg-amber-600 data-[state=active]:text-white" },
    { value: "id_proof", label: "ID Proof", color: "bg-indigo-100 text-indigo-700 data-[state=active]:bg-indigo-600 data-[state=active]:text-white" },
    { value: "other", label: "Other", color: "bg-gray-100 text-gray-700 data-[state=active]:bg-gray-600 data-[state=active]:text-white" },
  ].map((tab) => (
    <TabsTrigger
      key={tab.value}
      value={tab.value}
      className={`px-4 py-2 rounded-lg transition-all duration-200 ${tab.color}`}
    >
      {tab.label}
    </TabsTrigger>
  ))}
</TabsList>

        <TabsContent value={activeTab}>
          {/* Desktop & Tablet: Table layout */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getFileIcon(doc)}
                        <span>{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.type.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                    <TableCell>
                      {doc.updated_at
                        ? new Date(doc.updated_at).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          const { data } = await supabase.storage
                            .from("patient_files")
                            .createSignedUrl(doc.file_path, 60);
                          if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        disabled
                      >
                        <Share2 className="h-4 w-4" />
                      </Button> */}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Pagination */}
              </TableBody>
            </Table>
            <div className="mb-3">
{totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
    
    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
    >
      Previous
    </Button>

    {Array.from({ length: totalPages }).map((_, index) => (
      <Button
        key={index}
        size="sm"
        variant={currentPage === index + 1 ? "default" : "outline"}
        onClick={() => setCurrentPage(index + 1)}
        className={
          currentPage === index + 1
            ? "bg-blue-600 text-white"
            : ""
        }
      >
        {index + 1}
      </Button>
    ))}

    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((prev) => prev + 1)}
    >
      Next
    </Button>
  </div>
)}
</div>
          </div>

          {/* Mobile: Card layout */}
          <div className="md:hidden space-y-4">
           {paginatedDocuments.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc)}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type.replace('_', ' ')} • {formatFileSize(doc.file_size)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploaded: {new Date(doc.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          const { data } = await supabase.storage
                            .from("patient_files")
                            .createSignedUrl(doc.file_path, 60);
                          if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  {doc.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {doc.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
            {/* Pagination */}
{totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
    
    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
    >
      Previous
    </Button>

    {Array.from({ length: totalPages }).map((_, index) => (
      <Button
        key={index}
        size="sm"
        variant={currentPage === index + 1 ? "default" : "outline"}
        onClick={() => setCurrentPage(index + 1)}
        className={
          currentPage === index + 1
            ? "bg-blue-600 text-white"
            : ""
        }
      >
        {index + 1}
      </Button>
    ))}

    <Button
      variant="outline"
      size="sm"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((prev) => prev + 1)}
    >
      Next
    </Button>
  </div>
)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}