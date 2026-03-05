// pages/facility/AnalyticsReportsPage.tsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  BedIcon,
  Building,
  CalendarDays,
  Download,
  Printer,
  Filter,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Star,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import StatsCards from "@/components/facility/shared/StatsCards";

const AnalyticsReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [stats, setStats] = useState({
    totalWards: 12,
    totalBeds: 240,
    availableBeds: 85,
    occupiedBeds: 145,
    maintenanceBeds: 10,
    occupancyRate: 60.4,
    admittedPatients: 145,
    criticalPatients: 8,
    averageStay: 4.7,
    dailyAdmissions: 12,
  });

  const [analytics, setAnalytics] = useState({
    occupancyTrend: [
      { day: "Mon", rate: 58 },
      { day: "Tue", rate: 62 },
      { day: "Wed", rate: 65 },
      { day: "Thu", rate: 59 },
      { day: "Fri", rate: 63 },
      { day: "Sat", rate: 61 },
      { day: "Sun", rate: 57 },
    ],
    departmentStats: [
      { name: "General", beds: 80, occupied: 45, rate: 56.3 },
      { name: "ICU", beds: 20, occupied: 18, rate: 90.0 },
      { name: "Pediatric", beds: 40, occupied: 22, rate: 55.0 },
      { name: "Maternity", beds: 30, occupied: 18, rate: 60.0 },
      { name: "Surgical", beds: 50, occupied: 35, rate: 70.0 },
    ],
    revenueData: [
      { month: "Jan", revenue: 125000, expenses: 95000 },
      { month: "Feb", revenue: 135000, expenses: 98000 },
      { month: "Mar", revenue: 142000, expenses: 101000 },
      { month: "Apr", revenue: 138000, expenses: 99000 },
      { month: "May", revenue: 148000, expenses: 105000 },
    ],
    staffPerformance: [
      { name: "Dr. Smith", patients: 24, rating: 4.8 },
      { name: "Dr. Johnson", patients: 18, rating: 4.6 },
      { name: "Dr. Williams", patients: 22, rating: 4.9 },
      { name: "Dr. Brown", patients: 16, rating: 4.5 },
      { name: "Dr. Davis", patients: 20, rating: 4.7 },
    ],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data: statsData } = await supabase.rpc("get_facility_stats", {
        time_range: timeRange,
      });

      if (statsData) {
        setStats(statsData);
      }

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  };

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp size={16} className="text-green-500" />;
    if (trend < 0) return <TrendingDown size={16} className="text-red-500" />;
    return null;
  };

  const generateReport = (type: string) => {
    console.log(`Generating ${type} report...`);
  };

  const getVariantForRate = (rate: number) => {
    if (rate > 85) return "destructive";
    if (rate > 70) return "default";
    return "default";
  };

  const getProgressColor = (rate: number) => {
    if (rate > 85) return "bg-red-500";
    if (rate > 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="analytics-reports-page space-y-6 p-4 md:p-6">
      {/* Header with Time Range Selector */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Facility Analytics & Reports
              </h2>
              <p className="text-muted-foreground">
                Comprehensive insights and performance metrics
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-muted-foreground" />
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Last 24 Hours</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateReport("summary")}
                >
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
                <Button size="sm" onClick={() => generateReport("detailed")}>
                  <Printer size={16} className="mr-2" />
                  Print Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Statistics */}
      <div>
        <StatsCards stats={stats} showDetails={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Occupancy Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Bed Occupancy Trends</CardTitle>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Last 7 Days
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl font-bold">
                      {stats.occupancyRate}%
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Current Occupancy Rate
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 flex items-center">
                      +2.3% from last week
                      <TrendingUp size={16} className="ml-1" />
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-end gap-3"
                  style={{ height: "200px" }}
                >
                  {analytics.occupancyTrend.map((item, index) => (
                    <div key={index} className="text-center flex-1">
                      <div
                        className="relative mx-auto"
                        style={{ height: "100%" }}
                      >
                        <div className="absolute bottom-0 left-0 right-0">
                          <div
                            className="bg-primary/25 rounded-t-lg mx-auto"
                            style={{
                              width: "30px",
                              height: `${item.rate * 2}px`,
                              minHeight: "10px",
                            }}
                          >
                            <div
                              className="bg-primary rounded-t-lg"
                              style={{ height: "100%" }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm">{item.day}</div>
                      <div className="font-bold">{item.rate}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.departmentStats.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{dept.name}</span>
                    <span className="text-muted-foreground">{dept.rate}%</span>
                  </div>
                  <Progress value={dept.rate} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {dept.occupied}/{dept.beds} beds occupied
                    </span>
                    {dept.rate > 85 && (
                      <AlertCircle size={12} className="text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Analysis */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Revenue Analysis</CardTitle>
              <DollarSign size={20} className="text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-3xl font-bold">$148,000</h3>
                  <p className="text-sm text-muted-foreground">
                    Current Month Revenue
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-green-600 flex items-center">
                    +8.5% from last month
                    <TrendingUp size={16} className="ml-1" />
                  </div>
                </div>
              </div>

              <div className="flex items-end gap-2" style={{ height: "150px" }}>
                {analytics.revenueData.map((item, index) => (
                  <div key={index} className="text-center flex-1">
                    <div
                      className="relative mx-auto"
                      style={{ height: "100%" }}
                    >
                      {/* Revenue Bar */}
                      <div
                        className="absolute bottom-0 left-1/4 transform -translate-x-1/2"
                        style={{
                          width: "20px",
                          height: `${(item.revenue / 150000) * 100}%`,
                        }}
                      >
                        <div className="bg-green-500/25 rounded-t-lg h-full">
                          <div className="bg-green-500 rounded-t-lg h-full" />
                        </div>
                      </div>
                      {/* Expenses Bar */}
                      <div
                        className="absolute bottom-0 left-3/4 transform -translate-x-1/2"
                        style={{
                          width: "20px",
                          height: `${(item.expenses / 150000) * 100}%`,
                        }}
                      >
                        <div className="bg-red-500/25 rounded-t-lg h-full">
                          <div className="bg-red-500 rounded-t-lg h-full" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">{item.month}</div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                  <span className="text-sm">Revenue</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                  <span className="text-sm">Expenses</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff Performance */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Staff Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Patients</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.staffPerformance.map((staff, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 rounded-full p-2">
                          <Users size={16} />
                        </div>
                        <div>
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Attending Physician
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold">{staff.patients}</div>
                      <div className="text-sm text-muted-foreground">
                        This month
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="font-bold">{staff.rating}</div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < Math.floor(staff.rating)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Progress
                        value={(staff.patients / 30) * 100}
                        className="h-2"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Key Metrics Summary */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center p-4">
                <div
                  className={`text-3xl font-bold ${
                    stats.averageStay < 5 ? "text-green-500" : "text-yellow-500"
                  }`}
                >
                  {stats.averageStay}
                </div>
                <div className="text-muted-foreground">Avg Stay (days)</div>
                <div className="text-sm">
                  {stats.averageStay < 5 ? (
                    <span className="text-green-600 flex items-center justify-center gap-1">
                      Optimal <TrendingDown size={12} />
                    </span>
                  ) : (
                    <span className="text-yellow-600 flex items-center justify-center gap-1">
                      Above average <AlertCircle size={12} />
                    </span>
                  )}
                </div>
              </div>

              <div className="text-center p-4">
                <div
                  className={`text-3xl font-bold ${
                    stats.dailyAdmissions < 15
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stats.dailyAdmissions}
                </div>
                <div className="text-muted-foreground">Daily Admissions</div>
                <div className="text-sm">
                  {stats.dailyAdmissions < 15 ? (
                    <span className="text-green-600 flex items-center justify-center gap-1">
                      Normal <TrendingUp size={12} />
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center justify-center gap-1">
                      High volume <AlertCircle size={12} />
                    </span>
                  )}
                </div>
              </div>

              <div className="text-center p-4">
                <div className="text-3xl font-bold text-blue-500">94.5%</div>
                <div className="text-muted-foreground">Bed Turnover Rate</div>
                <div className="text-sm text-green-600 flex items-center justify-center gap-1">
                  Efficient <TrendingUp size={12} />
                </div>
              </div>

              <div className="text-center p-4">
                <div className="text-3xl font-bold text-yellow-500">
                  3.2 hrs
                </div>
                <div className="text-muted-foreground">Avg Response Time</div>
                <div className="text-sm text-green-600 flex items-center justify-center gap-1">
                  Within target <CheckCircle size={12} />
                </div>
              </div>

              <div className="text-center p-4">
                <div className="text-3xl font-bold text-green-500">98.2%</div>
                <div className="text-muted-foreground">
                  Patient Satisfaction
                </div>
                <div className="text-sm text-green-600 flex items-center justify-center gap-1">
                  Excellent <TrendingUp size={12} />
                </div>
              </div>

              <div className="text-center p-4">
                <div className="text-3xl font-bold text-purple-500">87%</div>
                <div className="text-muted-foreground">
                  Resource Utilization
                </div>
                <div className="text-sm text-yellow-600 flex items-center justify-center gap-1">
                  Good <TrendingUp size={12} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Generation Section */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-blue-100 rounded-full p-3 inline-flex mb-4">
                    <CalendarDays size={24} className="text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Daily Report</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Summary of daily operations and admissions
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateReport("daily")}
                  >
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-yellow-100 rounded-full p-3 inline-flex mb-4">
                    <Activity size={24} className="text-yellow-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Performance Report</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Staff and department performance metrics
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateReport("performance")}
                    className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                  >
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center border hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="bg-green-100 rounded-full p-3 inline-flex mb-4">
                    <DollarSign size={24} className="text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Financial Report</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Revenue, expenses, and financial analysis
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateReport("financial")}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsReportsPage;
