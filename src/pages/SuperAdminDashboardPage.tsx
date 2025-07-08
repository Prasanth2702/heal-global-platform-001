import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SuperAdminDashboard from "@/components/dashboards/SuperAdminDashboard";
import CarouselManager from "@/components/admin/CarouselManager";
import SEOHead from "@/components/seo/SEOHead";

const SuperAdminDashboardPage = () => {
  return (
    <>
      <SEOHead 
        title="Super Admin Dashboard - NextGen Medical Platform"
        description="Super admin dashboard for managing the NextGen Medical Platform"
        keywords="super admin, dashboard, medical platform management"
      />
      
      <DashboardLayout userType="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive platform management and administration
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="carousel">Hero Carousel</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <SuperAdminDashboard />
            </TabsContent>

            <TabsContent value="carousel">
              <CarouselManager />
            </TabsContent>

            <TabsContent value="analytics">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
};

export default SuperAdminDashboardPage;