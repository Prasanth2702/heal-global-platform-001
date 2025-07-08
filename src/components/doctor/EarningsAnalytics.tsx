import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, CreditCard, Building, UserCheck } from "lucide-react";

interface EarningData {
  period: string;
  patients: number;
  facilities: number;
  department: number;
  total: number;
}

interface PaymentSource {
  source: string;
  amount: number;
  percentage: number;
  color: string;
}

const EarningsAnalytics = () => {
  const [timeFrame, setTimeFrame] = useState<"daily" | "monthly" | "quarterly" | "yearly">("monthly");
  const [selectedYear, setSelectedYear] = useState("2024");

  // Mock earnings data
  const monthlyEarnings: EarningData[] = [
    { period: "Jan", patients: 45000, facilities: 15000, department: 8000, total: 68000 },
    { period: "Feb", patients: 52000, facilities: 18000, department: 9500, total: 79500 },
    { period: "Mar", patients: 48000, facilities: 16000, department: 8500, total: 72500 },
    { period: "Apr", patients: 55000, facilities: 20000, department: 11000, total: 86000 },
    { period: "May", patients: 62000, facilities: 22000, department: 12000, total: 96000 },
    { period: "Jun", patients: 58000, facilities: 19000, department: 10500, total: 87500 },
    { period: "Jul", patients: 65000, facilities: 24000, department: 13000, total: 102000 },
    { period: "Aug", patients: 61000, facilities: 21000, department: 11500, total: 93500 },
    { period: "Sep", patients: 67000, facilities: 25000, department: 14000, total: 106000 },
    { period: "Oct", patients: 70000, facilities: 27000, department: 15000, total: 112000 },
    { period: "Nov", patients: 64000, facilities: 23000, department: 12500, total: 99500 },
    { period: "Dec", patients: 72000, facilities: 28000, department: 16000, total: 116000 },
  ];

  const dailyEarnings: EarningData[] = [
    { period: "Mon", patients: 2500, facilities: 800, department: 400, total: 3700 },
    { period: "Tue", patients: 3200, facilities: 1200, department: 600, total: 5000 },
    { period: "Wed", patients: 2800, facilities: 1000, department: 500, total: 4300 },
    { period: "Thu", patients: 3500, facilities: 1400, department: 700, total: 5600 },
    { period: "Fri", patients: 3800, facilities: 1600, department: 800, total: 6200 },
    { period: "Sat", patients: 4200, facilities: 1800, department: 900, total: 6900 },
    { period: "Sun", patients: 1800, facilities: 600, department: 300, total: 2700 },
  ];

  const quarterlyEarnings: EarningData[] = [
    { period: "Q1 2024", patients: 145000, facilities: 49000, department: 26000, total: 220000 },
    { period: "Q2 2024", patients: 175000, facilities: 61000, department: 33500, total: 269500 },
    { period: "Q3 2024", patients: 193000, facilities: 70000, department: 38500, total: 301500 },
    { period: "Q4 2024", patients: 206000, facilities: 78000, department: 43500, total: 327500 },
  ];

  const yearlyEarnings: EarningData[] = [
    { period: "2021", patients: 520000, facilities: 180000, department: 95000, total: 795000 },
    { period: "2022", patients: 640000, facilities: 220000, department: 120000, total: 980000 },
    { period: "2023", patients: 680000, facilities: 245000, department: 135000, total: 1060000 },
    { period: "2024", patients: 719000, facilities: 258000, department: 141500, total: 1118500 },
  ];

  const paymentSources: PaymentSource[] = [
    { source: "Direct Patients", amount: 719000, percentage: 64.3, color: "#8884d8" },
    { source: "Hospital/Facilities", amount: 258000, percentage: 23.1, color: "#82ca9d" },
    { source: "Department Consultations", amount: 141500, percentage: 12.6, color: "#ffc658" },
  ];

  const getCurrentData = () => {
    switch (timeFrame) {
      case "daily":
        return dailyEarnings;
      case "monthly":
        return monthlyEarnings;
      case "quarterly":
        return quarterlyEarnings;
      case "yearly":
        return yearlyEarnings;
      default:
        return monthlyEarnings;
    }
  };

  const currentData = getCurrentData();
  const totalEarnings = currentData.reduce((sum, item) => sum + item.total, 0);
  const avgEarnings = Math.round(totalEarnings / currentData.length);
  const lastPeriod = currentData[currentData.length - 1];
  const previousPeriod = currentData[currentData.length - 2];
  const growthRate = previousPeriod ? ((lastPeriod.total - previousPeriod.total) / previousPeriod.total * 100) : 0;

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const getTimeFrameLabel = () => {
    switch (timeFrame) {
      case "daily": return "This Week";
      case "monthly": return "This Year";
      case "quarterly": return "Quarterly";
      case "yearly": return "Yearly";
      default: return "This Year";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Earnings Analytics</h2>
          <p className="text-muted-foreground">
            Track your income from all sources and time periods
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              Total Earnings ({getTimeFrameLabel()})
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-doctor">
              {formatCurrency(totalEarnings)}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Average per {timeFrame.slice(0, -2)}
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              {formatCurrency(avgEarnings)}
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              {growthRate >= 0 ? <TrendingUp className="mr-2 h-4 w-4" /> : <TrendingDown className="mr-2 h-4 w-4" />}
              Growth Rate
            </CardTitle>
            <CardDescription className={`text-2xl font-bold ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growthRate.toFixed(1)}%
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Top Source
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              Direct Patients
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Earnings Trends</TabsTrigger>
          <TabsTrigger value="sources">Income Sources</TabsTrigger>
          <TabsTrigger value="breakdown">Detailed Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          {/* Earnings Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings Trend - {getTimeFrameLabel()}</CardTitle>
              <CardDescription>
                Track your total earnings and income sources over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="patients" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name="Direct Patients"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="facilities" 
                      stackId="1"
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      name="Hospitals/Facilities"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="department" 
                      stackId="1"
                      stroke="#ffc658" 
                      fill="#ffc658" 
                      name="Department"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Total Earnings Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Total Earnings Growth</CardTitle>
              <CardDescription>
                Overall earnings progression over {getTimeFrameLabel().toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#2563eb" 
                      strokeWidth={3}
                      dot={{ fill: "#2563eb", strokeWidth: 2, r: 6 }}
                      name="Total Earnings"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Income Sources Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Income Distribution</CardTitle>
                <CardDescription>
                  Breakdown of earnings by source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentSources}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ source, percentage }) => `${source}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {paymentSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Source Details */}
            <Card>
              <CardHeader>
                <CardTitle>Income Sources Details</CardTitle>
                <CardDescription>
                  Detailed breakdown of each income source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: source.color }}
                        ></div>
                        <div>
                          <h4 className="font-medium">{source.source}</h4>
                          <p className="text-sm text-muted-foreground">{source.percentage}% of total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(source.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Source Comparison Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Income Sources Comparison</CardTitle>
              <CardDescription>
                Compare earnings from different sources over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="patients" fill="#8884d8" name="Direct Patients" />
                    <Bar dataKey="facilities" fill="#82ca9d" name="Hospitals/Facilities" />
                    <Bar dataKey="department" fill="#ffc658" name="Department" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          {/* Detailed Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Earnings Breakdown</CardTitle>
              <CardDescription>
                Complete breakdown of earnings for {getTimeFrameLabel().toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Period</th>
                      <th className="text-right p-2">Direct Patients</th>
                      <th className="text-right p-2">Hospitals/Facilities</th>
                      <th className="text-right p-2">Department</th>
                      <th className="text-right p-2">Total</th>
                      <th className="text-right p-2">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => {
                      const prevItem = currentData[index - 1];
                      const growth = prevItem ? ((item.total - prevItem.total) / prevItem.total * 100) : 0;
                      
                      return (
                        <tr key={item.period} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{item.period}</td>
                          <td className="p-2 text-right">{formatCurrency(item.patients)}</td>
                          <td className="p-2 text-right">{formatCurrency(item.facilities)}</td>
                          <td className="p-2 text-right">{formatCurrency(item.department)}</td>
                          <td className="p-2 text-right font-semibold">{formatCurrency(item.total)}</td>
                          <td className={`p-2 text-right ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {index > 0 ? `${growth.toFixed(1)}%` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Highest Earning Period
                </CardTitle>
                <CardDescription className="text-lg font-bold">
                  {currentData.reduce((max, item) => item.total > max.total ? item : max, currentData[0])?.period}
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  Best Growth Period
                </CardTitle>
                <CardDescription className="text-lg font-bold">
                  {currentData[currentData.length - 1]?.period}
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Total Transactions
                </CardTitle>
                <CardDescription className="text-lg font-bold">
                  {Math.round(totalEarnings / 750)} consultations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EarningsAnalytics;