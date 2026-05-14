// PatientChatHistory.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Calendar,
  User,
  Clock,
  ChevronRight,
  Loader2,
  Bot,
} from "lucide-react";

interface Session {
  id: number;
  session_id: string;
  user_id: string;
  user_type: string;
  user_email: string | null;
  user_name: string | null;
  stage: string;
  clinical_data: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  last_activity: string;
}

interface Message {
  id: number;
  session_id: string;
  user_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata: any;
  created_at: string;
}

export default function PatientChatHistory() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Fetch all sessions for the logged-in patient
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          navigate("/login/patient");
          return;
        }

        const { data, error } = await supabase
          .from("medical_conversation_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }); // most recent first

        if (error) throw error;
        setSessions(data || []);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [navigate]);

  // Fetch messages when a session is selected
  const fetchMessages = async (sessionId: string) => {
    setLoadingMessages(true);
    try {
      const { data, error } = await supabase
        .from("medical_conversation_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true }); // oldest first for chat

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    fetchMessages(session.session_id);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy • h:mm a");
  };

  const formatShortDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const getStageBadge = (stage: string) => {
    const stages: Record<string, string> = {
      "symptom-collection": "Symptoms",
      assessment: "Assessment",
      treatment: "Treatment",
      completed: "Completed",
    };
    return stages[stage] || stage;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Helper to strip markdown formatting
const cleanMarkdown = (text: string) => {
  let cleaned = text;
  // Remove bold/italic markers
  cleaned = cleaned.replace(/\*\*/g, '');
  cleaned = cleaned.replace(/\*/g, '');
  // Remove heading hashes (lines starting with #)
  cleaned = cleaned.replace(/^#+\s*/gm, '');
  // Replace bullet list `- ` with a simple bullet • 
  cleaned = cleaned.replace(/^-\s+/gm, '• ');
  // Collapse excessive newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned;
};

  if (sessions.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle>No Conversations Yet</CardTitle>
          <CardDescription>
            Your medical chat history will appear here once you start a conversation.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
        💬 Medical Chat History
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sessions List - Sidebar */}
        <div className="lg:w-1/3 w-full">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5" />
                Your Conversations
              </CardTitle>
              <CardDescription className="text-blue-100">
                {sessions.length} session{sessions.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-280px)]">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSessionClick(session)}
                    className={`p-4 border-b cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedSession?.id === session.id
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {session.user_name || "Patient"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatShortDate(session.created_at)}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {getStageBadge(session.stage)}
                          </Badge>
                          {session.is_active && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last activity: {formatShortDate(session.last_activity)}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Chat Messages Area */}
        <div className="lg:w-2/3 w-full">
          {selectedSession ? (
            <Card className="border-0 shadow-lg h-full flex flex-col">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      Medical Assistant
                    </CardTitle>
                    <CardDescription className="text-blue-100 mt-1">
                      Session started: {formatDate(selectedSession.created_at)}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={selectedSession.is_active ? "default" : "secondary"}
                    className="bg-white/20 text-white"
                  >
                    {selectedSession.is_active ? "Active" : "Completed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No messages in this conversation.
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-280px)] p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              msg.role === "user"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <div className="text-sm whitespace-pre-wrap">
                              {msg.role === "assistant" ? cleanMarkdown(msg.content) : msg.content}
                            </div>
                            <div
                              className={`text-xs mt-1 ${
                                msg.role === "user"
                                  ? "text-blue-100"
                                  : "text-gray-400"
                              }`}
                            >
                              {formatDate(msg.created_at)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-lg h-full flex items-center justify-center p-8">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-700">
                  Select a conversation
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Choose a chat from the list to view the full conversation.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}