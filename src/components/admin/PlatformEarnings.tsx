import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, TrendingUp, CreditCard, AlertTriangle, Bell, Calendar, Users, Building } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Subscription {
  id: string;
  customerName: string;
  customerType: "doctor" | "hospital" | "clinic";
  plan: "basic" | "pro" | "enterprise";
  monthlyFee: number;
  startDate: Date;
  endDate: Date;
  status: "active" | "expired" | "cancelled" | "pending";
  autoRenew: boolean;
  daysUntilExpiry: number;
}

interface EarningsData {
  period: string;
  subscriptions: number;
  commissions: number;
  premiumFeatures: number;
  total: number;
}

const PlatformEarnings = () => {
  const { toast } = useToast();
  const [timePeriod, setTimePeriod] = useState<"daily" | "weekly" | "monthly" | "quarterly" | "annually">("monthly");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "1",
      customerName: "Dr. Rajesh Kumar",
      customerType: "doctor",
      plan: "pro",
      monthlyFee: 2999,
      startDate: subDays(new Date(), 45),
      endDate: addDays(new Date(), 15),
      status: "active",
      autoRenew: true,
      daysUntilExpiry: 15
    },
    {
      id: "2",
      customerName: "Apollo Hospital",
      customerType: "hospital",
      plan: "enterprise",
      monthlyFee: 9999,
      startDate: subDays(new Date(), 20),
      endDate: addDays(new Date(), 10),
      status: "active",
      autoRenew: false,
      daysUntilExpiry: 10
    },
    {
      id: "3",
      customerName: "City Clinic",
      customerType: "clinic",
      plan: "basic",
      monthlyFee: 999,
      startDate: subDays(new Date(), 60),
      endDate: addDays(new Date(), 30),
      status: "active",
      autoRenew: true,
      daysUntilExpiry: 30
    },
    {
      id: "4",
      customerName: "Dr. Priya Sharma",
      customerType: "doctor",
      plan: "pro",
      monthlyFee: 2999,
      startDate: subDays(new Date(), 35),
      endDate: addDays(new Date(), 25),
      status: "active",
      autoRenew: false,
      daysUntilExpiry: 25
    },
    {
      id: "5",
      customerName: "Metro Hospital",
      customerType: "hospital",
      plan: "enterprise",
      monthlyFee: 9999,
      startDate: subDays(new Date(), 32),
      endDate: addDays(new Date(), 28),
      status: "active",
      autoRenew: true,
      daysUntilExpiry: 28
    },
    {
      id: "6",
      customerName: "Dr. Amit Singh",
      customerType: "doctor",
      plan: "basic",
      monthlyFee: 999,
      startDate: subDays(new Date(), 90),
      endDate: addDays(new Date(), 2),
      status: "active",
      autoRenew: false,
      daysUntilExpiry: 2
    }
  ]);

  // Mock earnings data
  const earningsData: EarningsData[] = [
    { period: "Jan 2024", subscriptions: 1450000, commissions: 280000, premiumFeatures: 120000, total: 1850000 },
    { period: "Feb 2024", subscriptions: 1580000, commissions: 310000, premiumFeatures: 135000, total: 2025000 },
    { period: "Mar 2024", subscriptions: 1720000, commissions: 340000, premiumFeatures: 150000, total: 2210000 },
    { period: "Apr 2024", subscriptions: 1890000, commissions: 375000, premiumFeatures: 165000, total: 2430000 },
    { period: "May 2024", subscriptions: 2050000, commissions: 410000, premiumFeatures: 180000, total: 2640000 },
    { period: "Jun 2024", subscriptions: 2250000, commissions: 450000, premiumFeatures: 200000, total: 2900000 }
  ];

  // Revenue breakdown
  const revenueBreakdown = [
    { name: "Subscriptions", value: 2250000, color: "#0088FE", percentage: 77.6 },
    { name: "Commissions", value: 450000, color: "#00C49F", percentage: 15.5 },
    { name: "Premium Features", value: 200000, color: "#FFBB28", percentage: 6.9 }
  ];

  // Get subscriptions expiring soon
  const expiringIn30Days = subscriptions.filter(sub => sub.daysUntilExpiry <= 30 && sub.status === "active");
  const expiringIn10Days = subscriptions.filter(sub => sub.daysUntilExpiry <= 10 && sub.status === "active");
  const expiringIn3Days = subscriptions.filter(sub => sub.daysUntilExpiry <= 3 && sub.status === "active");

  const sendRenewalNotification = (subscription: Subscription, daysLeft: number) => {
    // Mock notification sending
    toast({
      title: "Renewal Notification Sent",
      description: `Sent ${daysLeft}-day renewal notice to ${subscription.customerName}`,
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "basic":
        return "bg-blue-100 text-blue-800";
      case "pro":
        return "bg-purple-100 text-purple-800";
      case "enterprise":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getExpiryColor = (days: number) => {
    if (days <= 3) return "text-red-600 font-bold";
    if (days <= 10) return "text-orange-600 font-medium";
    if (days <= 30) return "text-yellow-600";
    return "text-gray-600";
  };

  const currentMonthEarnings = earningsData[earningsData.length - 1];
  const previousMonthEarnings = earningsData[earningsData.length - 2];
  const growthRate = ((currentMonthEarnings.total - previousMonthEarnings.total) / previousMonthEarnings.total * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Platform Earnings & Subscriptions</h2>
          <p className="text-muted-foreground">
            Monitor subscription revenue and customer lifecycle
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
            <SelectItem value="annually">Annually</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Expiry Alerts */}
      {expiringIn3Days.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Critical Alert:</strong> {expiringIn3Days.length} subscriptions expire within 3 days. 
            <Button variant="link" className="p-0 ml-2 h-auto">
              Send urgent renewal notices
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentMonthEarnings.total)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              +{growthRate}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.filter(s => s.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently paying customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring in 30 Days</CardTitle>
            <Bell className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{expiringIn30Days.length}</div>
            <p className="text-xs text-muted-foreground">Need renewal attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentMonthEarnings.subscriptions)}</div>
            <p className="text-xs text-muted-foreground">
              {((currentMonthEarnings.subscriptions / currentMonthEarnings.total) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Platform earnings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} name="Total Revenue" />
                <Line type="monotone" dataKey="subscriptions" stroke="#82ca9d" strokeWidth={2} name="Subscriptions" />
                <Line type="monotone" dataKey="commissions" stroke="#ffc658" strokeWidth={2} name="Commissions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>Current month distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Components */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Components</CardTitle>
          <CardDescription>Breakdown by revenue stream</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="subscriptions" stackId="a" fill="#8884d8" name="Subscriptions" />
              <Bar dataKey="commissions" stackId="a" fill="#82ca9d" name="Commissions" />
              <Bar dataKey="premiumFeatures" stackId="a" fill="#ffc658" name="Premium Features" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subscription Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Subscription Management
          </CardTitle>
          <CardDescription>
            Active subscriptions and renewal tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Monthly Fee</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Auto Renew</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{subscription.customerName}</p>
                      <div className="flex items-center mt-1">
                        {subscription.customerType === "doctor" && <Users className="mr-1 h-3 w-3" />}
                        {subscription.customerType === "hospital" && <Building className="mr-1 h-3 w-3" />}
                        {subscription.customerType === "clinic" && <Building className="mr-1 h-3 w-3" />}
                        <span className="text-xs text-muted-foreground capitalize">{subscription.customerType}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{subscription.customerType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlanColor(subscription.plan)} variant="outline">
                      {subscription.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">₹{subscription.monthlyFee.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(subscription.endDate, "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={getExpiryColor(subscription.daysUntilExpiry)}>
                      {subscription.daysUntilExpiry} days
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={subscription.autoRenew ? "default" : "outline"}>
                      {subscription.autoRenew ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(subscription.status)}>
                      {subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {subscription.daysUntilExpiry <= 30 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendRenewalNotification(subscription, subscription.daysUntilExpiry)}
                        >
                          <Bell className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
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

export default PlatformEarnings;