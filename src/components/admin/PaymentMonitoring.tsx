import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CreditCard, TrendingUp, AlertTriangle, Search, Calendar, DollarSign, Users } from "lucide-react";
import { format, subDays } from "date-fns";

interface PaymentTransaction {
  id: string;
  customerName: string;
  customerType: "doctor" | "hospital" | "patient";
  transactionType: "subscription" | "commission" | "consultation" | "refund";
  amount: number;
  status: "completed" | "pending" | "failed" | "disputed";
  date: Date;
  paymentMethod: "card" | "upi" | "bank_transfer" | "wallet";
  platformFee: number;
  description: string;
}

const PaymentMonitoring = () => {
  const [transactions] = useState<PaymentTransaction[]>([
    {
      id: "1",
      customerName: "Dr. Rajesh Kumar",
      customerType: "doctor",
      transactionType: "subscription",
      amount: 2999,
      status: "completed",
      date: new Date(),
      paymentMethod: "card",
      platformFee: 299,
      description: "Pro Plan Monthly Subscription"
    },
    {
      id: "2",
      customerName: "Apollo Hospital",
      customerType: "hospital",
      transactionType: "commission",
      amount: 1500,
      status: "completed",
      date: subDays(new Date(), 1),
      paymentMethod: "bank_transfer",
      platformFee: 150,
      description: "Platform commission on consultations"
    },
    {
      id: "3",
      customerName: "Sarah Wilson",
      customerType: "patient",
      transactionType: "consultation",
      amount: 800,
      status: "completed",
      date: subDays(new Date(), 1),
      paymentMethod: "upi",
      platformFee: 80,
      description: "Consultation fee payment"
    },
    {
      id: "4",
      customerName: "City Clinic",
      customerType: "hospital",
      transactionType: "subscription",
      amount: 999,
      status: "pending",
      date: subDays(new Date(), 2),
      paymentMethod: "card",
      platformFee: 99,
      description: "Basic Plan Monthly Subscription"
    }
  ]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter(txn => {
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    const matchesType = typeFilter === "all" || txn.transactionType === typeFilter;
    const matchesSearch = txn.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  // Mock revenue data for chart
  const revenueData = [
    { date: "Day 1", revenue: 15000, transactions: 45 },
    { date: "Day 2", revenue: 18000, transactions: 52 },
    { date: "Day 3", revenue: 22000, transactions: 68 },
    { date: "Day 4", revenue: 19000, transactions: 55 },
    { date: "Day 5", revenue: 25000, transactions: 75 },
    { date: "Day 6", revenue: 28000, transactions: 82 },
    { date: "Day 7", revenue: 32000, transactions: 95 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "disputed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "subscription":
        return "bg-blue-100 text-blue-800";
      case "commission":
        return "bg-green-100 text-green-800";
      case "consultation":
        return "bg-purple-100 text-purple-800";
      case "refund":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalRevenue = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const totalFees = transactions.reduce((sum, txn) => sum + txn.platformFee, 0);
  const completedTransactions = transactions.filter(txn => txn.status === "completed").length;
  const pendingTransactions = transactions.filter(txn => txn.status === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Monitoring</h2>
          <p className="text-muted-foreground">
            Track all platform transactions and revenue
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Commission earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTransactions}</div>
            <p className="text-xs text-muted-foreground">Successful transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingTransactions}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue Trend</CardTitle>
          <CardDescription>Platform revenue over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`₹${value}`, name === "revenue" ? "Revenue" : "Transactions"]} />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="revenue" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
            <SelectItem value="commission">Commission</SelectItem>
            <SelectItem value="consultation">Consultation</SelectItem>
            <SelectItem value="refund">Refund</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Recent Transactions
          </CardTitle>
          <CardDescription>
            {filteredTransactions.length} transactions found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Platform Fee</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{transaction.customerName}</p>
                      <p className="text-sm text-muted-foreground">{transaction.description}</p>
                      <div className="flex items-center mt-1">
                        <Users className="mr-1 h-3 w-3" />
                        <span className="text-xs text-muted-foreground capitalize">{transaction.customerType}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(transaction.transactionType)} variant="outline">
                      {transaction.transactionType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">₹{transaction.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600 font-medium">₹{transaction.platformFee.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CreditCard className="mr-1 h-3 w-3" />
                      {transaction.paymentMethod.replace("_", " ")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {format(transaction.date, "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      {transaction.status === "disputed" && (
                        <Button size="sm" variant="outline">
                          Resolve
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

export default PaymentMonitoring;