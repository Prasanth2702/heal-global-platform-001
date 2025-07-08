import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Clock, 
  Calendar,
  Send,
  Settings,
  Users,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format, addDays, addHours } from "date-fns";

const AppointmentReminders = () => {
  const [reminderSettings, setReminderSettings] = useState({
    emailEnabled: true,
    smsEnabled: true,
    reminderTimes: {
      days: 1,
      hours: 2,
      minutes: 30
    },
    autoReminders: true
  });

  const [upcomingReminders] = useState([
    {
      id: "1",
      patientName: "John Doe",
      appointmentDate: addDays(new Date(), 1),
      reminderType: "24-hour",
      method: "email-sms",
      status: "scheduled",
      phone: "+91 9876543210",
      email: "john@example.com"
    },
    {
      id: "2",
      patientName: "Jane Smith",
      appointmentDate: addHours(new Date(), 2),
      reminderType: "2-hour",
      method: "sms",
      status: "sent",
      phone: "+91 9876543211",
      email: "jane@example.com"
    },
    {
      id: "3",
      patientName: "Mike Wilson",
      appointmentDate: addDays(new Date(), 3),
      reminderType: "72-hour",
      method: "email",
      status: "scheduled",
      phone: "+91 9876543212",
      email: "mike@example.com"
    }
  ]);

  const [customMessage, setCustomMessage] = useState({
    subject: "Appointment Reminder",
    emailTemplate: "Dear {patientName}, this is a reminder for your appointment on {date} at {time} with Dr. {doctorName}. Please arrive 15 minutes early.",
    smsTemplate: "Reminder: Appointment on {date} at {time} with Dr. {doctorName}. Location: {clinic}. Call {phone} to reschedule."
  });

  const sendManualReminder = (reminderId: string) => {
    console.log("Sending manual reminder:", reminderId);
    // Here you would integrate with SMS/Email service
  };

  const sendBulkReminders = () => {
    console.log("Sending bulk reminders");
    // Here you would send reminders to all scheduled patients
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "email":
        return <Mail className="h-3 w-3" />;
      case "sms":
        return <MessageSquare className="h-3 w-3" />;
      case "email-sms":
        return (
          <div className="flex space-x-1">
            <Mail className="h-3 w-3" />
            <MessageSquare className="h-3 w-3" />
          </div>
        );
      default:
        return <Bell className="h-3 w-3" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Appointment Reminders</span>
              </CardTitle>
              <p className="text-muted-foreground">
                Automated SMS and email reminders for patients
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={sendBulkReminders}>
                <Send className="h-4 w-4 mr-2" />
                Send Bulk Reminders
              </Button>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Reminders</TabsTrigger>
          <TabsTrigger value="settings">Reminder Settings</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
          <TabsTrigger value="history">Reminder History</TabsTrigger>
        </TabsList>

        {/* Upcoming Reminders */}
        <TabsContent value="upcoming">
          <div className="grid gap-4">
            {upcomingReminders.map((reminder) => (
              <Card key={reminder.id}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(reminder.status)}
                        <div>
                          <p className="font-medium">{reminder.patientName}</p>
                          <p className="text-sm text-muted-foreground">
                            Appointment: {format(reminder.appointmentDate, "PPP p")}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="flex items-center space-x-1">
                          {getMethodIcon(reminder.method)}
                          <span className="capitalize">{reminder.method}</span>
                        </Badge>
                        <Badge variant="secondary">{reminder.reminderType}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{reminder.phone}</p>
                        <p>{reminder.email}</p>
                      </div>
                      {reminder.status === "scheduled" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => sendManualReminder(reminder.id)}
                        >
                          Send Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reminder Settings */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable/Disable Reminders */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Automatic Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable automatic reminder sending
                    </p>
                  </div>
                  <Switch 
                    checked={reminderSettings.autoReminders}
                    onCheckedChange={(checked) => setReminderSettings({
                      ...reminderSettings, 
                      autoReminders: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Email Reminders</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminders via email
                    </p>
                  </div>
                  <Switch 
                    checked={reminderSettings.emailEnabled}
                    onCheckedChange={(checked) => setReminderSettings({
                      ...reminderSettings, 
                      emailEnabled: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>SMS Reminders</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminders via SMS
                    </p>
                  </div>
                  <Switch 
                    checked={reminderSettings.smsEnabled}
                    onCheckedChange={(checked) => setReminderSettings({
                      ...reminderSettings, 
                      smsEnabled: checked
                    })}
                  />
                </div>
              </div>

              {/* Reminder Timing */}
              <div className="space-y-4">
                <Label className="text-base">Reminder Schedule</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="days-before">Days Before</Label>
                    <Select value={reminderSettings.reminderTimes.days.toString()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="2">2 Days</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="7">1 Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hours-before">Hours Before</Label>
                    <Select value={reminderSettings.reminderTimes.hours.toString()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Hour</SelectItem>
                        <SelectItem value="2">2 Hours</SelectItem>
                        <SelectItem value="4">4 Hours</SelectItem>
                        <SelectItem value="24">24 Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="minutes-before">Minutes Before</Label>
                    <Select value={reminderSettings.reminderTimes.minutes.toString()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 Minutes</SelectItem>
                        <SelectItem value="30">30 Minutes</SelectItem>
                        <SelectItem value="60">1 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Service Configuration */}
              <div className="space-y-4">
                <Label className="text-base">Service Configuration</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email-service">Email Service</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select email service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="ses">Amazon SES</SelectItem>
                        <SelectItem value="smtp">Custom SMTP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sms-service">SMS Service</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select SMS service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="msg91">MSG91</SelectItem>
                        <SelectItem value="textlocal">TextLocal</SelectItem>
                        <SelectItem value="gupshup">Gupshup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button className="w-full">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Message Templates */}
        <TabsContent value="templates">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Email Template</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    value={customMessage.subject}
                    onChange={(e) => setCustomMessage({
                      ...customMessage, 
                      subject: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="email-template">Email Message</Label>
                  <textarea
                    id="email-template"
                    className="w-full h-32 p-3 border rounded-md"
                    value={customMessage.emailTemplate}
                    onChange={(e) => setCustomMessage({
                      ...customMessage, 
                      emailTemplate: e.target.value
                    })}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Available variables:</strong></p>
                  <p>{"{patientName}, {date}, {time}, {doctorName}, {clinic}, {phone}"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>SMS Template</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sms-template">SMS Message</Label>
                  <textarea
                    id="sms-template"
                    className="w-full h-32 p-3 border rounded-md"
                    value={customMessage.smsTemplate}
                    onChange={(e) => setCustomMessage({
                      ...customMessage, 
                      smsTemplate: e.target.value
                    })}
                    maxLength={160}
                  />
                  <p className="text-sm text-muted-foreground">
                    {customMessage.smsTemplate.length}/160 characters
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Available variables:</strong></p>
                  <p>{"{patientName}, {date}, {time}, {doctorName}, {clinic}, {phone}"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-6">
            <Button>Save Templates</Button>
          </div>
        </TabsContent>

        {/* Reminder History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Reminder History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <p>Reminder history and analytics will be displayed here</p>
                <p className="text-sm">Track delivery rates, open rates, and response rates</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentReminders;