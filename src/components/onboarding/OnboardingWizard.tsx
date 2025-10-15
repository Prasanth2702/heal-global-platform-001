import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Camera, Calendar, Clock, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { userType } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");

  const userTypeConfig = {
    patient: {
      title: "Complete Your Patient Profile",
      totalSteps: 3,
      steps: [
        { title: "Upload ID & Insurance", description: "Add your identification and insurance documents" },
        { title: "Profile Picture", description: "Add a profile picture for easy identification" },
        { title: "Preferences", description: "Set your communication and appointment preferences" }
      ],
      finalRoute: "/dashboard/patient"
    },
    doctor: {
      title: "Complete Your Professional Profile", 
      totalSteps: 4,
      steps: [
        { title: "Upload License & Certificates", description: "Add your medical license and certifications" },
        { title: "Profile Picture", description: "Add a professional profile picture" },
        { title: "Schedule & Availability", description: "Set your working hours and availability" },
        { title: "Calendar Integration", description: "Connect your Google Calendar or use our system" }
      ],
      finalRoute: "/dashboard/doctor"
    },
    facility: {
      title: "Complete Your Facility Setup",
      totalSteps: 4,
      steps: [
        { title: "Upload Facility Documents", description: "Add license, certifications, and facility images" },
        { title: "Facility Photos", description: "Add photos of your facility for patients" },
        { title: "Staff & Departments", description: "Add staff members and department information" },
        { title: "Operating Schedule", description: "Set facility hours and appointment slots" }
      ],
      finalRoute: "/dashboard/facility"
    }
  };

  const config = userTypeConfig[userType as keyof typeof userTypeConfig] || userTypeConfig.patient;
  const progress = (currentStep / config.totalSteps) * 100;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedDocs(prev => [...prev, ...fileNames]);
      toast({
        title: "Files Uploaded",
        description: `${fileNames.length} file(s) uploaded successfully.`,
      });
    }
  };

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const filePath = `profile_images/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase
      .storage
      .from('heal_med_app_images_bucket')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Uploading of the profile picture failed",
        description: uploadError.message,
      });
      return;
    }

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      toast({
        title: "User not authenticated",
        description: "Please log in to update your profile image.",
      });
      return;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('heal_med_app_images_bucket')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData?.publicUrl;

    setProfileImage(publicUrl);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('user_id', user.id);

    if (updateError) {
      toast({
        title: "Failed to save the profile picture",
        description: updateError.message,
      });
      return;
    }

    console.log("after setting profile" + profileImage);

    toast({
      title: "Profile Picture Updated",
      description: "Your profile picture has been uploaded and saved.",
    });
  };

  const nextStep = () => {
    if (currentStep < config.totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Onboarding Complete!",
        description: "Welcome to NextGen Medical Platform. Redirecting to your dashboard...",
      });
      setTimeout(() => {
        navigate(config.finalRoute);
      }, 2000);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{config.steps[0].title}</h3>
              <p className="text-muted-foreground">{config.steps[0].description}</p>
            </div>
            
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="document-upload"
              />
              <Label htmlFor="document-upload" className="cursor-pointer">
                <Upload className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload documents or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, JPG, PNG up to 10MB each
                </p>
              </Label>
            </div>

            {uploadedDocs.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Uploaded Documents:</h4>
                <ul className="space-y-1">
                  {uploadedDocs.map((doc, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{config.steps[1].title}</h3>
              <p className="text-muted-foreground">{config.steps[1].description}</p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              {profileImage ? (
                <div className="relative">
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                  />
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full"
                    onClick={() => document.getElementById('profile-upload')?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-border flex items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
              )}

              <Input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
                id="profile-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('profile-upload')?.click()}
              >
                {profileImage ? 'Change Picture' : 'Upload Picture'}
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{config.steps[2].title}</h3>
              <p className="text-muted-foreground">{config.steps[2].description}</p>
            </div>

            {userType === "doctor" && (
              <div className="space-y-4">
                <div>
                  <Label>Working Hours</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="start-time" className="text-sm">Start Time</Label>
                      <Input id="start-time" type="time" defaultValue="09:00" />
                    </div>
                    <div>
                      <Label htmlFor="end-time" className="text-sm">End Time</Label>
                      <Input id="end-time" type="time" defaultValue="17:00" />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Working Days</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <Button key={day} variant="outline" size="sm" className="text-xs">
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{config.steps[3]?.title}</h3>
              <p className="text-muted-foreground">{config.steps[3]?.description}</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Google Calendar</h4>
                      <p className="text-sm text-muted-foreground">Sync with your existing calendar</p>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">NextGen Calendar</h4>
                      <p className="text-sm text-muted-foreground">Use our built-in appointment system</p>
                    </div>
                    <Button variant="default">Use Built-in</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => navigate("/")} size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {config.totalSteps}
            </span>
          </div>
          
          <CardTitle className="text-center">{config.title}</CardTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <Button onClick={nextStep}>
              {currentStep === config.totalSteps ? 'Complete Setup' : 'Next Step'}
              {currentStep < config.totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingWizard;