// components/UploadPrescriptionForm.tsx

import React, { useEffect, useState } from 'react';
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
  const [uploadStep, setUploadStep] = useState< 1 | 2 | 3>(1); 
    const autoCloseTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');
const [patientConsent, setPatientConsent] = useState<"yes" | "no" | null>("yes");
const [storageUsage, setStorageUsage] = useState<any | null>(null);
const [storageLoading, setStorageLoading] = useState(false);

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

  // Sync isUploading with uploadStep
useEffect(() => {
  setIsUploading(uploadStep !== 1);
}, [uploadStep]);

// Cleanup timeout on unmount
useEffect(() => {
  return () => {
    if (autoCloseTimeout.current) clearTimeout(autoCloseTimeout.current);
  };
}, []);


// ============================
// ADD THIS FUNCTION
// ============================
const fetchStorageUsage = async () => {
  try {
    setStorageLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (!accessToken) return;

    // owner id based on uploader
    let ownerId = "";

    if (uploadedBy === "doctor" && doctorId) {
      ownerId = doctorId;
    } else if (uploadedBy === "patient" && patientId) {
      ownerId = patientId;
    } else if (uploadedBy === "department" && depertmentId) {
      ownerId = depertmentId;
    }

    if (!ownerId) return;

    const response = await fetch(
      `https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/calculate-storage-usage?owner_id=${ownerId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch storage usage");
    }

    setStorageUsage(result);
  } catch (err) {
    console.error("Storage usage error:", err);
  } finally {
    setStorageLoading(false);
  }
};

// ============================
// AUTO CALL EDGE FUNCTION
// ============================
useEffect(() => {
  fetchStorageUsage();
}, [uploadedBy, doctorId, patientId, depertmentId]);

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (files.length === 0) {
//     setStatus("error");
//     setMessage("Please select at least one file");
//     return;
//   }

//   setIsUploading(true);
//   setStatus("idle");
//   setMessage("");

//   const { data: sessionData } = await supabase.auth.getSession();
//   const accessToken = sessionData.session?.access_token;

//   if (!accessToken) {
//     setIsUploading(false);
//     setStatus("error");
//     setMessage("Authentication required");
//     return;
//   }

//   const formData = new FormData();
//         // ✅ REQUIRED BY ZOD
// formData.append("appointment_id", appointmentId);
// if (patientId) formData.append("patient_id", patientId);

// // if (uploadedBy === "doctor" && doctorId) {
// //   formData.append("uploaded_by", doctorId);
// // }

// // if (uploadedBy === "patient" && patientId) {
// //   formData.append("uploaded_by", patientId);
// // }
// // if (uploadedBy === "department" && depertmentId) {
// //   formData.append("uploaded_by", depertmentId);
// // }
// // In the handleSubmit function, change this part:

// if (uploadedBy === "doctor" && doctorId) {
//   formData.append("uploaded_by", doctorId);
// } else if (uploadedBy === "patient" && patientId) {
//   formData.append("uploaded_by", patientId);
// } else if (uploadedBy === "department" && depertmentId) {
//   // Make sure depertmentId is actually the user's ID, not the department ID
//   formData.append("uploaded_by", depertmentId); // This should be the user's UUID
// }
//  // doctorId OR patientId
// formData.append("document_type", documentType);  // ✅ REQUIRED BY ZOD



//   if (description) formData.append("description", description);
//   if (tags)
//     formData.append(
//       "tags",
//       JSON.stringify(tags.split(",").map((t) => t.trim()))
//     );

//   files.forEach((file) => {
//     formData.append("files", file);
//   });

//   try {
//     const response = await fetch(EDGE_FUNCTION_URL, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: formData,
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.error || "Upload failed");
//     }

//     setStatus("success");
//     setMessage(`Uploaded ${result.uploaded_documents.length} document(s)`);

//     setFiles([]);
//     setDescription("");
//     setTags("");
//   } catch (err: any) {
//     setStatus("error");
//     setMessage(err.message);
//   } finally {
//     setIsUploading(false);
//   }
  
// };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (files.length === 0) {
    setStatus("error");
    setMessage("Please select at least one file");
    return;
  }
 setUploadStep(1);
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

  // Handle uploaded_by based on role
  if (uploadedBy === "doctor" && doctorId) {
    formData.append("uploaded_by", doctorId);
  } else if (uploadedBy === "patient" && patientId) {
    formData.append("uploaded_by", patientId);
  } else if (uploadedBy === "department" && depertmentId) {
    formData.append("uploaded_by", depertmentId);
  }
  
  formData.append("document_type", documentType);
  if (description) formData.append("description", description);
  if (tags) {
    formData.append(
      "tags",
      JSON.stringify(tags.split(",").map((t) => t.trim()))
    );
  }

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

    // ✅ SUCCESSFUL UPLOAD - Now trigger document indexing for each uploaded document
    const uploadedDocuments = result.uploaded_documents || [];
    setUploadStep(2); 
    if (uploadedDocuments.length > 0) {
      // Trigger indexing for each document
      const indexingPromises = uploadedDocuments.map(async (doc: any) => {
        try {
          const indexingResponse = await fetch(
            'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/process-document',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                document_id: doc.id,
                force_reindex: false
              }),
            }
          );
          
          const indexingResult = await indexingResponse.json();
          
          if (!indexingResponse.ok) {
            console.error(`Failed to index document ${doc.id}:`, indexingResult);
            return { success: false, docId: doc.id, error: indexingResult };
          }
          
          return { success: true, docId: doc.id };
        } catch (err) {
          console.error(`Error indexing document ${doc.id}:`, err);
          return { success: false, docId: doc.id, error: err };
        }
      });
      
      // Wait for all indexing requests to complete (don't block user experience)
      const indexingResults = await Promise.allSettled(indexingPromises);
      
      const failedIndexing = indexingResults.filter(
        result => result.status === 'rejected' || 
        (result.status === 'fulfilled' && !result.value.success)
      );
      
      if (failedIndexing.length > 0) {
        console.warn(`${failedIndexing.length} document(s) failed to index`);
        // Optional: Show partial success message
        setStatus("success");
        setMessage(
          `Uploaded ${uploadedDocuments.length} document(s). ` +
          `${uploadedDocuments.length - failedIndexing.length} document(s) indexed successfully. ` +
          `Failed to index ${failedIndexing.length} document(s).`
        );
            setIsUploading(false);

      } else {
        setStatus("success");
        setMessage(`Uploaded and indexed ${uploadedDocuments.length} document(s)`);
            setIsUploading(false);

      }
    } else {
      setStatus("success");
      setMessage(`Uploaded ${result.uploaded_documents.length} document(s)`);
          setIsUploading(false);

    }
     setUploadStep(3);
     // Auto cancel after 3 seconds
    if (autoCloseTimeout.current) clearTimeout(autoCloseTimeout.current);
    autoCloseTimeout.current = setTimeout(() => {
      onCancel();
    }, 3000);

    // Clear form
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

const renderStepContent = () => {
  // STEP 1 → FORM
  if (!uploadStep || uploadStep === 1) {
    return (
<form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Type
          </label>
          {/* {uploadedBy === "doctor" ? ( */}
            {/* <input type="text" value="Prescription" readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /> ):( */}
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

            {/* )} */}
        </div>

         {storageUsage && (
    <div
      className={`
        min-w-[260px]
        rounded-xl
        border
        p-4
        shadow-sm
        transition-all
        ${
          storageUsage.is_exceeded
            ? "bg-red-50 border-red-200"
            : storageUsage.utilization_percentage > 80
            ? "bg-yellow-50 border-yellow-200"
            : "bg-emerald-50 border-emerald-200"
        }
      `}
    >
      <div className="flex justify-between items-center text-xs mb-2">
        <span className="font-semibold text-gray-700">
          Storage Usage
        </span>

        <span
          className={`
            font-bold
            ${
              storageUsage.is_exceeded
                ? "text-red-600"
                : storageUsage.utilization_percentage > 80
                ? "text-yellow-700"
                : "text-emerald-700"
            }
          `}
        >
          {storageUsage.total_mb.toFixed(1)} Mb /
          {" "}
          {storageUsage.storage_limit_mb} Mb
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`
            h-full transition-all duration-500
            ${
              storageUsage.is_exceeded
                ? "bg-red-500"
                : storageUsage.utilization_percentage > 80
                ? "bg-yellow-500"
                : "bg-emerald-500"
            }
          `}
          style={{
            width: `${Math.min(
              storageUsage.utilization_percentage,
              100
            )}%`,
          }}
        />
      </div>

      <div className="flex justify-between items-center mt-2 text-[11px] text-gray-600">
        <span>
          {storageUsage.utilization_percentage.toFixed(0)}% used
        </span>

        <span>
          {storageUsage.remaining_mb.toFixed(1)} Mb free
        </span>
      </div>

      {/* STATUS MESSAGE */}
      <div className="mt-2">
        {storageUsage.is_exceeded ? (
          <div className="bg-red-100 text-red-700 text-[11px] px-2 py-1 rounded-md font-medium">
            ⚠ Storage limit exceeded
          </div>
        ) : storageUsage.utilization_percentage > 80 ? (
          <div className="bg-yellow-100 text-yellow-700 text-[11px] px-2 py-1 rounded-md font-medium">
            ⚠ Storage almost full
          </div>
        ) : (
          <div className="bg-emerald-100 text-emerald-700 text-[11px] px-2 py-1 rounded-md font-medium">
            ✓ Storage available
          </div>
        )}
      </div>
    </div>
  )}

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


      </form>);}

  // STEP 2 → LOADING (INDEXING)
  if (uploadStep === 2) {
    return (
      <div className="text-center py-10">
        <Loader2 className="w-12 h-12 text-emerald-600 mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-medium text-gray-700">
          Indexing documents...
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          Please wait, processing your files...
        </p>
      </div>
    );
  }

  // STEP 3 → SUCCESS / ERROR
  if (uploadStep === 3) {
    return (
      <div className="flex justify-center">
        {status !== "idle" && (
          <div
            className={`p-5 rounded-xl flex items-center gap-3 shadow-md
              ${
                status === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
          >
            {status === "success" ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
            <p className="font-medium">{message}</p>
          </div>
        )}
      </div>
    );
  }
};
  
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <FileText className="w-8 h-8 text-emerald-600" />
        Upload Prescription / Document
      </h2>

       <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
            ${uploadStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <span className={uploadStep >= 1 ? 'text-emerald-700' : 'text-gray-500'}>Upload</span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-200 mx-2">
          <div className={`h-0.5 bg-emerald-600 transition-all duration-300 ${uploadStep >= 2 ? 'w-full' : 'w-0'}`} />
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
            ${uploadStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <span className={uploadStep >= 2 ? 'text-emerald-700' : 'text-gray-500'}>Index</span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-200 mx-2">
          <div className={`h-0.5 bg-emerald-600 transition-all duration-300 ${uploadStep >= 3 ? 'w-full' : 'w-0'}`} />
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
            ${uploadStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            3
          </div>
          <span className={uploadStep >= 3 ? 'text-emerald-700' : 'text-gray-500'}>Done</span>
        </div>
      </div>
{renderStepContent()}
      
    </div>
  );
}
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Document Type */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Document Type
//           </label>
//           {/* {uploadedBy === "doctor" ? ( */}
//             {/* <input type="text" value="Prescription" readOnly className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /> ):( */}
//           <select
//   value={documentType}
//   onChange={(e) => setDocumentType(e.target.value)}
//   className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//   required
// >
//   <option value="prescription">Prescription</option>
//   <option value="medical_record">Medical Record</option>
//   <option value="lab_report">Lab Report</option>
//   <option value="image">Image</option>
//   <option value="insurance">Insurance</option>
//   <option value="id_proof">ID Proof</option>
// </select>

//             {/* )} */}
//         </div>

//         {/* File Upload */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Select Files (PDF, Images, etc.)
//           </label>
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-500 transition">
//             <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <input
//               type="file"
//               multiple
//               accept=".pdf,image/*,.doc,.docx"
//               onChange={handleFileChange}
//               className="hidden"
//               id="file-upload"
//             />
//             <label
//               htmlFor="file-upload"
//               className="cursor-pointer text-emerald-600 font-medium hover:text-emerald-700"
//             >
//               Click to browse or drag & drop files here
//             </label>
//           </div>

//           {/* Selected Files List */}
//           {files.length > 0 && (
//             <div className="mt-4 space-y-2">
//               <p className="text-sm font-medium text-gray-700">Selected files:</p>
//               {files.map((file, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
//                 >
//                   <span className="text-sm text-gray-800 truncate max-w-xs">
//                     {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => removeFile(index)}
//                     className="text-red-600 hover:text-red-800 text-sm"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Description */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Description (Optional)
//           </label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             rows={3}
//             placeholder="e.g., Follow-up medication for hypertension..."
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//           />
//         </div>

//         {/* Tags */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Tags (Optional, comma-separated)
//           </label>
//           <input
//             type="text"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//             placeholder="e.g., hypertension, antibiotics, follow-up"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
//           />
//         </div>

//         {/* Status Message */}
//         {status !== 'idle' && (
//           <div
//             className={`p-4 rounded-lg flex items-center gap-3 ${
//               status === 'success'
//                 ? 'bg-green-50 text-green-800 border border-green-200'
//                 : 'bg-red-50 text-red-800 border border-red-200'
//             }`}
//           >
//             {status === 'success' ? (
//               <CheckCircle2 className="w-6 h-6" />
//             ) : (
//               <AlertCircle className="w-6 h-6" />
//             )}
//             <p className="font-medium">{message}</p>
//           </div>
//         )}

//           {/* PATIENT CONSENT */}
// {uploadedBy === "patient" && (
//   <div className="rounded-lg border bg-amber-50 p-4 space-y-3">
//     <p className="text-sm font-medium text-gray-800">
//       Do you agree to share these documents with your booked doctor?
//     </p>

//     <div className="flex gap-6">
//       <label className="flex items-center gap-2 text-sm cursor-pointer">
//         <input
//           type="radio"
//           name="patient-consent"
//           value="yes"
//           checked={patientConsent === "yes"}
//           onChange={() => setPatientConsent("yes")}
//           disabled={isUploading}
//         />
//         Yes, I agree 
//       </label>
//       <label className="flex items-center gap-2 text-sm cursor-pointer">
//         <input
//           type="radio"
//           name="patient-consent"
//           value="no"
//           checked={patientConsent === "no"}
//           onChange={() => setPatientConsent("no")}
//           disabled={isUploading}
//         />
//         No, I do not agree
//       </label>

   
//     </div>

//     {/* {patientConsent !== "yes" && (
//       <p className="text-xs text-red-600">
//         You must agree to share documents to proceed with upload.
//       </p>
//     )} */}
//   </div>
// )}
// {uploadedBy === "doctor" && doctorId && (
//    <div className="rounded-lg border bg-amber-50 p-4 space-y-3">
//     <p className="text-sm font-medium text-gray-800">
//       Do you agree to share these documents with your Patient?
//     </p>

//     <div className="flex gap-6">
//       <label className="flex items-center gap-2 text-sm cursor-pointer">
//         <input
//           type="radio"
//           name="patient-consent"
//           value="yes"
//           checked={patientConsent === "yes"}
//           onChange={() => setPatientConsent("yes")}
//           disabled={isUploading}
//         />
//         Yes, I agree 
//       </label>

   
//     </div>
//     </div>
// )}
// {uploadedBy === "department" && depertmentId && (
//    <div className="rounded-lg border bg-amber-50 p-4 space-y-3">
//     <p className="text-sm font-medium text-gray-800">
//       Do you agree to share these documents with your Patient?
//     </p>

//     <div className="flex gap-6">
//       <label className="flex items-center gap-2 text-sm cursor-pointer">
//         <input
//           type="radio"
//           name="patient-consent"
//           value="yes"
//           checked={patientConsent === "yes"}
//           onChange={() => setPatientConsent("yes")}
//           disabled={isUploading}
//         />
//         Yes, I agree 
//       </label>

   
//     </div>
//     </div>
// )}
  

//         {/* Submit Button */}
//     <div className="flex gap-4">
//   <button
//     type="button"
//     onClick={onCancel}
//     className="w-full py-3 px-6 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100"
//   >
//     Cancel
//   </button>

//   <button
//     type="submit"
//     disabled={isUploadDisabled}
//     className={`w-full py-3 px-6 rounded-lg font-semibold text-white flex items-center justify-center gap-3 transition
//       ${
//         isUploadDisabled
//           ? 'bg-gray-400 cursor-not-allowed'
//           : 'bg-emerald-600 hover:bg-emerald-700'
//       }`}
//   >
//     {isUploading ? (
//       <>
//         <Loader2 className="w-5 h-5 animate-spin" />
//         Uploading...
//       </>
//     ) : (
//       <>
//         <Upload className="w-5 h-5" />
//         Upload Documents
//       </>
//     )}
//   </button>
// </div>


//       </form>