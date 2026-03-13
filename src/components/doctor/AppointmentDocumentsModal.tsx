import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import mixpanelInstance from "@/utils/mixpanel";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  appointmentId: string;
  role: "patient" | "doctor";
}

export default function AppointmentDocumentsModal({
  open,
  onClose,
  appointmentId,
  role,
}: Props) {
  const [activeTab, setActiveTab] = useState<"patient" | "doctor">("patient");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // Fetch documents when modal opens
  // ---------------------------
  useEffect(() => {
    if (!open) return;

    const loadDocs = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("appointment_id", appointmentId)
        .order("created_at", { ascending: false });

      if (!error) setDocuments(data ?? []);
      setLoading(false);
    };

    loadDocs();
  }, [open, appointmentId]);

  if (!open) return null;

  // ---------------------------
  // Split documents
  // ---------------------------
 const patientDocs = documents.filter(
  (d) => d.uploaded_by === d.owner_id
);

const doctorDocs = documents.filter(
  (d) => d.uploaded_by !== d.owner_id
);


  const activeDocs = activeTab === "patient" ? patientDocs : doctorDocs;

  // ---------------------------
  // Document Item
  // ---------------------------
  const DocumentItem = ({ doc }: { doc: any }) => {
    const handleView = async () => {
      const { data, error } = await supabase.storage
        .from("patient_files")
        .createSignedUrl(doc.file_path, 60);

      if (error || !data?.signedUrl) {
        toast.error("Failed to open document");
        return;
      }

      window.open(data.signedUrl, "_blank");
    };

    return (
      <div className="flex items-center justify-between border rounded-lg px-3 py-2 bg-gray-50">
        <span className="text-sm truncate max-w-[220px]">
          {doc.name}
        </span>

        <button
          onClick={handleView}
          className="text-sm text-emerald-600 hover:underline"
        >
          View
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText size={18} />
            Appointment Documents
          </h3>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4">
          <button
            onClick={() => setActiveTab("patient")}
            className={`px-4 py-2 rounded-md text-sm font-medium
              ${
                activeTab === "patient"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {role === "patient" ? "Uploaded by Me" : "Uploaded By Patient"}
          </button>

          <button
            onClick={() => setActiveTab("doctor")}
            className={`px-4 py-2 rounded-md text-sm font-medium
              ${
                activeTab === "doctor"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {role === "patient" ? "Uploaded by Doctor" : "Uploaded By Me"}
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-2">
          {loading ? (
            <p className="text-sm text-gray-400 italic">Loading documents...</p>
          ) : activeDocs.length === 0 ? (
            <p className="text-sm text-gray-400 italic">
              No documents available
            </p>
          ) : (
            activeDocs.map((doc) => (
              <DocumentItem key={doc.id} doc={doc} />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {/* Mixpanel tracking for Close button */}
          <Button
            variant="outline"
            onClick={() => {
              mixpanelInstance.track("Appointment Documents Modal Closed", {
                appointmentId,
                role,
                documentCount: documents.length
              });
              onClose();
            }}
          >
            Close (Track)
          </Button>
        </div>
      </div>
    </div>
  );
}
