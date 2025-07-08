import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Send, 
  User,
  Calendar,
  Stethoscope,
  Pill,
  Clock,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  type: "tablet" | "syrup" | "injection" | "cream" | "drops";
}

interface PrescriptionGeneratorProps {
  patientId: string;
  patientName: string;
  doctorName: string;
  appointmentId: string;
}

const PrescriptionGenerator = ({ 
  patientId, 
  patientName, 
  doctorName, 
  appointmentId 
}: PrescriptionGeneratorProps) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [currentMedication, setCurrentMedication] = useState<Partial<Medication>>({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    type: "tablet"
  });

  const [prescriptionDetails, setPrescriptionDetails] = useState({
    diagnosis: "",
    symptoms: "",
    advice: "",
    followUpDate: "",
    restrictions: "",
    emergencyInstructions: ""
  });

  const [tests, setTests] = useState<Array<{id: string, name: string, type: string, urgent: boolean}>>([]);
  const [referrals, setReferrals] = useState<Array<{id: string, department: string, doctor: string, reason: string, urgent: boolean}>>([]);

  const addMedication = () => {
    if (currentMedication.name && currentMedication.dosage) {
      const newMedication: Medication = {
        id: Date.now().toString(),
        name: currentMedication.name || "",
        dosage: currentMedication.dosage || "",
        frequency: currentMedication.frequency || "",
        duration: currentMedication.duration || "",
        instructions: currentMedication.instructions || "",
        type: currentMedication.type as "tablet" | "syrup" | "injection" | "cream" | "drops" || "tablet"
      };
      setMedications([...medications, newMedication]);
      setCurrentMedication({
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
        type: "tablet"
      });
    }
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const addTest = () => {
    const newTest = {
      id: Date.now().toString(),
      name: "Blood Test",
      type: "Laboratory",
      urgent: false
    };
    setTests([...tests, newTest]);
  };

  const addReferral = () => {
    const newReferral = {
      id: Date.now().toString(),
      department: "Cardiology",
      doctor: "Dr. Johnson",
      reason: "Further evaluation",
      urgent: false
    };
    setReferrals([...referrals, newReferral]);
  };

  const generatePDF = () => {
    console.log("Generating PDF prescription");
    // Here you would integrate with a PDF generation library
  };

  const sendToPatient = () => {
    console.log("Sending prescription to patient");
    // Here you would send the prescription via email/SMS
  };

  const getMedicationIcon = (type: string) => {
    switch (type) {
      case "syrup":
        return "🥄";
      case "injection":
        return "💉";
      case "cream":
        return "🧴";
      case "drops":
        return "💧";
      default:
        return "💊";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Digital Prescription</span>
              </CardTitle>
              <p className="text-muted-foreground">
                Patient: {patientName} • Dr. {doctorName} • {format(new Date(), "PPP")}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={generatePDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={sendToPatient}>
                <Send className="h-4 w-4 mr-2" />
                Send to Patient
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescription Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prescription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  placeholder="Primary diagnosis"
                  value={prescriptionDetails.diagnosis}
                  onChange={(e) => setPrescriptionDetails({...prescriptionDetails, diagnosis: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Current symptoms"
                  value={prescriptionDetails.symptoms}
                  onChange={(e) => setPrescriptionDetails({...prescriptionDetails, symptoms: e.target.value})}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="h-5 w-5" />
                <span>Medications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="med-name">Medication Name</Label>
                  <Input
                    id="med-name"
                    placeholder="e.g., Amoxicillin"
                    value={currentMedication.name}
                    onChange={(e) => setCurrentMedication({...currentMedication, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="med-type">Type</Label>
                  <Select 
                    value={currentMedication.type} 
                    onValueChange={(value) => setCurrentMedication({...currentMedication, type: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="syrup">Syrup</SelectItem>
                      <SelectItem value="injection">Injection</SelectItem>
                      <SelectItem value="cream">Cream</SelectItem>
                      <SelectItem value="drops">Drops</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="med-dosage">Dosage</Label>
                  <Input
                    id="med-dosage"
                    placeholder="e.g., 500mg"
                    value={currentMedication.dosage}
                    onChange={(e) => setCurrentMedication({...currentMedication, dosage: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="med-frequency">Frequency</Label>
                  <Select 
                    value={currentMedication.frequency} 
                    onValueChange={(value) => setCurrentMedication({...currentMedication, frequency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once-daily">Once daily</SelectItem>
                      <SelectItem value="twice-daily">Twice daily</SelectItem>
                      <SelectItem value="three-times-daily">Three times daily</SelectItem>
                      <SelectItem value="four-times-daily">Four times daily</SelectItem>
                      <SelectItem value="as-needed">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="med-duration">Duration</Label>
                  <Input
                    id="med-duration"
                    placeholder="e.g., 7 days"
                    value={currentMedication.duration}
                    onChange={(e) => setCurrentMedication({...currentMedication, duration: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="med-instructions">Instructions</Label>
                  <Input
                    id="med-instructions"
                    placeholder="e.g., After meals"
                    value={currentMedication.instructions}
                    onChange={(e) => setCurrentMedication({...currentMedication, instructions: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={addMedication} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>

              {/* Medications List */}
              {medications.length > 0 && (
                <div className="space-y-2">
                  <Separator />
                  <h4 className="font-medium">Prescribed Medications:</h4>
                  {medications.map((med) => (
                    <div key={med.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getMedicationIcon(med.type)}</span>
                        <div>
                          <p className="font-medium">{med.name} - {med.dosage}</p>
                          <p className="text-sm text-muted-foreground">
                            {med.frequency} for {med.duration} • {med.instructions}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(med.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tests and Referrals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recommended Tests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" onClick={addTest} className="w-full">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Test
                </Button>
                {tests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="text-sm font-medium">{test.name}</p>
                      <p className="text-xs text-muted-foreground">{test.type}</p>
                    </div>
                    {test.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Referrals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" onClick={addReferral} className="w-full">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Referral
                </Button>
                {referrals.map((referral) => (
                  <div key={referral.id} className="p-2 border rounded">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{referral.department}</p>
                      {referral.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{referral.doctor}</p>
                    <p className="text-xs">{referral.reason}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Additional Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="advice">General Advice</Label>
                <Textarea
                  id="advice"
                  placeholder="General health advice and lifestyle recommendations"
                  value={prescriptionDetails.advice}
                  onChange={(e) => setPrescriptionDetails({...prescriptionDetails, advice: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="follow-up">Follow-up Date</Label>
                  <Input
                    id="follow-up"
                    type="date"
                    value={prescriptionDetails.followUpDate}
                    onChange={(e) => setPrescriptionDetails({...prescriptionDetails, followUpDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="restrictions">Restrictions</Label>
                  <Input
                    id="restrictions"
                    placeholder="Activity or dietary restrictions"
                    value={prescriptionDetails.restrictions}
                    onChange={(e) => setPrescriptionDetails({...prescriptionDetails, restrictions: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="emergency">Emergency Instructions</Label>
                <Textarea
                  id="emergency"
                  placeholder="When to seek immediate medical attention"
                  value={prescriptionDetails.emergencyInstructions}
                  onChange={(e) => setPrescriptionDetails({...prescriptionDetails, emergencyInstructions: e.target.value})}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-sm">Prescription Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Doctor Info */}
              <div className="text-center border-b pb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Stethoscope className="h-4 w-4" />
                  <p className="font-medium">{doctorName}</p>
                </div>
                <p className="text-xs text-muted-foreground">Medical License: MD123456</p>
              </div>

              {/* Patient Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <p className="text-sm font-medium">{patientName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <p className="text-xs">{format(new Date(), "PPP")}</p>
                </div>
              </div>

              {/* Medications Summary */}
              {medications.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Medications ({medications.length}):</p>
                  {medications.map((med) => (
                    <div key={med.id} className="text-xs p-2 bg-accent rounded">
                      <p className="font-medium">{med.name}</p>
                      <p className="text-muted-foreground">{med.dosage}, {med.frequency}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tests Summary */}
              {tests.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tests ({tests.length}):</p>
                  {tests.map((test) => (
                    <div key={test.id} className="text-xs p-2 bg-accent rounded">
                      {test.name}
                    </div>
                  ))}
                </div>
              )}

              {/* Emergency Alert */}
              <div className="flex items-start space-x-2 p-2 bg-red-50 border border-red-200 rounded">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-red-700">Emergency Contact</p>
                  <p className="text-xs text-red-600">Call +91 1234567890 for emergencies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionGenerator;