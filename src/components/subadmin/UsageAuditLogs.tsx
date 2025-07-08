import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, User, Clock, Shield, Search, Download } from "lucide-react";

const UsageAuditLogs = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const auditLogs = [
    {
      id: "1",
      user: "Dr. Smith",
      action: "Updated patient record",
      resource: "Patient ID: 12345",
      timestamp: "2024-01-15 10:30 AM",
      ipAddress: "192.168.1.100",
      status: "success",
      details: "Updated medical history for John Doe"
    },
    {
      id: "2",
      user: "Sub Admin",
      action: "Added new staff member",
      resource: "Staff Management",
      timestamp: "2024-01-15 09:15 AM",
      ipAddress: "192.168.1.105",
      status: "success",
      details: "Added Dr. Johnson to Cardiology department"
    },
    {
      id: "3",
      user: "Nurse Mary",
      action: "Failed login attempt",
      resource: "Authentication",
      timestamp: "2024-01-15 08:45 AM",
      ipAddress: "192.168.1.110",
      status: "failed",
      details: "Invalid credentials provided"
    },
    {
      id: "4",
      user: "Dr. Brown",
      action: "Viewed patient records",
      resource: "Patient Database",
      timestamp: "2024-01-15 08:20 AM",
      ipAddress: "192.168.1.102",
      status: "success",
      details: "Accessed 5 patient records for consultation"
    },
    {
      id: "5",
      user: "Sub Admin",
      action: "Modified bed allocation",
      resource: "Bed Management",
      timestamp: "2024-01-15 07:30 AM",
      ipAddress: "192.168.1.105",
      status: "success",
      details: "Assigned bed 205 to patient Sarah Wilson"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "default";
      case "failed":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("login") || action.includes("authentication")) {
      return <Shield className="h-4 w-4" />;
    }
    if (action.includes("Updated") || action.includes("Modified")) {
      return <User className="h-4 w-4" />;
    }
    return <Activity className="h-4 w-4" />;
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesFilter = filter === "all" || log.status === filter;
    const matchesSearch = searchTerm === "" || 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Usage Audit Logs</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">142</div>
            <p className="text-xs text-muted-foreground">Successful Actions</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-muted-foreground">Failed Actions</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">25</div>
            <p className="text-xs text-muted-foreground">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-muted-foreground">Total Actions Today</p>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div key={log.id} className="border rounded-lg p-4 hover:bg-accent">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{log.user}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{log.action}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{log.timestamp}</span>
                      </div>
                      <span>IP: {log.ipAddress}</span>
                      <span>Resource: {log.resource}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={getStatusColor(log.status) as any}>
                  {log.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No audit logs found matching your criteria
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageAuditLogs;