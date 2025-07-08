import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Search, Users, Building } from "lucide-react";
import { useState } from "react";

const ProfileManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const profiles = [
    { id: "1", name: "Dr. Rajesh Kumar", type: "Doctor", status: "Active", lastLogin: "2 hours ago" },
    { id: "2", name: "Apollo Hospital", type: "Hospital", status: "Active", lastLogin: "1 day ago" },
    { id: "3", name: "Sarah Wilson", type: "Patient", status: "Active", lastLogin: "5 minutes ago" },
    { id: "4", name: "City Clinic", type: "Clinic", status: "Suspended", lastLogin: "1 week ago" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Suspended": return "bg-red-100 text-red-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Management</h2>
        <p className="text-muted-foreground">Edit and manage all user profiles</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            All Profiles
          </CardTitle>
          <CardDescription>Manage all user profiles on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {profile.type === "Hospital" || profile.type === "Clinic" ? 
                        <Building className="mr-1 h-3 w-3" /> : 
                        <Users className="mr-1 h-3 w-3" />
                      }
                      {profile.type}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(profile.status)}>
                      {profile.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{profile.lastLogin}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};