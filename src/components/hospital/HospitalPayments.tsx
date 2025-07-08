import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard, Receipt, FileText, Download, Eye, Search, Calendar } from "lucide-react";
import { format, subDays } from "date-fns";

interface Payment {
  id: string;
  patientName: string;
  patientId: string;
  department: string;
  service: string;
  amount: number;
  paymentMethod: "card" | "upi" | "cash" | "insurance" | "bank_transfer";
  status: "completed" | "pending" | "failed" | "refunded";
  transactionId: string;
  date: Date;
  invoiceNumber: string;
  insuranceProvider?: string;
  claimId?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  patientName: string;
  date: Date;
  totalAmount: number;
  status: "paid" | "pending" | "overdue";
  dueDate: Date;
}

interface InsuranceClaim {
  id: string;
  claimNumber: string;
  patientName: string;
  provider: string;
  amount: number;
  status: "submitted" | "approved" | "rejected" | "processing";
  submissionDate: Date;
  description: string;
}

const HospitalPayments = () => {
  const [activeTab, setActiveTab] = useState<"payments" | "invoices" | "insurance">("payments");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const payments: Payment[] = [
    {
      id: "1",
      patientName: "John Smith",
      patientId: "P001",
      department: "General OPD",
      service: "Consultation",
      amount: 800,
      paymentMethod: "card",
      status: "completed",
      transactionId: "TXN001234",
      date: new Date(),
      invoiceNumber: "INV-2024-001"
    },
    {
      id: "2",
      patientName: "Sarah Wilson",
      patientId: "P002",
      department: "Radiology",
      service: "MRI Scan",
      amount: 8500,
      paymentMethod: "insurance",
      status: "completed",
      transactionId: "TXN001235",
      date: subDays(new Date(), 1),
      invoiceNumber: "INV-2024-002",
      insuranceProvider: "Star Health Insurance",
      claimId: "CLM001"
    },
    {
      id: "3",
      patientName: "Mike Johnson",
      patientId: "P003",
      department: "Pathology Lab",
      service: "Blood Test Panel",
      amount: 1200,
      paymentMethod: "upi",
      status: "pending",
      transactionId: "TXN001236",
      date: subDays(new Date(), 2),
      invoiceNumber: "INV-2024-003"
    }
  ];

  const invoices: Invoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      patientName: "John Smith",
      date: new Date(),
      totalAmount: 800,
      status: "paid",
      dueDate: new Date()
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-004",
      patientName: "Emily Davis",
      date: subDays(new Date(), 5),
      totalAmount: 3500,
      status: "pending",
      dueDate: new Date()
    }
  ];

  const insuranceClaims: InsuranceClaim[] = [
    {
      id: "1",
      claimNumber: "CLM001",
      patientName: "Sarah Wilson",
      provider: "Star Health Insurance",
      amount: 8500,
      status: "approved",
      submissionDate: subDays(new Date(), 1),
      description: "MRI Scan - Neurological consultation"
    },
    {
      id: "2",
      claimNumber: "CLM002",
      patientName: "Robert Brown",
      provider: "HDFC ERGO",
      amount: 15000,
      status: "processing",
      submissionDate: subDays(new Date(), 3),
      description: "Surgical procedure - Appendectomy"
    }
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = paymentFilter === "all" || payment.status === paymentFilter;
    const matchesSearch = payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return "💳";
      case "upi":
        return "📱";
      case "cash":
        return "💵";
      case "insurance":
        return "🛡️";
      case "bank_transfer":
        return "🏦";
      default:
        return "💰";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Management</h2>
          <p className="text-muted-foreground">
            Manage payments, invoices, and insurance claims
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        <Button
          variant={activeTab === "payments" ? "default" : "ghost"}
          onClick={() => setActiveTab("payments")}
          className="flex items-center space-x-2"
        >
          <CreditCard className="h-4 w-4" />
          <span>Payments</span>
        </Button>
        <Button
          variant={activeTab === "invoices" ? "default" : "ghost"}
          onClick={() => setActiveTab("invoices")}
          className="flex items-center space-x-2"
        >
          <Receipt className="h-4 w-4" />
          <span>Invoices</span>
        </Button>
        <Button
          variant={activeTab === "insurance" ? "default" : "ghost"}
          onClick={() => setActiveTab("insurance")}
          className="flex items-center space-x-2"
        >
          <FileText className="h-4 w-4" />
          <span>Insurance Claims</span>
        </Button>
      </div>

      {/* Payments Tab */}
      {activeTab === "payments" && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Records
              </CardTitle>
              <CardDescription>
                {filteredPayments.length} payment records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient & Service</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.patientName}</p>
                          <p className="text-sm text-muted-foreground">{payment.service}</p>
                          <p className="text-xs text-muted-foreground">ID: {payment.patientId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{payment.department}</TableCell>
                      <TableCell className="font-medium">₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span>{getPaymentMethodIcon(payment.paymentMethod)}</span>
                          <span className="capitalize">{payment.paymentMethod.replace("_", " ")}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{payment.transactionId}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {format(payment.date, "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="mr-2 h-5 w-5" />
              Invoice Management
            </CardTitle>
            <CardDescription>
              {invoices.length} invoices generated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.patientName}</TableCell>
                    <TableCell>{format(invoice.date, "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(invoice.dueDate, "MMM d, yyyy")}</TableCell>
                    <TableCell className="font-medium">₹{invoice.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getInvoiceStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Insurance Claims Tab */}
      {activeTab === "insurance" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Insurance Claims
            </CardTitle>
            <CardDescription>
              {insuranceClaims.length} insurance claims
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim Number</TableHead>
                  <TableHead>Patient & Provider</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {insuranceClaims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-mono">{claim.claimNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{claim.patientName}</p>
                        <p className="text-sm text-muted-foreground">{claim.provider}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-48 truncate">{claim.description}</TableCell>
                    <TableCell className="font-medium">₹{claim.amount.toLocaleString()}</TableCell>
                    <TableCell>{format(claim.submissionDate, "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      <Badge className={getClaimStatusColor(claim.status)}>
                        {claim.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HospitalPayments;