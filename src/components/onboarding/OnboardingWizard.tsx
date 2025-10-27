import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Camera, Calendar, Clock, Check, ArrowRight, ArrowLeft, Telescope } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useEffect } from "react";

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { userType } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");
  const [user, setUser] = useState<SupabaseUser>(null);


  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [slotsByDay, setSlotsByDay] = useState<{ [key: string]: { clinic: string[], tele: string[] } }>(
    () =>
      daysOfWeek.reduce(
        (acc, day) => ({
          ...acc,
          [day]: { clinic: [], tele: [] }
        }),
        {}
      )
  );
  const [selectedType, setSelectedType] = useState<'Clinic' | 'Tele'>('Clinic');
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];




  useEffect(() => {
    const checkUser = async () => {
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
      setUser(user);
    };

    checkUser();
  }, []);

  const buildSlotData = (slotsByDay, doctorId, facilityId = null) => {
    let rows = [];
    Object.entries(slotsByDay).forEach(([weekday, slotObj]) => {
      Object.entries(slotObj).forEach(([slotType, slots]) => {
        slots.forEach(start => {
          rows.push({
            doctor_id: doctorId,
            facility_id: facilityId,
            day_of_week: weekday, 
            start_time: start,
            end_time: `${String(Number(start.split(':')[0]) + 1).padStart(2, '0')}:${start.split(':')[1]}`,
            is_available: true,
            slot_type: slotType
          });
        });
      });
    });
    return rows;
  };

  const updateDoctorTimeslots = async ({
    doctorId,
    facilityId = null
  }) => {
    const rows = buildSlotData(slotsByDay, doctorId, facilityId);

    const { error } = await supabase
      .from('time_slots')
      .insert(rows);

    if (error) {
      toast({
        title: "Failed to save timeslots",
        description: error.message,
      });
      return false;
    }
    return true;
  };



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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    for (let file of files) {
      const filePath = `medical_documents/${Date.now()}_${file.name}`;
      const { data, error } = await supabase
        .storage
        .from('heal_med_app_files_bucket')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        toast({
          title: "Uploading of the file failed",
          description: error.message,
        });
        return;
      }
      else {
        toast({
          title: "Files Uploaded",
          description: `file(s) uploaded successfully.`,
        });
      }
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

  const nextStep = async () => {
    if (currentStep === 3 && userType === "doctor") {

      if (!user?.id) {
        toast({ title: "User error", description: "User id missing." });
        return;
      }
      const doctorId = user.id;

      const success = await updateDoctorTimeslots({
        doctorId,
        facilityId: null
      });

      if (!success) return;
    }


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
                  <Label>Working Days</Label>
                  <div className="flex gap-2 mt-2">
                    {daysOfWeek.map(day => (
                      <Button
                        key={day}
                        variant={selectedDay === day ? "default" : "outline"}
                        size="sm"
                        className="text-xs"
                        onClick={() => setSelectedDay(day)}
                      >
                        {day.slice(0, 3)}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <Label>Consultation Type</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {['Clinic', 'Tele'].map(type => (
                      <Button
                        key={type}
                        variant={selectedType === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedType(type as 'Clinic' | 'Tele')}
                      >
                        {type === 'Tele' ? 'Tele-Consultation' : 'Clinic Consultation'}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <Label>Choose Timeslots</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {timeSlots.map(slot => (
                      <Button
                        key={slot}
                        variant={
                          slotsByDay[selectedDay][selectedType.toLowerCase()].includes(slot)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          const daySlots = slotsByDay[selectedDay][selectedType.toLowerCase()];
                          if (daySlots.includes(slot)) {
                            setSlotsByDay(prev => ({
                              ...prev,
                              [selectedDay]: {
                                ...prev[selectedDay],
                                [selectedType.toLowerCase()]: daySlots.filter(s => s !== slot)
                              }
                            }));
                          } else if (
                            !slotsByDay[selectedDay][selectedType === 'Clinic' ? 'tele' : 'clinic'].includes(slot)
                          ) {
                            setSlotsByDay(prev => ({
                              ...prev,
                              [selectedDay]: {
                                ...prev[selectedDay],
                                [selectedType.toLowerCase()]: [...daySlots, slot]
                              }
                            }));
                          }
                        }}
                        disabled={
                          slotsByDay[selectedDay][selectedType === 'Clinic' ? 'tele' : 'clinic'].includes(slot)
                        }
                      >
                        {slot}
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