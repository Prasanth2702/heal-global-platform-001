// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Upload, Camera, Calendar, Clock, Check, ArrowRight, ArrowLeft, Telescope } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
// import { User as SupabaseUser } from '@supabase/supabase-js';
// import { useEffect } from "react";

// const OnboardingWizard = () => {
//   const navigate = useNavigate();
//   const { userType } = useParams();
//   const { toast } = useToast();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
//   const [profileImage, setProfileImage] = useState<string>("");
//   const [user, setUser] = useState<SupabaseUser>(null);


//   const [selectedDay, setSelectedDay] = useState<string>('Monday');
//   const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//   const [slotsByDay, setSlotsByDay] = useState<{ [key: string]: { clinic: string[], tele: string[] } }>(
//     () =>
//       daysOfWeek.reduce(
//         (acc, day) => ({
//           ...acc,
//           [day]: { clinic: [], tele: [] }
//         }),
//         {}
//       )
//   );
//   const [selectedType, setSelectedType] = useState<'Clinic' | 'Tele'>('Clinic');
//   const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];




//   useEffect(() => {
//     const checkUser = async () => {
//       const {
//         data: { user },
//         error: userError
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         toast({
//           title: "User not authenticated",
//           description: "Please log in to update your profile image.",
//         });
//         return;
//       }
//       setUser(user);
//     };

//     checkUser();
//   }, []);

//   const buildSlotData = (slotsByDay, doctorId, facilityId = null) => {
//     let rows = [];
//     Object.entries(slotsByDay).forEach(([weekday, slotObj]) => {
//       Object.entries(slotObj).forEach(([slotType, slots]) => {
//         slots.forEach(start => {
//           rows.push({
//             doctor_id: doctorId,
//             facility_id: facilityId,
//             day_of_week: weekday, 
//             start_time: start,
//             end_time: `${String(Number(start.split(':')[0]) + 1).padStart(2, '0')}:${start.split(':')[1]}`,
//             is_available: true,
//             slot_type: slotType
//           });
//         });
//       });
//     });
//     return rows;
//   };

//   const updateDoctorTimeslots = async ({
//     doctorId,
//     facilityId = null
//   }) => {
//     const rows = buildSlotData(slotsByDay, doctorId, facilityId);

//     const { error } = await supabase
//       .from('time_slots')
//       .insert(rows);

//     if (error) {
//       toast({
//         title: "Failed to save timeslots",
//         description: error.message,
//       });
//       return false;
//     }
//     return true;
//   };



//   const userTypeConfig = {
//     patient: {
//       title: "Complete Your Patient Profile",
//       totalSteps: 3,
//       steps: [
//         { title: "Upload ID & Insurance", description: "Add your identification and insurance documents" },
//         { title: "Profile Picture", description: "Add a profile picture for easy identification" },
//         { title: "Preferences", description: "Set your communication and appointment preferences" }
//       ],
//       finalRoute: "/dashboard/patient"
//     },
//     doctor: {
//       title: "Complete Your Professional Profile",
//       totalSteps: 4,
//       steps: [
//         { title: "Upload License & Certificates", description: "Add your medical license and certifications" },
//         { title: "Profile Picture", description: "Add a professional profile picture" },
//         { title: "Schedule & Availability", description: "Set your working hours and availability" },
//         { title: "Calendar Integration", description: "Connect your Google Calendar or use our system" }
//       ],
//       finalRoute: "/dashboard/doctor"
//     },
//     facility: {
//       title: "Complete Your Facility Setup",
//       totalSteps: 4,
//       steps: [
//         { title: "Upload Facility Documents", description: "Add license, certifications, and facility images" },
//         { title: "Facility Photos", description: "Add photos of your facility for patients" },
//         { title: "Staff & Departments", description: "Add staff members and department information" },
//         { title: "Operating Schedule", description: "Set facility hours and appointment slots" }
//       ],
//       finalRoute: "/dashboard/facility"
//     }
//   };

//   const config = userTypeConfig[userType as keyof typeof userTypeConfig] || userTypeConfig.patient;
//   const progress = (currentStep / config.totalSteps) * 100;

//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (!files) return;
//     for (let file of files) {
//       const filePath = `medical_documents/${Date.now()}_${file.name}`;
//       const { data, error } = await supabase
//         .storage
//         .from('heal_med_app_files_bucket')
//         .upload(filePath, file, {
//           cacheControl: '3600',
//           upsert: false
//         });

//       if (error) {
//         toast({
//           title: "Uploading of the file failed",
//           description: error.message,
//         });
//         return;
//       }
//       else {
//         toast({
//           title: "Files Uploaded",
//           description: `file(s) uploaded successfully.`,
//         });
//       }
//     }
//   };

//   const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const filePath = `profile_images/${Date.now()}_${file.name}`;
//     const { error: uploadError } = await supabase
//       .storage
//       .from('heal_med_app_images_bucket')
//       .upload(filePath, file);

//     if (uploadError) {
//       toast({
//         title: "Uploading of the profile picture failed",
//         description: uploadError.message,
//       });
//       return;
//     }

//     const { data: publicUrlData } = supabase
//       .storage
//       .from('heal_med_app_images_bucket')
//       .getPublicUrl(filePath);

//     const publicUrl = publicUrlData?.publicUrl;

//     setProfileImage(publicUrl);

//     const { error: updateError } = await supabase
//       .from('profiles')
//       .update({ avatar_url: publicUrl })
//       .eq('user_id', user.id);

//     if (updateError) {
//       toast({
//         title: "Failed to save the profile picture",
//         description: updateError.message,
//       });
//       return;
//     }

//     console.log("after setting profile" + profileImage);

//     toast({
//       title: "Profile Picture Updated",
//       description: "Your profile picture has been uploaded and saved.",
//     });
//   };

//   const nextStep = async () => {
//     if (currentStep === 3 && userType === "doctor") {

//       if (!user?.id) {
//         toast({ title: "User error", description: "User id missing." });
//         return;
//       }
//       const doctorId = user.id;

//       const success = await updateDoctorTimeslots({
//         doctorId,
//         facilityId: null
//       });

//       if (!success) return;
//     }


//     if (currentStep < config.totalSteps) {
//       setCurrentStep(currentStep + 1);
//     } else {
//       toast({
//         title: "Onboarding Complete!",
//         description: "Welcome to NextGen Medical Platform. Redirecting to your dashboard...",
//       });
//       setTimeout(() => {
//         navigate(config.finalRoute);
//       }, 2000);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             <div className="text-center">
//               <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//               <h3 className="text-lg font-semibold mb-2">{config.steps[0].title}</h3>
//               <p className="text-muted-foreground">{config.steps[0].description}</p>
//             </div>

//             <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
//               <Input
//                 type="file"
//                 multiple
//                 accept=".pdf,.jpg,.jpeg,.png"
//                 onChange={handleFileUpload}
//                 className="hidden"
//                 id="document-upload"
//               />
//               <Label htmlFor="document-upload" className="cursor-pointer">
//                 <Upload className="mx-auto h-8 w-8 mb-2 text-muted-foreground" />
//                 <p className="text-sm text-muted-foreground">
//                   Click to upload documents or drag and drop
//                 </p>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   PDF, JPG, PNG up to 10MB each
//                 </p>
//               </Label>
//             </div>

//             {uploadedDocs.length > 0 && (
//               <div>
//                 <h4 className="font-medium mb-2">Uploaded Documents:</h4>
//                 <ul className="space-y-1">
//                   {uploadedDocs.map((doc, index) => (
//                     <li key={index} className="flex items-center text-sm">
//                       <Check className="h-4 w-4 text-green-500 mr-2" />
//                       {doc}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-6">
//             <div className="text-center">
//               <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//               <h3 className="text-lg font-semibold mb-2">{config.steps[1].title}</h3>
//               <p className="text-muted-foreground">{config.steps[1].description}</p>
//             </div>

//             <div className="flex flex-col items-center space-y-4">
//               {profileImage ? (
//                 <div className="relative">
//                   <img
//                     src={profileImage}
//                     alt="Profile"
//                     className="w-32 h-32 rounded-full object-cover border-4 border-primary"
//                   />
//                   <Button
//                     size="sm"
//                     className="absolute bottom-0 right-0 rounded-full"
//                     onClick={() => document.getElementById('profile-upload')?.click()}
//                   >
//                     <Camera className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="w-32 h-32 rounded-full border-2 border-dashed border-border flex items-center justify-center">
//                   <Camera className="h-8 w-8 text-muted-foreground" />
//                 </div>
//               )}

//               <Input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleProfileImageUpload}
//                 className="hidden"
//                 id="profile-upload"
//               />
//               <Button
//                 variant="outline"
//                 onClick={() => document.getElementById('profile-upload')?.click()}
//               >
//                 {profileImage ? 'Change Picture' : 'Upload Picture'}
//               </Button>
//             </div>
//           </div>
//         );

//       case 3:
//         return (
//           <div className="space-y-6">
//             <div className="text-center">
//               <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//               <h3 className="text-lg font-semibold mb-2">{config.steps[2].title}</h3>
//               <p className="text-muted-foreground">{config.steps[2].description}</p>
//             </div>

//             {userType === "doctor" && (
//               <div className="space-y-4">
//                 <div>
//                   <Label>Working Days</Label>
//                   <div className="flex gap-2 mt-2">
//                     {daysOfWeek.map(day => (
//                       <Button
//                         key={day}
//                         variant={selectedDay === day ? "default" : "outline"}
//                         size="sm"
//                         className="text-xs"
//                         onClick={() => setSelectedDay(day)}
//                       >
//                         {day.slice(0, 3)}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <Label>Consultation Type</Label>
//                   <div className="grid grid-cols-2 gap-4 mt-2">
//                     {['Clinic', 'Tele'].map(type => (
//                       <Button
//                         key={type}
//                         variant={selectedType === type ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => setSelectedType(type as 'Clinic' | 'Tele')}
//                       >
//                         {type === 'Tele' ? 'Tele-Consultation' : 'Clinic Consultation'}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="mt-4">
//                   <Label>Choose Timeslots</Label>
//                   <div className="grid grid-cols-3 gap-2 mt-2">
//                     {timeSlots.map(slot => (
//                       <Button
//                         key={slot}
//                         variant={
//                           slotsByDay[selectedDay][selectedType.toLowerCase()].includes(slot)
//                             ? "default"
//                             : "outline"
//                         }
//                         size="sm"
//                         className="text-xs"
//                         onClick={() => {
//                           const daySlots = slotsByDay[selectedDay][selectedType.toLowerCase()];
//                           if (daySlots.includes(slot)) {
//                             setSlotsByDay(prev => ({
//                               ...prev,
//                               [selectedDay]: {
//                                 ...prev[selectedDay],
//                                 [selectedType.toLowerCase()]: daySlots.filter(s => s !== slot)
//                               }
//                             }));
//                           } else if (
//                             !slotsByDay[selectedDay][selectedType === 'Clinic' ? 'tele' : 'clinic'].includes(slot)
//                           ) {
//                             setSlotsByDay(prev => ({
//                               ...prev,
//                               [selectedDay]: {
//                                 ...prev[selectedDay],
//                                 [selectedType.toLowerCase()]: [...daySlots, slot]
//                               }
//                             }));
//                           }
//                         }}
//                         disabled={
//                           slotsByDay[selectedDay][selectedType === 'Clinic' ? 'tele' : 'clinic'].includes(slot)
//                         }
//                       >
//                         {slot}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>

//               </div>
//             )}
//           </div>
//         );

//       // case 4:
//       //   return (
//       //     <div className="space-y-6">
//       //       <div className="text-center">
//       //         <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//       //         <h3 className="text-lg font-semibold mb-2">{config.steps[3]?.title}</h3>
//       //         <p className="text-muted-foreground">{config.steps[3]?.description}</p>
//       //       </div>

//       //       <div className="space-y-4">
//       //         <Card>
//       //           <CardContent className="p-4">
//       //             <div className="flex items-center justify-between">
//       //               <div>
//       //                 <h4 className="font-medium">Google Calendar</h4>
//       //                 <p className="text-sm text-muted-foreground">Sync with your existing calendar</p>
//       //               </div>
//       //               <Button variant="outline">Connect</Button>
//       //             </div>
//       //           </CardContent>
//       //         </Card>

//       //         <Card>
//       //           <CardContent className="p-4">
//       //             <div className="flex items-center justify-between">
//       //               <div>
//       //                 <h4 className="font-medium">NextGen Calendar</h4>
//       //                 <p className="text-sm text-muted-foreground">Use our built-in appointment system</p>
//       //               </div>
//       //               <Button variant="default">Use Built-in</Button>
//       //             </div>
//       //           </CardContent>
//       //         </Card>
//       //       </div>
//       //     </div>
//       //   );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-4">
//       <Card className="w-full max-w-2xl">
//         <CardHeader>
//           <div className="flex items-center justify-between mb-4">
//             <Button variant="ghost" onClick={() => navigate("/")} size="sm">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to Home
//             </Button>
//             <span className="text-sm text-muted-foreground">
//               Step {currentStep} of {config.totalSteps}
//             </span>
//           </div>

//           <CardTitle className="text-center">{config.title}</CardTitle>
//           <div className="space-y-2">
//             <Progress value={progress} className="w-full" />
//             <p className="text-center text-sm text-muted-foreground">
//               {Math.round(progress)}% Complete
//             </p>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {renderStepContent()}

//           <div className="flex justify-between pt-6">
//             <Button
//               variant="outline"
//               onClick={prevStep}
//               disabled={currentStep === 1}
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Previous
//             </Button>

//             <Button onClick={nextStep}>
//               {currentStep === config.totalSteps ? 'Complete Setup' : 'Next Step'}
//               {currentStep < config.totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default OnboardingWizard;

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// PDF Upload Loader Component
const PDFLoader = () => {
  return (
    <>
      <style>{`
        .pdf-loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(145deg, #ffffff, #f5f5f5);
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .pdf-icon {
          width: 64px;
          height: 64px;
          color: #e74c3c;
          animation: bounce 2s infinite;
          margin-bottom: 15px;
        }

        .loading-bar {
          width: 200px;
          height: 6px;
          background: #e0e0e0;
          border-radius: 10px;
          overflow: hidden;
          margin: 10px 0;
        }

        .loading-progress {
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, #e74c3c, #3498db);
          border-radius: 10px;
          animation: loading 1.5s infinite ease-in-out;
        }

        .loading-text {
          color: #666;
          font-size: 14px;
          font-weight: 500;
          margin-top: 10px;
          animation: pulse 1.5s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      
      <div className="pdf-loader-container">
        <div className="pdf-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
        <div className="loading-text">Processing PDF...</div>
      </div>
    </>
  );
};

// Success Popup Component
const SuccessPopup = ({ isOpen, onClose, userType }) => {
  const config = {
    patient: {
      title: "Welcome to Your Patient Dashboard! 🏥",
      message: "Your profile has been successfully created. You can now book appointments, access your medical records, and connect with healthcare providers.",
      features: [
        "Book appointments with specialists",
        "Access your medical history",
        "Secure messaging with doctors",
        "Prescription management"
      ]
    },
    doctor: {
      title: "Welcome to Your Doctor Dashboard! 👨‍⚕️",
      message: "Your professional profile is now active. Start managing your schedule, accepting appointments, and providing care to patients.",
      features: [
        "Manage your availability",
        "View patient appointments",
        "Access patient records",
        "Tele-consultation ready"
      ]
    },
    facility: {
      title: "Welcome to Your Facility Dashboard! 🏥",
      message: "Your facility is now registered. Start managing departments, staff, and patient appointments.",
      features: [
        "Manage multiple departments",
        "Staff coordination",
        "Facility scheduling",
        "Patient management"
      ]
    }
  };

  const currentConfig = config[userType] || config.patient;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-green-600">
            {currentConfig.title}
          </DialogTitle>
          <DialogDescription className="text-center pt-4">
            {currentConfig.message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center my-4">
          <div className="bg-green-100 rounded-full p-3">
            <Check className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 my-2">
          <h4 className="font-semibold mb-2 text-sm text-gray-700">What's next?</h4>
          <ul className="space-y-2">
            {currentConfig.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center mt-4">
          <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
            Go to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { userType } = useParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  // const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");
  const [user, setUser] = useState<SupabaseUser>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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
      totalSteps: 3,
      steps: [
        { title: "Upload Facility Documents", description: "Add license, certifications, and facility images" },
        { title: "Facility Photos", description: "Add photos of your facility for patients" },
        // { title: "Staff & Departments", description: "Add staff members and department information" },
        { title: "", description: "" }
      ],
      finalRoute: "/dashboard/facility"
    }
  };

  const config = userTypeConfig[userType as keyof typeof userTypeConfig] || userTypeConfig.patient;
  const progress = (currentStep / config.totalSteps) * 100;

  // const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (!files) return;
    
  //   setIsUploading(true);
    
  //   for (let file of files) {
  //     // Show PDF loader for PDF files
  //     if (file.type === 'application/pdf') {
  //       // Simulate processing time for demo
  //       await new Promise(resolve => setTimeout(resolve, 2000));
  //     }
      
  //     const filePath = `medical_documents/${Date.now()}_${file.name}`;
  //     const { data, error } = await supabase
  //       .storage
  //       .from('heal_med_app_files_bucket')
  //       .upload(filePath, file, {
  //         cacheControl: '3600',
  //         upsert: false
  //       });

  //     if (error) {
  //       toast({
  //         title: "Uploading of the file failed",
  //         description: error.message,
  //       });
  //       setIsUploading(false);
  //       return;
  //     }
  //     else {
  //       setUploadedDocs(prev => [...prev, file.name]);
  //       toast({
  //         title: "Files Uploaded",
  //         description: `file(s) uploaded successfully.`,
  //       });
  //     }
  //   }
    
  //   setIsUploading(false);
  // };
const [uploadedDocs, setUploadedDocs] = useState<Array<{name: string, type: 'patient' | 'doctor' | 'facility'}>>([]);

// Then update your handleFileUpload function
const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (!files) return;
  
  setIsUploading(true);
  
  for (let file of files) {
    // Show PDF loader for PDF files
    if (file.type === 'application/pdf') {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
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
      setIsUploading(false);
      return;
    }
    else {
      // Store the document with its type based on userType
      setUploadedDocs(prev => [...prev, { 
        name: file.name, 
        type: userType as 'patient' | 'doctor' | 'facility' 
      }]);
      toast({
        title: "Files Uploaded",
        description: `file(s) uploaded successfully.`,
      });
    }
  }
  
  setIsUploading(false);
};
  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

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
      setIsUploading(false);
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
      setIsUploading(false);
      return;
    }

    setIsUploading(false);

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
      // Show success popup instead of toast
      setShowSuccessPopup(true);
    }
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    navigate(config.finalRoute);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  // Create a reusable DocumentBadge component
const DocumentBadge = ({ fileName }: { fileName: string }) => {
  const isPDF = fileName.toLowerCase().endsWith('.pdf');
  
  return (
    <div className="group relative">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border ${
        isPDF 
          ? 'bg-red-50 text-red-700 border-red-200' 
          : 'bg-green-50 text-green-700 border-green-200'
      }`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isPDF ? (
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          ) : (
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          )}
          <polyline points="14 2 14 8 20 8" />
          {!isPDF && <circle cx="9" cy="9" r="2" />}
          {!isPDF && <path d="m21 15-5-4-3 3-4-4-5 5" />}
        </svg>
        <span className="truncate max-w-[150px]">{fileName}</span>
        <Check className="h-3.5 w-3.5" />
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

  const renderStepContent = () => {
    if (isUploading) {
      return <PDFLoader />;
    }

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

            {/* {uploadedDocs.length > 0 && (
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
            )} */}
            {/* {uploadedDocs.length > 0 && (
  <div className="mt-6">
    <div className="flex items-center gap-2 mb-3">
      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
      <h4 className="text-sm font-medium">Uploaded Documents</h4>
    </div>
    
    <div className="flex flex-wrap gap-2">
      {uploadedDocs.map((doc, index) => (
        <div key={index} className="group relative">
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm border border-green-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
            <span className="truncate max-w-[150px]">{doc}</span>
            <Check className="h-3.5 w-3.5" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      ))}
    </div>
  </div>
)} */}
{uploadedDocs.length > 0 && (
  <div className="mt-6">
    <div className="flex items-center gap-2 mb-3">
      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
      <h4 className="text-sm font-medium">Uploaded Documents</h4>
    </div>
    
    {/* Separate documents by type */}
    {userType === 'patient' && (
      <div className="mb-4">
        <h5 className="text-xs font-semibold text-gray-500 mb-2">Patient Documents</h5>
        <div className="flex flex-wrap gap-2">
          {uploadedDocs.filter(doc => doc.type === 'patient').map((doc, index) => (
            <DocumentBadge key={index} fileName={doc.name} />
          ))}
        </div>
      </div>
    )}

    {userType === 'doctor' && (
      <div className="mb-4">
        <h5 className="text-xs font-semibold text-gray-500 mb-2">Doctor Documents</h5>
        <div className="flex flex-wrap gap-2">
          {uploadedDocs.filter(doc => doc.type === 'doctor').map((doc, index) => (
            <DocumentBadge key={index} fileName={doc.name} />
          ))}
        </div>
      </div>
    )}

    {userType === 'facility' && (
      <div className="mb-4">
        <h5 className="text-xs font-semibold text-gray-500 mb-2">Facility Documents</h5>
        <div className="flex flex-wrap gap-2">
          {uploadedDocs.filter(doc => doc.type === 'facility').map((doc, index) => (
            <DocumentBadge key={index} fileName={doc.name} />
          ))}
        </div>
      </div>
    )}
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
              {/* <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" /> */}
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

      default:
        return null;
    }
  };

  return (
    <>
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

            {!isUploading && (
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
            )}
          </CardContent>
        </Card>
      </div>

      <SuccessPopup 
        isOpen={showSuccessPopup}
        onClose={handleSuccessPopupClose}
        userType={userType}
      />
    </>
  );
};

export default OnboardingWizard;