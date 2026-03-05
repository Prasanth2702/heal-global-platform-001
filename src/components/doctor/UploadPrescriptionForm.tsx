// components/UploadPrescriptionForm.tsx

import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

interface UploadPrescriptionFormProps {
  patientId: string;
  appointmentId: string;
  doctorId?: string; // optional now
  depertmentId?: string; // optional for doctor uploads
  uploadedBy: "doctor" | "patient"| "department";
  defaultDocumentType?: string;
  title?: string;
   onCancel?: () => void;
}


export default function UploadPrescriptionForm({
  patientId,
  appointmentId,
  doctorId,
  depertmentId,
  uploadedBy,
 defaultDocumentType="medical_record",
  title = "Upload Document",
  onCancel = () => {},
}: UploadPrescriptionFormProps) {

  const [files, setFiles] = useState<File[]>([]);
const [documentType, setDocumentType] = useState<string>(
  defaultDocumentType
);
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
const [patientConsent, setPatientConsent] = useState<"yes" | "no" | null>("yes");
const isUploadDisabled =
  isUploading ||
  files.length === 0 ||
  (uploadedBy === "patient"   && patientConsent !== "yes");


  

  const EDGE_FUNCTION_URL =
    'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/upload-prescriptions';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (files.length === 0) {
    setStatus("error");
    setMessage("Please select at least one file");
    return;
  }

  setIsUploading(true);
  setStatus("idle");
  setMessage("");

  const { data: sessionData } = await supabase.auth.getSession();
  const accessToken = sessionData.session?.access_token;

  if (!accessToken) {
    setIsUploading(false);
    setStatus("error");
    setMessage("Authentication required");
    return;
  }

  const formData = new FormData();
        // ✅ REQUIRED BY ZOD
formData.append("appointment_id", appointmentId);
if (patientId) formData.append("patient_id", patientId);

// if (uploadedBy === "doctor" && doctorId) {
//   formData.append("uploaded_by", doctorId);
// }

// if (uploadedBy === "patient" && patientId) {
//   formData.append("uploaded_by", patientId);
// }
// if (uploadedBy === "department" && depertmentId) {
//   formData.append("uploaded_by", depertmentId);
// }
// In the handleSubmit function, change this part:

if (uploadedBy === "doctor" && doctorId) {
  formData.append("uploaded_by", doctorId);
} else if (uploadedBy === "patient" && patientId) {
  formData.append("uploaded_by", patientId);
} else if (uploadedBy === "department" && depertmentId) {
  // Make sure depertmentId is actually the user's ID, not the department ID
  formData.append("uploaded_by", depertmentId); // This should be the user's UUID
}
 // doctorId OR patientId
formData.append("document_type", documentType);  // ✅ REQUIRED BY ZOD



  if (description) formData.append("description", description);
  if (tags)
    formData.append(
      "tags",
      JSON.stringify(tags.split(",").map((t) => t.trim()))
    );

  files.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Upload failed");
    }

    setStatus("success");
    setMessage(`Uploaded ${result.uploaded_documents.length} document(s)`);

    setFiles([]);
    setDescription("");
    setTags("");
  } catch (err: any) {
    setStatus("error");
    setMessage(err.message);
  } finally {
    setIsUploading(false);
  }
  
};


  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <FileText className="w-8 h-8 text-emerald-600" />
        Upload Prescription / Document
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Type
          </label>
          {uploadedBy === "doctor" ? (
            <input type="text" value="Prescription" readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /> ):(
          <select
  value={documentType}
  onChange={(e) => setDocumentType(e.target.value)}
  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
  required
>
  <option value="prescription">Prescription</option>
  <option value="medical_record">Medical Record</option>
  <option value="lab_report">Lab Report</option>
  <option value="image">Image</option>
  <option value="insurance">Insurance</option>
  <option value="id_proof">ID Proof</option>
</select>

            )}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Files (PDF, Images, etc.)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <input
              type="file"
              multiple
              accept=".pdf,image/*,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-emerald-600 font-medium hover:text-emerald-700"
            >
              Click to browse or drag & drop files here
            </label>
          </div>

          {/* Selected Files List */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Selected files:</p>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
                >
                  <span className="text-sm text-gray-800 truncate max-w-xs">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="e.g., Follow-up medication for hypertension..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (Optional, comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., hypertension, antibiotics, follow-up"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Status Message */}
        {status !== 'idle' && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              status === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
            <p className="font-medium">{message}</p>
          </div>
        )}

          {/* PATIENT CONSENT */}
{uploadedBy === "patient" && (
  <div className="rounded-lg border bg-amber-50 p-4 space-y-3">
    <p className="text-sm font-medium text-gray-800">
      Do you agree to share these documents with your booked doctor?
    </p>

    <div className="flex gap-6">
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="radio"
          name="patient-consent"
          value="yes"
          checked={patientConsent === "yes"}
          onChange={() => setPatientConsent("yes")}
          disabled={isUploading}
        />
        Yes, I agree 
      </label>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="radio"
          name="patient-consent"
          value="no"
          checked={patientConsent === "no"}
          onChange={() => setPatientConsent("no")}
          disabled={isUploading}
        />
        No, I do not agree
      </label>

   
    </div>

    {/* {patientConsent !== "yes" && (
      <p className="text-xs text-red-600">
        You must agree to share documents to proceed with upload.
      </p>
    )} */}
  </div>
)}
{uploadedBy === "doctor" && doctorId && (
   <div className="rounded-lg border bg-amber-50 p-4 space-y-3">
    <p className="text-sm font-medium text-gray-800">
      Do you agree to share these documents with your Patient?
    </p>

    <div className="flex gap-6">
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="radio"
          name="patient-consent"
          value="yes"
          checked={patientConsent === "yes"}
          onChange={() => setPatientConsent("yes")}
          disabled={isUploading}
        />
        Yes, I agree 
      </label>

   
    </div>
    </div>
)}
{uploadedBy === "department" && depertmentId && (
   <div className="rounded-lg border bg-amber-50 p-4 space-y-3">
    <p className="text-sm font-medium text-gray-800">
      Do you agree to share these documents with your Patient?
    </p>

    <div className="flex gap-6">
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="radio"
          name="patient-consent"
          value="yes"
          checked={patientConsent === "yes"}
          onChange={() => setPatientConsent("yes")}
          disabled={isUploading}
        />
        Yes, I agree 
      </label>

   
    </div>
    </div>
)}
  

        {/* Submit Button */}
    <div className="flex gap-4">
  <button
    type="button"
    onClick={onCancel}
    className="w-full py-3 px-6 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100"
  >
    Cancel
  </button>

  <button
    type="submit"
    disabled={isUploadDisabled}
    className={`w-full py-3 px-6 rounded-lg font-semibold text-white flex items-center justify-center gap-3 transition
      ${
        isUploadDisabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-emerald-600 hover:bg-emerald-700'
      }`}
  >
    {isUploading ? (
      <>
        <Loader2 className="w-5 h-5 animate-spin" />
        Uploading...
      </>
    ) : (
      <>
        <Upload className="w-5 h-5" />
        Upload Documents
      </>
    )}
  </button>
</div>


      </form>
      
    </div>
  );
}