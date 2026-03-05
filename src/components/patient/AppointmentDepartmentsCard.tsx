// ========================================
// AppointmentDepartmentsCard.tsx - Department Appointment Card
// Patient Department Appointment Card Component
// ========================================

import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Clock, FileText, User, Upload, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import UploadPrescriptionForm from "@/components/doctor/UploadPrescriptionForm";
import AppointmentDocumentsModal from "@/components/doctor/AppointmentDocumentsModal";
import { Button } from "@/components/ui/button";

// Define the DepartmentAppointment interface
interface DepartmentAppointment {
  id: string;
  departmentId: string;
  departmentName: string;
  departmentDescription?: string;
  facilityName: string;
  facilityId: string;
  date: string;
  time: string;
  type: "teleconsultation" | "in_person";
  status: "confirmed" | "cancelled" | "completed";
  location: string;
  consultationFee: number | null;
  slotStartTime: string;
  slotEndTime: string;
  isPast: boolean;
  cancellationReason?: string | null;
  notes?: string | null;
  chiefComplaint?: string | null;
  completedAt?: string | null;
  documents?: {
    id: string;
    name: string;
    file_path: string;
    mime_type: string;
    created_at: string;
    uploaded_by: string;
    uploader_role: string;
  }[];
}

interface Props {
  appointment: DepartmentAppointment;
  userRole: "patient" | "doctor" | "department"; // Add department role
}

export default function AppointmentDepartmentsCard({
  appointment,
  userRole,
}: Props) {
  console.log("Rendering AppointmentDepartmentsCard for:", appointment);
  const [userId, setUserId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFullNotes, setShowFullNotes] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    loadUser();
  }, []);

  // Determine if appointment is upcoming
  const isUpcoming = appointment.status === "confirmed" && !appointment.isPast;

  // Get status badge color
  const getStatusBadge = () => {
    switch(appointment.status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div
      className={`
        relative rounded-xl p-5 space-y-4 shadow transition mt-4
        border-l-4
        ${
          appointment.status === "cancelled"
            ? "border-red-500 bg-red-50"
            : "border-blue-500 bg-blue-50"
        }
      `}
    >
      {/* Department Details */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <Building2 size={24} />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold">{appointment.departmentName}</h3>
          <p className="text-sm text-gray-500">{appointment.facilityName}</p>
          {appointment.departmentDescription && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-1">
              {appointment.departmentDescription}
            </p>
          )}
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge()}`}
        >
          {appointment.status.toUpperCase()}
        </span>
    
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700`}
        >
          Hospital Appointments
        </span>
    
      </div>

      {/* Date & Time */}
      <div className="flex items-center gap-4 text-sm">
        <Calendar size={16} />
        <span>{appointment.date}</span>
        <Clock size={16} />
        <span>{appointment.time}</span>
      </div>

      {/* Chief Complaint (if available) */}
      {appointment.chiefComplaint && (
        <div className="bg-gray-50 p-3 rounded text-sm">
          <span className="font-medium">Chief Complaint:</span>{" "}
          {appointment.chiefComplaint}
        </div>
      )}

      {/* Consultation Type */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
          ${
            appointment.type === "teleconsultation"
              ? "bg-purple-100 text-purple-700"
              : "bg-indigo-100 text-indigo-700"
          }`}
      >
        {appointment.type === "teleconsultation" ? (
          <>
            <MapPin size={14} />
            Online Department Consultation
          </>
        ) : (
          <>
            <MapPin size={14} />
            In-Person at {appointment.facilityName}
          </>
        )}
      </div>

      {/* Documents Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDocsModal(true)}
        className="mt-2 flex items-center gap-1 text-blue-600 hover:bg-blue-50"
      >
        <FileText className="h-4 w-4" />
        <span className="text-sm">Documents</span>
      </Button>

      {/* Documents Modal */}
      <AppointmentDocumentsModal
        open={showDocsModal}
        onClose={() => setShowDocsModal(false)}
        appointmentId={appointment.id}
        role="patient"
      />

      {/* Cancellation Reason */}
      {appointment.status === "cancelled" && appointment.cancellationReason && (
        <div className="bg-red-50 rounded-lg p-4 space-y-2">
          <p className="text-sm text-red-600 leading-relaxed">
            <span className="font-medium">Cancellation Reason:</span>{" "}
            {appointment.cancellationReason}
          </p>
        </div>
      )}

      {/* Patient Notes */}
      {appointment.notes && (
        <div className="border border-blue-100 bg-blue-50 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
              <FileText size={14} />
              Patient Notes
            </div>

            {appointment.notes.length > 100 && (
              <button
                onClick={() => setShowFullNotes(!showFullNotes)}
                className="text-xs text-blue-600 hover:underline"
              >
                {showFullNotes ? "Hide" : "View"}
              </button>
            )}
          </div>

          <p
            className={`text-sm text-blue-800 ${
              showFullNotes ? "" : "line-clamp-2"
            }`}
          >
            {appointment.notes}
          </p>
        </div>
      )}

      {/* Completed At (for past appointments) */}
      {appointment.isPast && appointment.completedAt && (
        <div className="text-xs text-gray-500">
          Completed on: {new Date(appointment.completedAt).toLocaleString()}
        </div>
      )}

      {/* Documents Section */}
      {appointment.documents && appointment.documents.length > 0 && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/40 p-4 max-h-48 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-blue-700 font-semibold">
              <FileText size={16} />
              <span>Documents</span>
            </div>

            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {appointment.documents.length}
            </span>
          </div>

          {/* File List */}
          <div className="space-y-2">
            {appointment.documents.map((doc) => (
              <button
                key={doc.id}
                onClick={async () => {
                  const { data, error } = await supabase.storage
                    .from("patient_files")
                    .createSignedUrl(doc.file_path, 300);

                  if (data?.signedUrl) {
                    window.open(data.signedUrl, "_blank");
                  }
                }}
                className="
                  group w-full rounded-lg border bg-white p-3
                  flex items-center justify-between
                  hover:border-blue-400 hover:shadow-sm
                  transition-all
                "
              >
                {/* Left */}
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-blue-100 p-2 text-blue-700">
                    <FileText size={18} />
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded by {doc.uploader_role} on{" "}
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <span className="text-xs font-medium text-blue-600">
                  View
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PATIENT DOCUMENT UPLOAD – UPCOMING ONLY */}
      {userRole === "patient" &&
        appointment.status === "confirmed" &&
        !appointment.isPast && (
        <>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <Upload size={16} />
            Upload Medical Document
          </button>

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
              <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl relative">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold">Upload Document</h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                  <UploadPrescriptionForm
                    patientId={userId!}
                    appointmentId={appointment.id}
                    uploadedBy="patient"
                    defaultDocumentType="medical_record"
                    title="Upload Medical Document"
                    onCancel={() => setShowUploadModal(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}