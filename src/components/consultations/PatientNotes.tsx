import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Calendar, 
  User, 
  Heart, 
  Activity,
  Thermometer,
  Weight,
  Ruler,
  Plus,
  Save,
  Share
} from "lucide-react";
import { format } from "date-fns";

interface PatientNotesProps {
  patientId: string;
  appointmentId: string;
  patientName: string;
}

const PatientNotes = ({ patientId, appointmentId, patientName }: PatientNotesProps) => {
  const [currentNotes, setCurrentNotes] = useState({
    chiefComplaint: "",
    historyOfPresentIllness: "",
    physicalExamination: "",
    assessment: "",
    plan: "",
    vitals: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      weight: "",
      height: "",
      oxygenSaturation: ""
    },
    followUpDate: "",
    followUpInstructions: ""
  });

  const [previousNotes] = useState([
    {
      id: "1",
      date: "2024-01-10",
      doctor: "Dr. Smith",
      chiefComplaint: "Chest pain and shortness of breath",
      assessment: "Possible angina, recommend cardiac workup",
      plan: "ECG, Echo, Blood tests",
      followUp: "1 week"
    },
    {
      id: "2",
      date: "2024-01-05",
      doctor: "Dr. Johnson",
      chiefComplaint: "Routine checkup",
      assessment: "Overall good health, mild hypertension",
      plan: "Continue current medication, lifestyle modifications",
      followUp: "3 months"
    }
  ]);

  const handleVitalChange = (vital: string, value: string) => {
    setCurrentNotes({
      ...currentNotes,
      vitals: {
        ...currentNotes.vitals,
        [vital]: value
      }
    });
  };

  const handleSaveNotes = () => {
    console.log("Saving patient notes:", currentNotes);
    // Here you would save to your backend/database
  };

  const handleShareNotes = () => {
    console.log("Sharing notes with patient");
    // Here you would implement sharing functionality
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
                <span>Patient Notes</span>
              </CardTitle>
              <p className="text-muted-foreground">
                Patient: {patientName} • Appointment: {appointmentId} • Date: {format(new Date(), "PPP")}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleShareNotes}>
                <Share className="h-4 w-4 mr-2" />
                Share with Patient
              </Button>
              <Button onClick={handleSaveNotes}>
                <Save className="h-4 w-4 mr-2" />
                Save Notes
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">Current Consultation</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="previous">Previous Notes</TabsTrigger>
        </TabsList>

        {/* Current Consultation Notes */}
        <TabsContent value="current">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consultation Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="chief-complaint">Chief Complaint</Label>
                  <Textarea
                    id="chief-complaint"
                    placeholder="Primary reason for visit..."
                    value={currentNotes.chiefComplaint}
                    onChange={(e) => setCurrentNotes({...currentNotes, chiefComplaint: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="history-illness">History of Present Illness</Label>
                  <Textarea
                    id="history-illness"
                    placeholder="Detailed history of current symptoms..."
                    value={currentNotes.historyOfPresentIllness}
                    onChange={(e) => setCurrentNotes({...currentNotes, historyOfPresentIllness: e.target.value})}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="physical-exam">Physical Examination</Label>
                  <Textarea
                    id="physical-exam"
                    placeholder="Physical examination findings..."
                    value={currentNotes.physicalExamination}
                    onChange={(e) => setCurrentNotes({...currentNotes, physicalExamination: e.target.value})}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="assessment">Assessment & Diagnosis</Label>
                  <Textarea
                    id="assessment"
                    placeholder="Clinical assessment and diagnosis..."
                    value={currentNotes.assessment}
                    onChange={(e) => setCurrentNotes({...currentNotes, assessment: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="plan">Treatment Plan</Label>
                  <Textarea
                    id="plan"
                    placeholder="Treatment plan, medications, and recommendations..."
                    value={currentNotes.plan}
                    onChange={(e) => setCurrentNotes({...currentNotes, plan: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="follow-up-date">Follow-up Date</Label>
                    <Input
                      id="follow-up-date"
                      type="date"
                      value={currentNotes.followUpDate}
                      onChange={(e) => setCurrentNotes({...currentNotes, followUpDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="follow-up-instructions">Follow-up Instructions</Label>
                    <Input
                      id="follow-up-instructions"
                      placeholder="Special instructions for follow-up"
                      value={currentNotes.followUpInstructions}
                      onChange={(e) => setCurrentNotes({...currentNotes, followUpInstructions: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vital Signs */}
        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Vital Signs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Blood Pressure</span>
                  </Label>
                  <Input
                    placeholder="120/80 mmHg"
                    value={currentNotes.vitals.bloodPressure}
                    onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span>Heart Rate</span>
                  </Label>
                  <Input
                    placeholder="72 bpm"
                    value={currentNotes.vitals.heartRate}
                    onChange={(e) => handleVitalChange('heartRate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span>Temperature</span>
                  </Label>
                  <Input
                    placeholder="98.6°F"
                    value={currentNotes.vitals.temperature}
                    onChange={(e) => handleVitalChange('temperature', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Weight className="h-4 w-4 text-blue-500" />
                    <span>Weight</span>
                  </Label>
                  <Input
                    placeholder="70 kg"
                    value={currentNotes.vitals.weight}
                    onChange={(e) => handleVitalChange('weight', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Ruler className="h-4 w-4 text-purple-500" />
                    <span>Height</span>
                  </Label>
                  <Input
                    placeholder="170 cm"
                    value={currentNotes.vitals.height}
                    onChange={(e) => handleVitalChange('height', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-cyan-500" />
                    <span>Oxygen Saturation</span>
                  </Label>
                  <Input
                    placeholder="98%"
                    value={currentNotes.vitals.oxygenSaturation}
                    onChange={(e) => handleVitalChange('oxygenSaturation', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Allergies</Label>
                    <Textarea placeholder="Known allergies..." rows={3} />
                  </div>
                  <div>
                    <Label>Current Medications</Label>
                    <Textarea placeholder="Current medications..." rows={3} />
                  </div>
                  <div>
                    <Label>Past Medical History</Label>
                    <Textarea placeholder="Previous medical conditions..." rows={3} />
                  </div>
                  <div>
                    <Label>Family History</Label>
                    <Textarea placeholder="Relevant family medical history..." rows={3} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Previous Notes */}
        <TabsContent value="previous">
          <div className="space-y-4">
            {previousNotes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <CardTitle className="text-lg">{format(new Date(note.date), "PPP")}</CardTitle>
                        <p className="text-sm text-muted-foreground">Dr. {note.doctor}</p>
                      </div>
                    </div>
                    <Badge variant="outline">Previous</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Chief Complaint:</p>
                      <p className="text-sm">{note.chiefComplaint}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Assessment:</p>
                      <p className="text-sm">{note.assessment}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Plan:</p>
                      <p className="text-sm">{note.plan}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Follow-up:</p>
                      <p className="text-sm">{note.followUp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientNotes;