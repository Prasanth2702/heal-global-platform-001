import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Globe, MapPin, TrendingUp } from "lucide-react";
import { useState } from "react";

const GeographicStatistics = () => {
  const [reportType, setReportType] = useState("users");
  
  const stateData = [
    { state: "Maharashtra", users: 2543, births: 1234, deaths: 89 },
    { state: "Karnataka", users: 1876, births: 987, deaths: 65 },
    { state: "Delhi", users: 1654, births: 765, deaths: 45 },
    { state: "Tamil Nadu", users: 1432, births: 654, deaths: 38 },
    { state: "Gujarat", users: 1234, births: 543, deaths: 32 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Geographic Statistics</h2>
          <p className="text-muted-foreground">Health data analytics by location</p>
        </div>
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="users">User Distribution</SelectItem>
            <SelectItem value="health">Health Statistics</SelectItem>
            <SelectItem value="epidemic">Epidemic Tracking</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Births</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">4,183</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deaths</CardTitle>
            <MapPin className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">269</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Regions</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">States covered</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>State-wise Distribution</CardTitle>
          <CardDescription>Geographic breakdown of platform metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#8884d8" name="Users" />
              <Bar dataKey="births" fill="#82ca9d" name="Births" />
              <Bar dataKey="deaths" fill="#ffc658" name="Deaths" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeographicStatistics;