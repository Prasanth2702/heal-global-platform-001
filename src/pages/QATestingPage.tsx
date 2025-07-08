import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SampleDataManager from "@/components/qa/SampleDataManager";
import BugTracker from "@/components/qa/BugTracker";
import BetaFeedback from "@/components/qa/BetaFeedback";
import GoLiveChecklist from "@/components/qa/GoLiveChecklist";
import SEOHead from "@/components/seo/SEOHead";

const QATestingPage = () => {
  return (
    <>
      <SEOHead 
        title="QA Testing Environment - NextGen Medical Platform"
        description="Comprehensive testing environment for quality assurance, bug tracking, feedback collection, and go-live preparation"
        keywords="QA testing, bug tracking, feedback collection, go-live checklist, quality assurance, medical platform testing"
      />
      
      <DashboardLayout userType="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">QA Testing Environment</h1>
            <p className="text-muted-foreground">
              Comprehensive testing suite for quality assurance, bug tracking, and go-live preparation
            </p>
          </div>

          <Tabs defaultValue="sample-data" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sample-data">Sample Data</TabsTrigger>
              <TabsTrigger value="bug-tracker">Bug Tracker</TabsTrigger>
              <TabsTrigger value="feedback">Beta Feedback</TabsTrigger>
              <TabsTrigger value="go-live">Go-Live Checklist</TabsTrigger>
            </TabsList>

            <TabsContent value="sample-data">
              <SampleDataManager />
            </TabsContent>

            <TabsContent value="bug-tracker">
              <BugTracker />
            </TabsContent>

            <TabsContent value="feedback">
              <BetaFeedback />
            </TabsContent>

            <TabsContent value="go-live">
              <GoLiveChecklist />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
};

export default QATestingPage;