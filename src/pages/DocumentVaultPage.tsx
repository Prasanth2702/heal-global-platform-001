import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentVault from "@/components/vault/DocumentVault";
import VaultSettings from "@/components/vault/VaultSettings";

const DocumentVaultPage = () => {
  return (
    <DashboardLayout userType="patient">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Secure Document Vault</h1>
          <p className="text-muted-foreground">
            HIPAA-compliant encrypted storage for your medical records with AI-powered insights
          </p>
        </div>

        <Tabs defaultValue="vault" className="space-y-6">
          <TabsList>
            <TabsTrigger value="vault">My Vault</TabsTrigger>
            <TabsTrigger value="settings">Vault Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="vault">
            <DocumentVault />
          </TabsContent>

          <TabsContent value="settings">
            <VaultSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DocumentVaultPage;