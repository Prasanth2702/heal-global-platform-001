import DashboardLayout from "@/components/layouts/DashboardLayout";
import ApiKeyManager from "@/components/settings/ApiKeyManager";

const ApiSetupPage = () => {
  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">API Configuration</h1>
          <p className="text-muted-foreground">
            Set up your API keys to enable all AI-powered features
          </p>
        </div>
        <ApiKeyManager />
      </div>
    </DashboardLayout>
  );
};

export default ApiSetupPage;