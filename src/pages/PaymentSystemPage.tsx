import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentHub from "@/components/payments/PaymentHub";
import PaymentSettings from "@/components/payments/PaymentSettings";

const PaymentSystemPage = () => {
  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Multi-Mode Payment System</h1>
          <p className="text-muted-foreground">
            Comprehensive payment processing with Stripe, Razorpay, insurance claims, and wallet management
          </p>
        </div>

        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="payments">Payment Hub</TabsTrigger>
            <TabsTrigger value="settings">Payment Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="payments">
            <PaymentHub />
          </TabsContent>

          <TabsContent value="settings">
            <PaymentSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PaymentSystemPage;