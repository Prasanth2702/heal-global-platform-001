import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, IndianRupee, Building2, User, Calendar, DollarSign } from "lucide-react";

interface EarningsData {
  period: string;
  facility: number;
  departments: {
    opd: number;
    diagnostics: number;
    pharmacy: number;
    lab: number;
    emergency: number;
  };
  individual: number;
  total: number;
}

interface ExpenseData {
  period: string;
  category: string;
  amount: number;
  department?: string;
}

const HospitalEarnings = () => {
  const [timePeriod, setTimePeriod] = useState<"daily" | "weekly" | "monthly" | "quarterly" | "annually">("monthly");
  const [activeView, setActiveView] = useState<"earnings" | "expenses">("earnings");

  // Mock earnings data
  const earningsData: EarningsData[] = [
    {
      period: "Jan 2024",
      facility: 2850000,
      departments: { opd: 850000, diagnostics: 650000, pharmacy: 450000, lab: 550000, emergency: 350000 },
      individual: 1200000,
      total: 4050000
    },
    {
      period: "Feb 2024",
      facility: 3100000,
      departments: { opd: 920000, diagnostics: 720000, pharmacy: 480000, lab: 600000, emergency: 380000 },
      individual: 1350000,
      total: 4450000
    },
    {
      period: "Mar 2024",
      facility: 3350000,
      departments: { opd: 1000000, diagnostics: 780000, pharmacy: 520000, lab: 650000, emergency: 400000 },
      individual: 1450000,
      total: 4800000
    }
  ];

  // Mock expense data
  const expenseData: ExpenseData[] = [
    { period: "Jan 2024", category: "Staff Salaries", amount: 1200000, department: "All" },
    { period: "Jan 2024", category: "Medical Supplies", amount: 450000, department: "Pharmacy" },
    { period: "Jan 2024", category: "Equipment Maintenance", amount: 250000, department: "Diagnostics" },
    { period: "Feb 2024", category: "Staff Salaries", amount: 1250000, department: "All" },
    { period: "Feb 2024", category: "Medical Supplies", amount: 480000, department: "Pharmacy" },
    { period: "Mar 2024", category: "Staff Salaries", amount: 1300000, department: "All" }
  ];

  // Department breakdown data for pie chart
  const departmentData = [
    { name: "OPD", value: 1000000, color: "#0088FE" },
    { name: "Diagnostics", value: 780000, color: "#00C49F" },
    { name: "Lab", value: 650000, color: "#FFBB28" },
    { name: "Pharmacy", value: 520000, color: "#FF8042" },
    { name: "Emergency", value: 400000, color: "#8884D8" }
  ];

  // Individual earnings data
  const individualEarnings = [
    { name: "Dr. Rajesh Kumar", department: "Cardiology", earnings: 350000, patients: 145 },
    { name: "Dr. Priya Sharma", department: "Radiology", earnings: 280000, patients: 98 },
    { name: "Dr. Amit Singh", department: "Pathology", earnings: 220000, patients: 234 },
    { name: "Dr. Sarah Wilson", department: "General Medicine", earnings: 195000, patients: 167 }
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const currentMonthData = earningsData[earningsData.length - 1];
  const previousMonthData = earningsData[earningsData.length - 2];
  const growthRate = ((currentMonthData.total - previousMonthData.total) / previousMonthData.total * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Earnings & Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive financial analytics and reporting
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={activeView} onValueChange={(value: "earnings" | "expenses") => setActiveView(value)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="earnings">Earnings</SelectItem>
              <SelectItem value="expenses">Expenses</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timePeriod} onValueChange={(value: any) => setTimePeriod(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeView === "earnings" && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(currentMonthData.total)}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                  +{growthRate}% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Facility Revenue</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(currentMonthData.facility)}</div>
                <p className="text-xs text-muted-foreground">
                  {((currentMonthData.facility / currentMonthData.total) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Individual Revenue</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(currentMonthData.individual)}</div>
                <p className="text-xs text-muted-foreground">
                  {((currentMonthData.individual / currentMonthData.total) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Department</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(currentMonthData.departments.opd)}</div>
                <p className="text-xs text-muted-foreground">OPD - Highest earner</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="facility" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="individual" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Department Revenue Breakdown</CardTitle>
                <CardDescription>Current month distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Monthly revenue by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="departments.opd" stackId="a" fill="#8884d8" name="OPD" />
                  <Bar dataKey="departments.diagnostics" stackId="a" fill="#82ca9d" name="Diagnostics" />
                  <Bar dataKey="departments.pharmacy" stackId="a" fill="#ffc658" name="Pharmacy" />
                  <Bar dataKey="departments.lab" stackId="a" fill="#ff7300" name="Lab" />
                  <Bar dataKey="departments.emergency" stackId="a" fill="#0088fe" name="Emergency" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Individual Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Doctors</CardTitle>
              <CardDescription>Individual earnings this month</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Patients Treated</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Avg. per Patient</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {individualEarnings.map((doctor, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{doctor.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doctor.department}</Badge>
                      </TableCell>
                      <TableCell>{doctor.patients}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(doctor.earnings)}</TableCell>
                      <TableCell>{formatCurrency(Math.round(doctor.earnings / doctor.patients))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {activeView === "expenses" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Monthly expense analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseData.map((expense, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {expense.period}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{expense.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{expense.department}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-red-600">
                        -{formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Paid</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HospitalEarnings;