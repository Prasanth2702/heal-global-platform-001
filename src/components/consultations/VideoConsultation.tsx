import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Camera,
  Monitor,
  Users,
  MessageSquare,
  FileText,
  UserPlus
} from "lucide-react";

interface VideoConsultationProps {
  appointmentId: string;
  patientName: string;
  consultationType: "one-on-one" | "three-way";
}

const VideoConsultation = ({ 
  appointmentId, 
  patientName, 
  consultationType 
}: VideoConsultationProps) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, sender: string, message: string, time: string}>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [consultationNotes, setConsultationNotes] = useState("");

  // Mock participants for 3-way consultation
  const participants = [
    { id: "doctor", name: "Dr. Smith", role: "Primary Doctor", isActive: true },
    { id: "patient", name: patientName, role: "Patient", isActive: true },
    ...(consultationType === "three-way" ? [
      { id: "specialist", name: "Dr. Johnson (Specialist)", role: "Consulting Specialist", isActive: true }
    ] : [])
  ];

  const startCall = () => {
    setIsCallActive(true);
    // Here you would integrate with Video SDK
    console.log("Starting video call with Video SDK");
  };

  const endCall = () => {
    setIsCallActive(false);
    // Here you would end the Video SDK session
    console.log("Ending video call");
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    // Video SDK toggle video
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    // Video SDK toggle audio
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // Video SDK screen sharing
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: "Dr. Smith",
        message: newMessage,
        time: new Date().toLocaleTimeString()
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage("");
    }
  };

  const inviteSpecialist = () => {
    // Logic to invite additional specialist to the call
    console.log("Inviting specialist to consultation");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>{consultationType === "three-way" ? "3-Way" : "Video"} Consultation</span>
              </CardTitle>
              <p className="text-muted-foreground">
                Appointment ID: {appointmentId} • Patient: {patientName}
              </p>
            </div>
            <Badge variant={isCallActive ? "default" : "secondary"}>
              {isCallActive ? "Live" : "Ready to Start"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Video Section */}
        <div className="xl:col-span-3 space-y-4">
          {/* Main Video Area */}
          <Card className="relative">
            <CardContent className="p-0">
              <div className="relative bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                {isCallActive ? (
                  <div className="text-white text-center">
                    <Video className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">Video call is active</p>
                    <p className="text-sm text-gray-300">Video SDK integration will display video streams here</p>
                  </div>
                ) : (
                  <div className="text-white text-center">
                    <VideoOff className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">Ready to start consultation</p>
                    <Button onClick={startCall} className="mt-4">
                      Start Video Call
                    </Button>
                  </div>
                )}
                
                {/* Participants overlay for 3-way calls */}
                {isCallActive && consultationType === "three-way" && (
                  <div className="absolute top-4 right-4 space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {participant.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Video Controls */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="lg"
                  onClick={toggleVideo}
                  disabled={!isCallActive}
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant={isAudioOn ? "default" : "destructive"}
                  size="lg"
                  onClick={toggleAudio}
                  disabled={!isCallActive}
                >
                  {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>

                <Button
                  variant={isScreenSharing ? "secondary" : "outline"}
                  size="lg"
                  onClick={toggleScreenShare}
                  disabled={!isCallActive}
                >
                  <Monitor className="h-5 w-5" />
                </Button>

                {consultationType === "three-way" && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={inviteSpecialist}
                    disabled={!isCallActive}
                  >
                    <UserPlus className="h-5 w-5" />
                  </Button>
                )}

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={endCall}
                  disabled={!isCallActive}
                >
                  {isCallActive ? <PhoneOff className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Participants ({participants.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="text-sm font-medium">{participant.name}</p>
                    <p className="text-xs text-muted-foreground">{participant.role}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${participant.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chat */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Chat</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="text-sm">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <span className="font-medium">{msg.sender}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="mt-1">{msg.message}</p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button size="sm" onClick={sendMessage}>Send</Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Consultation Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add consultation notes..."
                value={consultationNotes}
                onChange={(e) => setConsultationNotes(e.target.value)}
                rows={4}
              />
              <Button size="sm" className="mt-2 w-full">Save Notes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;