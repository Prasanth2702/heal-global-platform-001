import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, UserCheck, Building, Activity, TrendingUp, Calendar } from "lucide-react";
import { format, subDays } from "date-fns";

interface UserData {
  period: string;
  patients: number;
  doctors: number;
  hospitals: number;
  total: number;
}

const UserStatistics = () => {
  const [timePeriod, setTimePeriod] = useState<"daily" | "weekly" | "monthly">("monthly");

  // Mock user growth data
  const userGrowthData: UserData[] = [
    { period: "Jan 2024", patients: 8520, doctors: 1245, hospitals: 167, total: 9932 },
    { period: "Feb 2024", patients: 9180, doctors: 1368, hospitals: 189, total: 10737 },
    { period: "Mar 2024", patients: 9850, doctors: 1456, hospitals: 203, total: 11509 },
    { period: "Apr 2024", patients: 10446, doctors: 1578, hospitals: 234, total: 12258 },
    { period: "May 2024", patients: 11120, doctors: 1689, hospitals: 256, total: 13065 },
    { period: "Jun 2024", patients: 11785, doctors: 1789, hospitals: 267, total: 13841 }
  ];

  // User distribution data
  const userDistribution = [
    { name: "Patients", value: 10446, color: "#0088FE", percentage: 84.2 },
    { name: "Doctors", value: 1834, color: "#00C49F", percentage: 14.8 },
    { name: "Hospitals", value: 267, color: "#FFBB28", percentage: 2.2 }
  ];

  // Top performing metrics
  const topMetrics = [
    { category: "Most Active State", value: "Maharashtra", count: 2543, change: "+12%" },
    { category: "Top Specialty", value: "General Medicine", count: 456, change: "+8%" },
    { category: "Peak Registration Day", value: "Monday", count: 89, change: "+15%" },
    { category: "Average Session Time", value: "24 minutes", count: 0, change: "+3%" }
  ];

  // Recent registrations
  const recentRegistrations = [
    { 
      id: "1", 
      name: "Dr. Rajesh Kumar", 
      type: "Doctor", 
      specialty: "Cardiology", 
      location: "Mumbai", 
      registeredAt: subDays(new Date(), 1),
      status: "active"
    },
    { 
      id: "2", 
      name: "Apollo Hospital", 
      type: "Hospital", 
      specialty: "Multi-specialty", 
      location: "Delhi", 
      registeredAt: subDays(new Date(), 2),
      status: "pending"
    },
    { 
      id: "3", 
      name: "Sarah Wilson", 
      type: "Patient", 
      specialty: "-", 
      location: "Bangalore", 
      registeredAt: subDays(new Date(), 2),
      status: "active"
    },
    { 
      id: "4", 
      name: "Dr. Priya Sharma", 
      type: "Doctor", 
      specialty: "Dermatology", 
      location: "Chennai", 
      registeredAt: subDays(new Date(), 3),
      status: "active"
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Doctor":
        return "bg-blue-100 text-blue-800";
      case "Hospital":
        return "bg-purple-100 text-purple-800";
      case "Patient":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Statistics</h2>
          <p className="text-muted-foreground">
            Comprehensive user analytics and growth metrics
          </p>
        </div>
        <Select value={timePeriod} onValueChange={(value: any) => setTimePeriod(value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* User Growth Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>Registration growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} name="Total Users" />
                <Line type="monotone" dataKey="patients" stroke="#82ca9d" strokeWidth={2} name="Patients" />
                <Line type="monotone" dataKey="doctors" stroke="#ffc658" strokeWidth={2} name="Doctors" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Current user base breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Registration Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Trends</CardTitle>
          <CardDescription>Monthly registration breakdown by user type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={formatNumber} />
              <Tooltip formatter={(value) => formatNumber(Number(value))} />
              <Bar dataKey="patients" stackId="a" fill="#8884d8" name="Patients" />
              <Bar dataKey="doctors" stackId="a" fill="#82ca9d" name="Doctors" />
              <Bar dataKey="hospitals" stackId="a" fill="#ffc658" name="Hospitals" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Metrics</CardTitle>
          <CardDescription>Top performing categories and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topMetrics.map((metric, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.category}</p>
                    <p className="text-lg font-bold">{metric.value}</p>
                    {metric.count > 0 && (
                      <p className="text-sm text-muted-foreground">{metric.count} registrations</p>
                    )}
                  </div>
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">{metric.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Registrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Recent Registrations
          </CardTitle>
          <CardDescription>
            Latest user registrations across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Specialty/Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRegistrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell className="font-medium">{registration.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(registration.type)} variant="outline">
                      {registration.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{registration.specialty}</TableCell>
                  <TableCell>{registration.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(registration.registeredAt, "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(registration.status)}>
                      {registration.status}
                    </Badge>
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

export default UserStatistics;