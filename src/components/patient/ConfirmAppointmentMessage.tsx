import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ConfirmAppointmentMessage({
  doctorName,
  date,
  startTime,
  endTime,
  onConfirm,
  onCancel
}) {
  return (
    <Card className="border border-gray-300 shadow-sm p-4">
      <CardContent>
        <h2 className="text-lg font-semibold mb-3">Confirm Appointmen</h2>

        {/* Fixed Values – NOT Editable */}
        <div className="space-y-2 mb-4">
          <p><strong>Doctor:</strong> {doctorName}</p>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Time:</strong> {startTime} - {endTime}</p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>

          <Button className="bg-blue-600 text-white" onClick={onConfirm}>
            Confirm Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
  