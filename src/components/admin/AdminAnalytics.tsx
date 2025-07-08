import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3, TrendingUp, Users, Activity, Star, Calendar } from "lucide-react";

const AdminAnalytics = () => {
  const [timePeriod, setTimePeriod] = useState<"daily" | "weekly" | "monthly" | "quarterly">("monthly");

  // Mock analytics data
  const engagementData = [
    { period: "Jan", activeUsers: 8520, sessions: 25600, avgDuration: 24 },
    { period: "Feb", activeUsers: 9180, sessions: 28400, avgDuration: 26 },
    { period: "Mar", activeUsers: 9850, sessions: 31200, avgDuration: 28 },
    { period: "Apr", activeUsers: 10446, sessions: 34800, avgDuration: 30 },
    { period: "May", activeUsers: 11120, sessions: 38400, avgDuration: 32 },
    { period: "Jun", activeUsers: 11785, sessions: 42200, avgDuration: 35 }
  ];

  const popularSpecialties = [
    { name: "General Medicine", consultations: 1456, revenue: 1164800, color: "#0088FE" },
    { name: "Cardiology", consultations: 892, revenue: 1070400, color: "#00C49F" },
    { name: "Dermatology", consultations: 734, revenue: 587200, color: "#FFBB28" },
    { name: "Pediatrics", consultations: 645, revenue: 516000, color: "#FF8042" },
    { name: "Orthopedics", consultations: 567, revenue: 680400, color: "#8884D8" }
  ];

  const revenueGrowth = [
    { period: "Q1 2024", subscription: 4250000, commission: 850000, total: 5100000 },
    { period: "Q2 2024", subscription: 4890000, commission: 980000, total: 5870000 },
    { period: "Q3 2024", subscription: 5520000, commission: 1104000, total: 6624000 },
    { period: "Q4 2024", subscription: 6200000, commission: 1240000, total: 7440000 }
  ];

  const userActivity = [
    { day: "Mon", patients: 1240, doctors: 186, hospitals: 23 },
    { day: "Tue", patients: 1380, doctors: 201, hospitals: 28 },
    { day: "Wed", patients: 1520, doctors: 215, hospitals: 31 },
    { day: "Thu", patients: 1450, doctors: 198, hospitals: 26 },
    { day: "Fri", patients: 1680, doctors: 234, hospitals: 35 },
    { day: "Sat", patients: 1320, doctors: 167, hospitals: 21 },
    { day: "Sun", patients: 980, doctors: 123, hospitals: 16 }
  ];

  const topPerformers = [
    { name: "Dr. Rajesh Kumar", specialty: "Cardiology", consultations: 234, rating: 4.9, revenue: 187200 },
    { name: "Apollo Hospital", type: "Hospital", departments: 12, rating: 4.8, revenue: 2450000 },
    { name: "Dr. Priya Sharma", specialty: "Dermatology", consultations: 189, rating: 4.9, revenue: 151200 },
    { name: "Max Healthcare", type: "Hospital", departments: 15, rating: 4.7, revenue: 3200000 }
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive analytics dashboard for platform insights
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
            <SelectItem value="quarterly">Quarterly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11.8K</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +6% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.2K</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +9.8% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35 min</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Average user rating</p>
          </CardContent>
        </Card>
      </div>

      {/* User Engagement Trend */}
      <Card>
        <CardHeader>
          <CardTitle>User Engagement Trends</CardTitle>
          <CardDescription>Active users and session data over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value, name) => [formatNumber(Number(value)), name]} />
              <Line type="monotone" dataKey="activeUsers" stroke="#8884d8" strokeWidth={2} name="Active Users" />
              <Line type="monotone" dataKey="sessions" stroke="#82ca9d" strokeWidth={2} name="Sessions" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Popular Specialties and Revenue Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Popular Specialties</CardTitle>
            <CardDescription>Most consulted medical specialties</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={popularSpecialties}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, consultations }) => `${name} (${consultations})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="consultations"
                >
                  {popularSpecialties.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} consultations`, "Count"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>Quarterly revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="subscription" stackId="a" fill="#8884d8" name="Subscriptions" />
                <Bar dataKey="commission" stackId="a" fill="#82ca9d" name="Commissions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Pattern */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Activity Pattern</CardTitle>
          <CardDescription>User activity breakdown by day of week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="patients" fill="#8884d8" name="Patients" />
              <Bar dataKey="doctors" fill="#82ca9d" name="Doctors" />
              <Bar dataKey="hospitals" fill="#ffc658" name="Hospitals" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Top Performers
          </CardTitle>
          <CardDescription>
            Highest performing doctors and hospitals on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{performer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {"specialty" in performer ? performer.specialty : `${performer.departments} departments`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(performer.revenue)}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{performer.rating}</span>
                  </div>
                  <Badge variant="outline">
                    {"consultations" in performer ? `${performer.consultations} consultations` : "Hospital"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;