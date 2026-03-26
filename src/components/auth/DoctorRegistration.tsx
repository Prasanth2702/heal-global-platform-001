// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useNavigate } from "react-router-dom";
// import { useToast } from "@/hooks/use-toast";
// import { usePopup } from '@/contexts/popup-context';
// import mixpanelInstance from "@/utils/mixpanel";
// import { 
//   User, Mail, Lock, Phone, MapPin, 
//   Stethoscope, GraduationCap, Award, 
//   Clock, Languages, IndianRupee, FileText,
//   ArrowLeft, ArrowRight, Heart, Shield, Sparkles,
//   Calendar, BookOpen, Briefcase, Camera, Upload, CheckCircle
// } from 'lucide-react';

// import AuthLayout from "./AuthLayout";
// import { MedicalProfessional } from "@/Models/MedicalProfessional";
// import { supabase } from "@/integrations/supabase/client";
// import '../../styles/form-input-styles.css';
// import { Country, State, City } from "country-state-city";
// import { Progress } from "@/components/ui/progress";

// const countryCodes = [
//   { code: '+1', country: 'US', flag: '🇺🇸' },
//   { code: '+44', country: 'UK', flag: '🇬🇧' },
//   { code: '+91', country: 'India', flag: '🇮🇳' },
//   { code: '+61', country: 'Australia', flag: '🇦🇺' },
//   { code: '+81', country: 'Japan', flag: '🇯🇵' },
//   { code: '+49', country: 'Germany', flag: '🇩🇪' },
//   { code: '+33', country: 'France', flag: '🇫🇷' },
//   { code: '+86', country: 'China', flag: '🇨🇳' },
//   { code: '+7', country: 'Russia', flag: '🇷🇺' },
//   { code: '+55', country: 'Brazil', flag: '🇧🇷' },
//   { code: '+971', country: 'UAE', flag: '🇦🇪' },
//   { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
// ];

// // PDF Loader Component
// const PDFLoader = () => {
//   return (
//     <>
//       <style>{`
//         .pdf-loader-container {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           padding: 20px;
//           background: linear-gradient(145deg, #ffffff, #f5f5f5);
//           border-radius: 12px;
//           box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
//         }
//         .pdf-icon {
//           width: 64px;
//           height: 64px;
//           color: #e74c3c;
//           animation: bounce 2s infinite;
//           margin-bottom: 15px;
//         }
//         .loading-bar {
//           width: 200px;
//           height: 6px;
//           background: #e0e0e0;
//           border-radius: 10px;
//           overflow: hidden;
//           margin: 10px 0;
//         }
//         .loading-progress {
//           width: 50%;
//           height: 100%;
//           background: linear-gradient(90deg, #e74c3c, #3498db);
//           border-radius: 10px;
//           animation: loading 1.5s infinite ease-in-out;
//         }
//         @keyframes bounce {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-10px); }
//         }
//         @keyframes loading {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(200%); }
//         }
//       `}</style>
//       <div className="pdf-loader-container">
//         <div className="pdf-icon">
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//             <polyline points="14 2 14 8 20 8" />
//             <line x1="16" y1="13" x2="8" y2="13" />
//             <line x1="16" y1="17" x2="8" y2="17" />
//             <polyline points="10 9 9 9 8 9" />
//           </svg>
//         </div>
//         <div className="loading-bar">
//           <div className="loading-progress"></div>
//         </div>
//         <div className="loading-text">Processing PDF...</div>
//       </div>
//     </>
//   );
// };

// // Success Popup Component
// const SuccessPopup = ({ isOpen, onClose, userType }) => {
//   const config = {
//     doctor: {
//       title: "Welcome to Your Doctor Dashboard! 👨‍⚕️",
//       message: "Your professional profile is now active. Start managing your schedule, accepting appointments, and providing care to patients.",
//       features: [
//         "Manage your availability",
//         "View patient appointments",
//         "Access patient records",
//         "Tele-consultation ready"
//       ]
//     }
//   };

//   const currentConfig = config[userType] || config.doctor;

//   return (
//     <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
//       <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
//       <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
//         <div className="text-center">
//           <div className="flex justify-center mb-4">
//             <div className="bg-green-100 rounded-full p-3">
//               <CheckCircle className="h-12 w-12 text-green-600" />
//             </div>
//           </div>
//           <h2 className="text-2xl font-bold text-green-600 mb-2">{currentConfig.title}</h2>
//           <p className="text-gray-600 mb-4">{currentConfig.message}</p>
//           <div className="bg-gray-50 rounded-lg p-4 mb-4">
//             <h4 className="font-semibold mb-2">What's next?</h4>
//             <ul className="space-y-2">
//               {currentConfig.features.map((feature, index) => (
//                 <li key={index} className="flex items-center text-sm text-gray-600">
//                   <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                   {feature}
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
//             Go to Dashboard
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DoctorRegistration = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { openPopup } = usePopup();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [password, setPassword] = useState('');
//   const [repeatPassword, setRepeatPassword] = useState('');
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [kycAccepted, setKycAccepted] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [countryCode, setCountryCode] = useState('+91');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [countries] = useState(Country.getAllCountries());
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [profileImage, setProfileImage] = useState<string>("");
//   const [uploadedDocs, setUploadedDocs] = useState<Array<{name: string, type: string}>>([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
//   // Time slot states
//   const [selectedDay, setSelectedDay] = useState<string>('Monday');
//   const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
//   const [slotsByDay, setSlotsByDay] = useState<{ [key: string]: { clinic: string[], tele: string[] } }>(
//     () => daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: { clinic: [], tele: [] } }), {})
//   );
//   const [selectedType, setSelectedType] = useState<'Clinic' | 'Tele'>('Clinic');
//   const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

//   const [formData, setFormData] = useState<MedicalProfessional>({
//     firstName: "",
//     lastName: "",
//     emailAddress: "",
//     phoneNumber: "",
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     medicalSpeciality: "",
//     licenseNumber: "",
//     graduationYear: new Date().getFullYear(),
//     medicalSchool: "",
//     yearsOfExperience: 0,
//     languagesKnown: "",
//     consultationFees: 0,
//     additionalQualifications: "",
//     aboutYourself: "",
//     kycVerified: false,
//     isVerified: true,
//     country_code: "India",
//   });

//   const specialties = [
//     "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
//     "Orthopedic", "Pediatrician", "Gynecologist", "Psychiatrist",
//     "Dentist", "Physiotherapist", "Dietician", "Ayurveda Practitioner",
//     "Homeopath", "Psychologist", "ENT Specialist", "Ophthalmologist"
//   ];

//   // Calculate progress
//   const totalSteps = 6;
//   const progress = (currentStep / totalSteps) * 100;

//   useEffect(() => {
//     if (formData.country_code) {
//       const selectedCountry = countries.find(c => c.name === formData.country_code);
//       if (selectedCountry) {
//         const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
//         setStates(countryStates);
//         if (!countryStates.find(s => s.isoCode === formData.state)) {
//           setFormData(prev => ({ ...prev, state: '', city: '' }));
//           setCities([]);
//         }
//       } else {
//         setStates([]);
//         setCities([]);
//       }
//     } else {
//       setStates([]);
//       setCities([]);
//     }
//   }, [formData.country_code, countries]);

//   useEffect(() => {
//     if (formData.country_code && formData.state) {
//       const selectedCountry = countries.find(c => c.name === formData.country_code);
//       const selectedState = states.find(s => s.name === formData.state);
      
//       if (selectedCountry && selectedState) {
//         const countryCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
//         setCities(countryCities);
//         if (formData.city && !countryCities.find(c => c.name === formData.city)) {
//           setFormData(prev => ({ ...prev, city: '' }));
//         }
//       } else {
//         setCities([]);
//       }
//     } else {
//       setCities([]);
//     }
//   }, [formData.country_code, formData.state, countries, states]);

//   const validateStep1 = () => {
//     const errors: { [key: string]: string } = {};
//     let valid = true;

//     if (!formData.firstName) {
//       errors.firstName = "First name is required";
//       valid = false;
//     }

//     if (!formData.lastName) {
//       errors.lastName = "Last name is required";
//       valid = false;
//     }

//     if (!formData.emailAddress) {
//       errors.emailAddress = "Email is required";
//       valid = false;
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
//       errors.emailAddress = "Invalid email format";
//       valid = false;
//     }

//     if (!phoneNumber) {
//       errors.phoneNumber = "Phone number is required";
//       valid = false;
//     } else if (phoneNumber.length !== 10) {
//       errors.phoneNumber = "Phone number must be 10 digits";
//       valid = false;
//     } else if (!/^\d+$/.test(phoneNumber)) {
//       errors.phoneNumber = "Phone number must contain only digits";
//       valid = false;
//     }

//     const passwordError = validatePassword(password);
//     if (passwordError) {
//       errors.password = passwordError;
//       valid = false;
//     }

//     if (password !== repeatPassword) {
//       errors.repeatPassword = "Passwords do not match";
//       valid = false;
//     }

//     if (!termsAccepted || !kycAccepted) {
//       errors.terms = "Please accept terms and KYC verification";
//       valid = false;
//     }
//     setErrors(errors);
//     return valid;
//   };

//   const validateStep2 = () => {
//     const errors: { [key: string]: string } = {};
//     let valid = true;

//     if (!formData.address) {
//       errors.address = "Address is required";
//       valid = false;
//     }

//     if (!formData.city) {
//       errors.city = "City is required";
//       valid = false;
//     }

//     if (!formData.state) {
//       errors.state = "State is required";
//       valid = false;
//     }

//     if (!formData.pincode) {
//       errors.pincode = "Pincode is required";
//       valid = false;
//     }

//     setErrors(errors);
//     return valid;
//   };

//   const validateStep3 = () => {
//     const errors: { [key: string]: string } = {};
//     let valid = true;

//     if (!formData.medicalSpeciality) {
//       errors.medicalSpeciality = "Medical specialty is required";
//       valid = false;
//     }

//     if (!formData.licenseNumber) {
//       errors.licenseNumber = "License number is required";
//       valid = false;
//     }

//     if (!formData.graduationYear) {
//       errors.graduationYear = "Graduation year is required";
//       valid = false;
//     }

//     if (!formData.medicalSchool) {
//       errors.medicalSchool = "Medical school is required";
//       valid = false;
//     }

//     if (!formData.yearsOfExperience && formData.yearsOfExperience !== 0) {
//       errors.yearsOfExperience = "Years of experience is required";
//       valid = false;
//     }

//     if (!formData.languagesKnown) {
//       errors.languagesKnown = "Languages known is required";
//       valid = false;
//     }

//     setErrors(errors);
//     return valid;
//   };

//   const validatePassword = (password: string) => {
//     const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

//     if (!password) {
//       return "Password is required";
//     }

//     if (password.length < 6) {
//       return "Password must be at least 6 characters";
//     }

//     if (!passwordRegex.test(password)) {
//       return "Password must contain letter, number and special character";
//     }

//     return "";
//   };
//   const handleSignUp = async () => {
//   setIsSubmitting(true);
  
//   try {
//     const fullPhoneNumber = countryCode + phoneNumber;
    
//     const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
//       email: formData.emailAddress,
//       password: password,
//       options: {
//         data: {
//           firstName: formData.firstName,
//           lastName: formData.lastName,
//           phone_number: fullPhoneNumber,
//           role: 'doctor',
//         },
//       },
//     });

//     if (signUpError) {
//       toast({
//         title: 'Registration Failed',
//         description: signUpError.message,
//         variant: 'destructive',
//       });
//       setIsSubmitting(false);
//       return null;
//     }

//     const userId = signUpData.user?.id;
    
//     if (!userId) {
//       toast({
//         title: 'Registration Failed',
//         description: 'Could not retrieve user information',
//         variant: 'destructive',
//       });
//       setIsSubmitting(false);
//       return null;
//     }

//     // Check if profile exists
//     const { data: existingProfile, error: checkError } = await supabase
//       .from('profiles')
//       .select('id')
//       .eq('id', userId)
//       .maybeSingle();

//     let profileError;

//     // if (existingProfile) {
//       // Update existing profile
//       await supabase
//         .from('profiles')
//         .update({
//           first_name: formData.firstName,
//           last_name: formData.lastName,
//           phone_number: fullPhoneNumber,
//           role: 'doctor',
//         })
//         .eq('email',formData.emailAddress);
//       // profileError = error;
//     // } else {
//     //   // Insert new profile
//     //   const { error } = await supabase
//     //     .from('profiles')
//     //     .insert({
//     //       id: userId,
//     //       first_name: formData.firstName,
//     //       last_name: formData.lastName,
//     //       phone_number: fullPhoneNumber,
//     //       role: 'doctor',
//     //       email: formData.emailAddress,
//     //     });
//     //   profileError = error;
//     // }

//     if (profileError) {
//       console.error('Error saving profile:', profileError);
//       toast({
//         title: 'Profile Update Issue',
//         description: 'Your account was created but profile update had issues',
//         variant: 'destructive',
//       });
//     } else {
//       toast({
//         title: 'Account Created!',
//         description: 'Your basic account has been created. Please continue with the registration.',
//       });
//     }

//     setIsSubmitting(false);
//     return signUpData.user;
    
//   } catch (error) {
//     console.error('Error saving step 1:', error);
//     toast({
//       title: 'Error',
//       description: 'Failed to save personal information',
//       variant: 'destructive',
//     });
//     setIsSubmitting(false);
//     return null;
//   }
// };
// //   const handleSignUp = async () => {
// //   setIsSubmitting(true);
  
// //   try {
// //     const fullPhoneNumber = countryCode + phoneNumber;
    
// //     const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
// //       email: formData.emailAddress,
// //       password: password,
// //       options: {
// //         data: {
// //           firstName: formData.firstName,
// //           lastName: formData.lastName,
// //           phone_number: fullPhoneNumber,
// //           role: 'doctor',
// //         },
// //       },
// //     });

// //     if (signUpError) {
// //       toast({
// //         title: 'Registration Failed',
// //         description: signUpError.message,
// //         variant: 'destructive',
// //       });
// //       setIsSubmitting(false);
// //       return null;
// //     }

// //     const userId = signUpData.user?.id;

// //     // Update profile with additional info
// //   const { data: existingProfile, error: checkError } = await supabase
// //                   .from('profiles')
// //                   .select('id')
// //                   .eq('id', userId)
// //                   .maybeSingle();
            
// //     const { error: profileError } = await supabase
// //       .from('profiles')
// //       .update({
// //         first_name: formData.firstName,
// //         last_name: formData.lastName,
// //         phone_number: fullPhoneNumber,
// //         role: 'doctor',
// //       })
// //       .eq('id', userId);  // FIXED: Use id instead of email

// //     if (profileError) {
// //       console.error('Error updating profile:', profileError);
// //     }

// //     setIsSubmitting(false);
// //     return signUpData.user;  // FIXED: Return the user object
    
// //   } catch (error) {
// //     console.error('Error saving step 1:', error);
// //     toast({
// //       title: 'Error',
// //       description: 'Failed to save personal information',
// //       variant: 'destructive',
// //     });
// //     setIsSubmitting(false);
// //     return null;
// //   }
// // };
// //    const handleSignUp = async () => {
// //      setIsSubmitting(true);
    
// //     try {
// //     const fullPhoneNumber = countryCode + phoneNumber;
    
// //     const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
// //       email: formData.emailAddress,
// //       password: password,
// //       options: {
// //         data: {
// //           firstName: formData.firstName,
// //           lastName: formData.lastName,
// //           phone_number: fullPhoneNumber,
// //           role: 'doctor',
// //         },
// //       },
// //     });

// //     if (signUpError) {
// //       toast({
// //         title: 'Registration Failed',
// //         description: signUpError.message,
// //         variant: 'destructive',
// //       });
// //       return null;
// //     }
// // const userId = signUpData.user?.id;

// //     // Update profile with additional info
// //       const { data: existingProfile, error: checkError } = await supabase
// //             .from('profiles')
// //             .select('id')
// //             .eq('id', userId)
// //             .maybeSingle();
      
// //           let profileError;
      
// //           await supabase
// //                 .from('profiles')
// //                 .update({
// //           first_name: formData.firstName,
// //           last_name: formData.lastName,
// //           phone_number: fullPhoneNumber,
// //           role: 'doctor',
// //         })
// //         .eq('email', formData.emailAddress);

// //       if (profileError) {
// //         console.error('Error updating profile:', profileError);
// //       }

// // setIsSubmitting(false);
// //       return true;
// //      } catch (error) {
// //       console.error('Error saving step 1:', error);
// //       toast({
// //         title: 'Error',
// //         description: 'Failed to save personal information',
// //         variant: 'destructive',
// //       });
// //       setIsSubmitting(false);
// //       return false;
// //     }
// //   };
// // const handleSignUp = async () => {
// //   setIsSubmitting(true);
     
// //      try {
// //        const fullPhoneNumber = countryCode + phoneNumber;
       
// //        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
// //          email: formData.emailAddress.toLowerCase(),
// //          password: password,
// //          options: {
// //            data: {
// //              first_name: formData.firstName,
// //              last_name: formData.lastName,
// //              phone_number: fullPhoneNumber,
// //              avatar_url: profileImage,
// //              role: 'doctor',
// //            },
// //          },
// //        });
 
// //        if (signUpError) {
// //          toast({
// //            title: 'Registration Failed',
// //            description: signUpError.message,
// //            variant: 'destructive',
// //          });
// //          setIsSubmitting(false);
// //          return false;
// //        }
 
// //        const userId = signUpData.user?.id;
// //        if (!userId) {
// //          toast({
// //            title: 'Registration Failed',
// //            description: 'Could not retrieve user information',
// //            variant: 'destructive',
// //          });
// //          setIsSubmitting(false);
// //          return false;
// //        }
 
 
// //        // const { error: profileError } = await supabase
       
       
// //            // Update profile with additional info
// //              const { data: existingProfile, error: checkError } = await supabase
// //                    .from('profiles')
// //                    .select('id')
// //                    .eq('id', userId)
// //                    .maybeSingle();
             
// //                  let profileError;
 
// //                  await supabase
// //          .from('profiles')
// //          .update({
// //            first_name: formData.firstName,
// //            last_name: formData.lastName,
// //            phone_number: fullPhoneNumber,
// //            role: 'doctor',
// //          })
// //          .eq('id', userId);
 
// //        if (profileError) {
// //          console.error('Error updating profile:', profileError);
// //        }
 
// //        toast({
// //          title: 'Step 1 Completed',
// //          description: 'Personal information saved successfully!',
// //        });
       
// //        setIsSubmitting(false);
// //        return true;
       
// //      } catch (error) {
// //        console.error('Error saving step 1:', error);
// //        toast({
// //          title: 'Error',
// //          description: 'Failed to save personal information',
// //          variant: 'destructive',
// //        });
// //        setIsSubmitting(false);
// //        return false;
// //      }
// // };
// //   const handleSignUp = async () => {
// //     const fullPhoneNumber = countryCode + phoneNumber;
    
// //     const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
// //       email: formData.emailAddress,
// //       password: password,
// //       options: {
// //         data: {
// //           firstName: formData.firstName,
// //           lastName: formData.lastName,
// //           phone_number: fullPhoneNumber,
// //           role: 'doctor',
// //         },
// //       },
// //     });

// //     if (signUpError) {
// //       toast({
// //         title: 'Registration Failed',
// //         description: signUpError.message,
// //         variant: 'destructive',
// //       });
// //       return null;
// //     }
// // const userId = signUpData.user?.id;

// //     // Update profile with additional info
// //       const { data: existingProfile, error: checkError } = await supabase
// //             .from('profiles')
// //             .select('id')
// //             .eq('id', userId)
// //             .maybeSingle();
      
// //           let profileError;
      
// //           await supabase
// //                 .from('profiles')
// //                 .update({
// //           first_name: formData.firstName,
// //           last_name: formData.lastName,
// //           phone_number: fullPhoneNumber,
// //           role: 'doctor',
// //         })
// //         .eq('email', formData.emailAddress);

// //       if (profileError) {
// //         console.error('Error updating profile:', profileError);
// //       }


// //     return null;
// //   };
//   // Combine Step 2 and Step 3 into one function
// const handleSaveProfessionalInfo = async (user: any) => {
//   const fullPhoneNumber = countryCode + phoneNumber;
  
//   // Check if record exists first
//   const { data: existingRecord } = await supabase
//     .from('medical_professionals')
//     .select('user_id')
//     .eq('user_id', user.id)
//     .maybeSingle();

//   let medProfError;
  
//   if (existingRecord) {
//     // Update existing record
//     const { error } = await supabase
//       .from('medical_professionals')
//       .update({
//         medical_speciality: formData.medicalSpeciality,
//         license_number: formData.licenseNumber,
//         graduation_year: formData.graduationYear,
//         medical_school: formData.medicalSchool,
//         years_experience: formData.yearsOfExperience,
//         languages_known: formData.languagesKnown,
//         consultation_fee: formData.consultationFees,
//         education: formData.additionalQualifications,
//         about_yourself: formData.aboutYourself,
//         address: formData.address,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//         country_code: formData.country_code,
//       })
//       .eq('user_id', user.id);
//     medProfError = error;
//   } else {
//     // Insert new record
//     const { error } = await supabase
//       .from('medical_professionals')
//       .insert({
//         user_id: user.id,
//         medical_speciality: formData.medicalSpeciality,
//         license_number: formData.licenseNumber,
//         graduation_year: formData.graduationYear,
//         medical_school: formData.medicalSchool,
//         years_experience: formData.yearsOfExperience,
//         languages_known: formData.languagesKnown,
//         consultation_fee: formData.consultationFees,
//         education: formData.additionalQualifications,
//         about_yourself: formData.aboutYourself,
//         is_verified: formData.isVerified,
//         address: formData.address,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//         country_code: formData.country_code,
//       });
//     medProfError = error;
//   }

//   if (medProfError) {
//     console.error('Error saving medical professional:', medProfError);
//     toast({
//       title: 'Error',
//       description: 'Failed to save professional information',
//       variant: 'destructive',
//     });
//     return false;
//   }

//   return true;
// };

//   const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file || !userId) return;

//     setIsUploading(true);

//     const filePath = `profile_images/${Date.now()}_${file.name}`;
//     const { error: uploadError } = await supabase
//       .storage
//       .from('heal_med_app_images_bucket')
//       .upload(filePath, file);

//     if (uploadError) {
//       toast({
//         title: "Upload failed",
//         description: uploadError.message,
//         variant: "destructive",
//       });
//       setIsUploading(false);
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
//       .eq('id', userId);

//     if (updateError) {
//       toast({
//         title: "Failed to save profile picture",
//         description: updateError.message,
//         variant: "destructive",
//       });
//     } else {
//       toast({
//         title: "Profile Picture Updated",
//         description: "Your profile picture has been uploaded.",
//       });
//     }

//     setIsUploading(false);
//   };
//   const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//   const files = event.target.files;
//       if (!files) return;
      
//       setIsUploading(true);
      
//       for (let file of files) {
//         try {
//           if (file.type === 'application/pdf') {
//             await new Promise(resolve => setTimeout(resolve, 2000));
//           }
          
//           const cleanFileName = file.name
//             .replace(/\s+/g, "_")
//             .replace(/[^\w.-]/g, "")
//             .toLowerCase();
  
//           const filePath = `medical_documents/${Date.now()}_${cleanFileName}`;
//           const { error } = await supabase
//             .storage
//             .from('heal_med_app_files_bucket')
//             .upload(filePath, file, {
//               cacheControl: '3600',
//               upsert: false
//             });
  
//           if (error) {
//             toast({
//               title: "Upload failed",
//               description: error.message,
//               variant: "destructive",
//             });
//             setIsUploading(false);
//             return;
//           } else {
//             setUploadedDocs(prev => [...prev, { 
//               name: file.name, 
//               type: 'doctor' 
//             }]);
//             toast({
//               title: "Document Uploaded",
//               description: `${file.name} uploaded successfully.`,
//             });
//           }
//         } catch (err) {
//           console.error('Upload error:', err);
//           toast({
//             title: "Upload Failed",
//             description: "An unexpected error occurred.",
//             variant: "destructive",
//           });
//         }
//       }
      
//       setIsUploading(false);
// };
// //   const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
// //   const files = event.target.files;
// //   if (!files) return;
  
// //   // Get the current authenticated user
// //   const { data: { user } } = await supabase.auth.getUser();
// //   if (!user) {
// //     toast({
// //       title: "Authentication Required",
// //       description: "Please log in to upload documents.",
// //       variant: "destructive",
// //     });
// //     return;
// //   }
  
// //   setIsUploading(true);
  
// //   for (let file of files) {
// //     try {
// //       // Show PDF loader for PDF files
// //       if (file.type === 'application/pdf') {
// //         await new Promise(resolve => setTimeout(resolve, 2000));
// //       }
      
// //       const cleanFileName = file.name
// //         .replace(/\s+/g, "_")
// //         .replace(/[^\w.-]/g, "")
// //         .toLowerCase();

// //       // Include user ID in the path - THIS IS CRITICAL for RLS policies
// //       const filePath = `doctor_documents/${Date.now()}_${cleanFileName}`;
// //       // const filePath = `doctor_documents/${user.id}/${timestamp}_${cleanFileName}`;
      
// //       const { data, error } = await supabase
// //         .storage
// //         .from('heal_med_app_files_bucket')
// //         .upload(filePath, file, {
// //           cacheControl: '3600',
// //           upsert: false
// //         });

// //       if (error) {
// //         console.error('Upload error:', error);
// //         toast({
// //           title: "Upload Failed",
// //           description: error.message,
// //           variant: "destructive",
// //         });
// //         setIsUploading(false);
// //         return;
// //       }
// //       else {
// //         setUploadedDocs(prev => [...prev, { 
// //           name: file.name, 
// //           type: 'doctor' 
// //         }]);
// //         toast({
// //           title: "Document Uploaded",
// //           description: `${file.name} uploaded successfully.`,
// //         });
// //       }
// //     } catch (err) {
// //       console.error('Upload error:', err);
// //       toast({
// //         title: "Upload Failed",
// //         description: "An unexpected error occurred.",
// //         variant: "destructive",
// //       });
// //     }
// //   }
  
// //   setIsUploading(false);
// // };
// // const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
// //   const files = event.target.files;
// //   if (!files) return;
  
// //   setIsUploading(true);
  
// //   for (let file of files) {
// //     // Show PDF loader for PDF files
// //     if (file.type === 'application/pdf') {
// //       await new Promise(resolve => setTimeout(resolve, 2000));
// //     }
// //        const cleanFileName = file.name
// //         .replace(/\s+/g, "_")
// //         .replace(/[^\w.-]/g, "")
// //         .toLowerCase();

// //       // Create path with user ID
// //       const timestamp = Date.now();
// //       const filePath = `doctor_documents/${timestamp}_${cleanFileName}`;
      
// //     // const filePath = `medical_documents/${Date.now()}_${file.name}`;
// //     const { data, error } = await supabase
// //       .storage
// //       .from('heal_med_app_files_bucket')
// //       .upload(filePath, file, {
// //         cacheControl: '3600',
// //         upsert: false
// //       });

// //     if (error) {
// //       toast({
// //         title: "Uploading of the file failed",
// //         description: error.message,
// //       });
// //       setIsUploading(false);
// //       return;
// //     }
// //     else {
// //       // Store the document with its type based on userType
// //       setUploadedDocs(prev => [...prev, { 
// //         name: file.name, 
// //         type: 'facility' 
// //       }]);
// //       toast({
// //         title: "Files Uploaded",
// //         description: `file(s) uploaded successfully.`,
// //       });
// //     }
// //   }
  
// //   setIsUploading(false);
// // };
// const updateDoctorTimeslots = async () => {
//     if (!userId) return false;

//     let rows = [];
//     Object.entries(slotsByDay).forEach(([weekday, slotObj]) => {
//       Object.entries(slotObj).forEach(([slotType, slots]) => {
//         slots.forEach(start => {
//           const endHour = parseInt(start.split(':')[0]) + 1;
//           const endTime = `${String(endHour).padStart(2, '0')}:${start.split(':')[1]}`;
//           rows.push({
//             doctor_id: userId,
//             day_of_week: weekday,
//             start_time: start,
//             end_time: endTime,
//             is_available: true,
//             slot_type: slotType
//           });
//         });
//       });
//     });

//     if (rows.length === 0) {
//       toast({
//         title: "No time slots selected",
//         description: "Please select at least one time slot.",
//         variant: "destructive",
//       });
//       return false;
//     }

//     const { error } = await supabase
//       .from('time_slots')
//       .insert(rows);

//     if (error) {
//       toast({
//         title: "Failed to save time slots",
//         description: error.message,
//         variant: "destructive",
//       });
//       return false;
//     }

//     return true;
//   };

//   // const handleStep1Submit = async () => {
//   //   if (!validateStep1()) return false;
    
//   //   setIsSubmitting(true);
//   //   const user = await handleSignUp();
//   //   setIsSubmitting(false);
    
//   //   if (user) {
//   //     // setUserId(user.id);
//   //     toast({
//   //       title: "Account Created!",
//   //       description: "Your basic account has been created. Please continue with the registration.",
//   //     });
//   //     return true;
//   //   }
//   //   return false;
//   // };
// const handleStep1Submit = async () => {
//   if (!validateStep1()) return false;
  
//   const user = await handleSignUp();
  
//   if (user) {
//     setUserId(user.id);  // FIXED: Uncomment this line
//     toast({
//       title: "Account Created!",
//       description: "Your basic account has been created. Please continue with the registration.",
//     });
//     return true;
//   }
//   return false;
// };
//   const handleStep2Submit = async () => {
//     if (!validateStep2()) return false;
    
//     if (userId) {
//       const success = await handleSaveProfessionalInfo({ id: userId });
//       if (success) {
//         toast({
//           title: "Address Saved",
//           description: "Your address information has been saved.",
//         });
//         return true;
//       }
//     }
//     return false;
//   };

//   const handleStep3Submit = async () => {
//     if (!validateStep3()) return false;
    
//     if (userId) {
//       const success = await handleSaveProfessionalInfo({ id: userId });
//       if (success) {
//         toast({
//           title: "Professional Info Saved",
//           description: "Your professional information has been saved.",
//         });
//         return true;
//       }
//     }
//     return false;
//   };

//   const handleNext = async () => {
//     let success = false;
    
//     if (currentStep === 1) {
//       success = await handleStep1Submit();
//     } else if (currentStep === 2) {
//       success = await handleStep2Submit();
//     } else if (currentStep === 3) {
//       success = await handleStep3Submit();
//     } else if (currentStep === 4 || currentStep === 5) {
//       success = true; // Image upload and document upload steps don't need validation
//     } else if (currentStep === 6) {
//       success = true;
//     }

//     if (success) {
//       setCurrentStep(prev => prev + 1);
//       window.scrollTo(0, 0);
//     }
//   };

//   const handleBack = () => {
//     setCurrentStep(prev => prev - 1);
//     window.scrollTo(0, 0);
//   };

//   const handleFinalSubmit = async () => {
//     setIsSubmitting(true);
    
//     const timeslotSuccess = await updateDoctorTimeslots();
    
//     if (timeslotSuccess) {
//       mixpanelInstance.track('Doctor Registration Completed', {
//         email: formData.emailAddress,
//         user_id: userId,
//       });
      
//       toast({
//         title: "Registration Complete!",
//         description: "Your doctor profile has been successfully created.",
//       });
      
//       setShowSuccessPopup(true);
//     }
    
//     setIsSubmitting(false);
//   };

//   const StepIndicator = () => (
//     <div className="mb-8 px-4">
//       <div className="mb-2">
//         <Progress value={progress} className="h-2" />
//       </div>
//       <div className="flex items-center justify-between relative mt-4">
//         {[1, 2, 3, 4, 5, 6].map((step) => (
//           <div key={step} className="flex items-center flex-1">
//             <div className="relative flex flex-col items-center group">
//               <div
//                 className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
//                   currentStep >= step
//                     ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg"
//                     : "bg-gray-200 text-gray-500"
//                 }`}
//               >
//                 {step}
//               </div>
//               <span className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap hidden sm:block ${
//                 currentStep >= step ? "text-teal-600" : "text-gray-500"
//               }`}>
//                 {step === 1 && "Account"}
//                 {step === 2 && "Address"}
//                 {step === 3 && "Professional"}
//                 {step === 4 && "Profile Pic"}
//                 {step === 5 && "Documents"}
//                 {step === 6 && "Schedule"}
//               </span>
//             </div>
//             {step < 6 && (
//               <div className={`flex-1 h-1 mx-1 rounded-full transition-all duration-300 ${
//                 currentStep > step ? "bg-gradient-to-r from-blue-500 to-teal-500" : "bg-gray-200"
//               }`} />
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const renderStep1 = () => (
//     <div className="space-y-5">
//       <div className="text-center mb-6">
//         <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
//           Step 1: Create Your Account
//         </h3>
//         <p className="text-sm text-gray-500">Enter your basic information</p>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="firstName" className="label-required text-sm font-semibold text-gray-700">
//             First Name
//           </Label>
//           <Input
//             id="firstName"
//             value={formData.firstName}
//             onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//             className={`border-2 ${errors.firstName ? "border-red-500" : "border-gray-200"}`}
//             placeholder="John"
//           />
//           {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="lastName" className="label-required text-sm font-semibold text-gray-700">
//             Last Name
//           </Label>
//           <Input
//             id="lastName"
//             value={formData.lastName}
//             onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//             className={`border-2 ${errors.lastName ? "border-red-500" : "border-gray-200"}`}
//             placeholder="Doe"
//           />
//           {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="email" className="label-required text-sm font-semibold text-gray-700">
//           Email Address
//         </Label>
//         <Input
//           id="email"
//           type="email"
//           value={formData.emailAddress}
//           onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
//           className={`border-2 ${errors.emailAddress ? "border-red-500" : "border-gray-200"}`}
//           placeholder="doctor@example.com"
//         />
//         {errors.emailAddress && <p className="text-red-500 text-xs">{errors.emailAddress}</p>}
//       </div>

//       <div className="space-y-2">
//         <Label className="label-required text-sm font-semibold text-gray-700">Phone Number</Label>
//         <div className="flex space-x-2">
//           <Select value={countryCode} onValueChange={(value) => setCountryCode(value)}>
//             <SelectTrigger className="w-24 border-2 border-gray-200">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {countryCodes.map((country) => (
//                 <SelectItem key={country.code} value={country.code}>
//                   <span className="flex items-center space-x-2">
//                     <span>{country.flag}</span>
//                     <span>{country.code}</span>
//                   </span>
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Input
//             type="tel"
//             value={phoneNumber}
//             maxLength={10}
//             onChange={(e) => {
//               const value = e.target.value.replace(/\D/g, "");
//               if (value.length <= 10) setPhoneNumber(value);
//             }}
//             className={`flex-1 border-2 ${errors.phoneNumber ? "border-red-500" : "border-gray-200"}`}
//             placeholder="9876543210"
//           />
//         </div>
//         {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="password" className="label-required text-sm font-semibold text-gray-700">
//           Password
//         </Label>
//         <Input
//           id="password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className={`border-2 ${errors.password ? "border-red-500" : "border-gray-200"}`}
//           placeholder="••••••"
//         />
//         {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="repeatpassword" className="label-required text-sm font-semibold text-gray-700">
//           Confirm Password
//         </Label>
//         <Input
//           id="repeatpassword"
//           type="password"
//           value={repeatPassword}
//           onChange={(e) => setRepeatPassword(e.target.value)}
//           className={`border-2 ${errors.repeatPassword ? "border-red-500" : "border-gray-200"}`}
//           placeholder="••••••"
//         />
//         {errors.repeatPassword && <p className="text-red-500 text-xs">{errors.repeatPassword}</p>}
//       </div>

//       <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
//         <span className="font-semibold">Password must contain:</span>
//         <br />• Minimum 6 characters
//         <br />• At least 1 letter
//         <br />• At least 1 number
//         <br />• At least 1 special character (@$!%*?&)
//       </p>

//       <div className="space-y-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
//         <h4 className="font-semibold text-blue-800 flex items-center">
//           <Shield className="h-5 w-5 mr-2" />
//           Terms & Verification
//         </h4>

//         <div className="space-y-3">
//           <div className="flex items-center space-x-3">
//             <Checkbox
//               id="terms"
//               checked={termsAccepted}
//               onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
//             />
//             <Label htmlFor="terms" className="text-sm">
//               I accept the{" "}
//               <span 
//                 className="text-blue-600 font-semibold cursor-pointer hover:underline" 
//                 onClick={() => navigate("/terms")}
//               >
//                 Terms and Conditions
//               </span>{" "}
//               for medical professionals
//             </Label>
//           </div>

//           <div className="flex items-center space-x-3">
//             <Checkbox
//               id="kyc"
//               checked={kycAccepted}
//               onCheckedChange={(checked) => setKycAccepted(checked as boolean)}
//             />
//             <Label htmlFor="kyc" className="text-sm">
//               I consent to KYC verification and license validation
//             </Label>
//           </div>
//           {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep2 = () => (
//     <div className="space-y-5">
//       <div className="text-center mb-6">
//         <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
//           Step 2: Address Information
//         </h3>
//         <p className="text-sm text-gray-500">Where is your practice located?</p>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="address" className="label-required text-sm font-semibold text-gray-700">Address</Label>
//         <Textarea
//           id="address"
//           value={formData.address}
//           onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//           className={`border-2 ${errors.address ? "border-red-500" : "border-gray-200"}`}
//           placeholder="Enter your complete address"
//           rows={3}
//         />
//         {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="country" className="label-required">Country</Label>
//           <select
//             id="country"
//             value={formData.country_code || ''}
//             onChange={(e) => setFormData({ 
//               ...formData, 
//               country_code: e.target.value,
//               state: '',
//               city: ''
//             })}
//             className={`w-full p-2 border rounded ${errors.country_code ? "border-red-500" : "border-gray-200"}`}
//           >
//             <option value="">Select Country</option>
//             {countries.map((country) => (
//               <option key={country.isoCode} value={country.name}>
//                 {country.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="state" className="label-required">State</Label>
//           <select
//             id="state"
//             value={formData.state || ''}
//             onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
//             className={`w-full p-2 border rounded ${errors.state ? "border-red-500" : "border-gray-200"}`}
//             disabled={!formData.country_code}
//           >
//             <option value="">Select State</option>
//             {states.map((state) => (
//               <option key={state.isoCode} value={state.name}>
//                 {state.name}
//               </option>
//             ))}
//           </select>
//           {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="city" className="label-required">City</Label>
//           <select
//             id="city"
//             value={formData.city || ''}
//             onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//             className={`w-full p-2 border rounded ${errors.city ? "border-red-500" : "border-gray-200"}`}
//             disabled={!formData.state}
//           >
//             <option value="">Select City</option>
//             {cities.map((city) => (
//               <option key={city.name} value={city.name}>
//                 {city.name}
//               </option>
//             ))}
//           </select>
//           {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
//         </div>

//         <div>
//           <Label className="label-required" htmlFor="pincode">Pincode</Label>
//           <Input
//             id="pincode"
//             value={formData.pincode}
//             onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
//             className={errors.pincode ? "border-red-500" : ""}
//           />
//           {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep3 = () => (
//     <div className="space-y-5">
//       <div className="text-center mb-6">
//         <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
//           Step 3: Professional Information
//         </h3>
//         <p className="text-sm text-gray-500">Tell us about your medical career</p>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="specialty" className="label-required text-sm font-semibold text-gray-700">
//           <Stethoscope className="inline h-4 w-4 mr-1 text-blue-500" />
//           Medical Specialty
//         </Label>
//         <Select value={formData.medicalSpeciality} onValueChange={(value) => setFormData({ ...formData, medicalSpeciality: value })}>
//           <SelectTrigger className={`border-2 ${errors.medicalSpeciality ? "border-red-500" : "border-gray-200"}`}>
//             <SelectValue placeholder="Select your specialty" />
//           </SelectTrigger>
//           <SelectContent>
//             {specialties.map((specialty) => (
//               <SelectItem key={specialty} value={specialty}>
//                 {specialty}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {errors.medicalSpeciality && <p className="text-red-500 text-xs">{errors.medicalSpeciality}</p>}
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="licenseNumber" className="label-required text-sm font-semibold text-gray-700">
//             <FileText className="inline h-4 w-4 mr-1 text-purple-500" />
//             License Number
//           </Label>
//           <Input
//             id="licenseNumber"
//             value={formData.licenseNumber}
//             onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
//             className={`border-2 ${errors.licenseNumber ? "border-red-500" : "border-gray-200"}`}
//             placeholder="Medical license number"
//           />
//           {errors.licenseNumber && <p className="text-red-500 text-xs">{errors.licenseNumber}</p>}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="graduationYear" className="label-required text-sm font-semibold text-gray-700">
//             <GraduationCap className="inline h-4 w-4 mr-1 text-green-500" />
//             Graduation Year
//           </Label>
//           <Input
//             id="graduationYear"
//             type="number"
//             min="1950"
//             max={new Date().getFullYear()}
//             value={formData.graduationYear}
//             onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
//             className={`border-2 ${errors.graduationYear ? "border-red-500" : "border-gray-200"}`}
//           />
//           {errors.graduationYear && <p className="text-red-500 text-xs">{errors.graduationYear}</p>}
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="medicalSchool" className="label-required text-sm font-semibold text-gray-700">
//           <BookOpen className="inline h-4 w-4 mr-1 text-orange-500" />
//           Medical School/University
//         </Label>
//         <Input
//           id="medicalSchool"
//           value={formData.medicalSchool}
//           onChange={(e) => setFormData({ ...formData, medicalSchool: e.target.value })}
//           className={`border-2 ${errors.medicalSchool ? "border-red-500" : "border-gray-200"}`}
//           placeholder="Name of medical school"
//         />
//         {errors.medicalSchool && <p className="text-red-500 text-xs">{errors.medicalSchool}</p>}
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="experience" className="label-required text-sm font-semibold text-gray-700">
//             <Briefcase className="inline h-4 w-4 mr-1 text-indigo-500" />
//             Years of Experience
//           </Label>
//           <Input
//             id="experience"
//             type="number"
//             min="0"
//             max="50"
//             value={formData.yearsOfExperience}
//             onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
//             className={`border-2 ${errors.yearsOfExperience ? "border-red-500" : "border-gray-200"}`}
//           />
//           {errors.yearsOfExperience && <p className="text-red-500 text-xs">{errors.yearsOfExperience}</p>}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="consultationFee" className="text-sm font-semibold text-gray-700">
//             <IndianRupee className="inline h-4 w-4 mr-1 text-emerald-500" />
//             Consultation Fee (₹)
//           </Label>
//           <Input
//             id="consultationFee"
//             type="number"
//             min="0"
//             value={formData.consultationFees}
//             onChange={(e) => setFormData({ ...formData, consultationFees: Number(e.target.value) })}
//             className="border-2 border-gray-200"
//             placeholder="e.g., 500"
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="languages" className="label-required text-sm font-semibold text-gray-700">
//           <Languages className="inline h-4 w-4 mr-1 text-pink-500" />
//           Languages Spoken
//         </Label>
//         <Input
//           id="languages"
//           value={formData.languagesKnown}
//           onChange={(e) => setFormData({ ...formData, languagesKnown: e.target.value })}
//           className={`border-2 ${errors.languagesKnown ? "border-red-500" : "border-gray-200"}`}
//           placeholder="e.g., English, Hindi, Marathi"
//         />
//         {errors.languagesKnown && <p className="text-red-500 text-xs">{errors.languagesKnown}</p>}
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="qualifications" className="text-sm font-semibold text-gray-700">
//           <Award className="inline h-4 w-4 mr-1 text-yellow-500" />
//           Additional Qualifications
//         </Label>
//         <Textarea
//           id="qualifications"
//           value={formData.additionalQualifications}
//           onChange={(e) => setFormData({ ...formData, additionalQualifications: e.target.value })}
//           className="border-2 border-gray-200"
//           placeholder="List your degrees, certifications, specializations..."
//           rows={3}
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="about" className="text-sm font-semibold text-gray-700">
//           <Heart className="inline h-4 w-4 mr-1 text-red-500" />
//           About Yourself
//         </Label>
//         <Textarea
//           id="about"
//           value={formData.aboutYourself}
//           onChange={(e) => setFormData({ ...formData, aboutYourself: e.target.value })}
//           className="border-2 border-gray-200"
//           placeholder="Brief introduction about your practice, approach, achievements..."
//           rows={4}
//         />
//       </div>
//     </div>
//   );

//   const renderStep4 = () => (
//     <div className="space-y-6">
//       <div className="text-center">
//         <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//         <h3 className="text-lg font-semibold mb-2">Step 4: Profile Picture</h3>
//         <p className="text-muted-foreground">Add a professional profile picture for your patients</p>
//       </div>

//       <div className="flex flex-col items-center space-y-4">
//         {profileImage ? (
//           <div className="relative">
//             <img
//               src={profileImage}
//               alt="Profile"
//               className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
//             />
//             <Button
//               size="sm"
//               className="absolute bottom-0 right-0 rounded-full"
//               onClick={() => document.getElementById('profile-upload')?.click()}
//             >
//               <Camera className="h-4 w-4" />
//             </Button>
//           </div>
//         ) : (
//           <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
//             <Camera className="h-8 w-8 text-gray-400" />
//           </div>
//         )}

//         <Input
//           type="file"
//           accept="image/*"
//           onChange={handleProfileImageUpload}
//           className="hidden"
//           id="profile-upload"
//         />
//         <Button
//           variant="outline"
//           onClick={() => document.getElementById('profile-upload')?.click()}
//           disabled={isUploading}
//         >
//           {isUploading ? 'Uploading...' : (profileImage ? 'Change Picture' : 'Upload Picture')}
//         </Button>
//         <p className="text-xs text-gray-500">Recommended: Square image, at least 200x200 pixels</p>
//       </div>
//     </div>
//   );

//   const renderStep5 = () => (
//     <div className="space-y-6">
//       <div className="text-center">
//         <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//         <h3 className="text-lg font-semibold mb-2">Step 5: Upload Documents</h3>
//         <p className="text-muted-foreground">Upload your medical license and certificates</p>
//       </div>

//       {isUploading ? (
//         <PDFLoader />
//       ) : (
//         <>
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//             <Input
//               type="file"
//               multiple
//               accept=".pdf,.jpg,.jpeg,.png"
//               onChange={handleDocumentUpload}
//               className="hidden"
//               id="document-upload"
//             />
//             <Label htmlFor="document-upload" className="cursor-pointer">
//               <Upload className="mx-auto h-8 w-8 mb-2 text-gray-400" />
//               <p className="text-sm text-gray-600">Click to upload documents or drag and drop</p>
//               <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB each</p>
//             </Label>
//           </div>

//           {uploadedDocs.length > 0 && (
//             <div>
//               <h4 className="font-medium mb-2">Uploaded Documents:</h4>
//               <div className="flex flex-wrap gap-2">
//                 {uploadedDocs.map((doc, index) => (
//                   <div key={index} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm border border-green-200 flex items-center gap-2">
//                     <FileText className="h-3.5 w-3.5" />
//                     <span className="truncate max-w-[200px]">{doc.name}</span>
//                     <CheckCircle className="h-3.5 w-3.5" />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );

//   const renderStep6 = () => (
//     <div className="space-y-6">
//       <div className="text-center">
//         <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//         <h3 className="text-lg font-semibold mb-2">Step 6: Set Your Schedule</h3>
//         <p className="text-muted-foreground">Define your working hours and availability</p>
//       </div>

//       <div>
//         <Label>Working Days</Label>
//         <div className="flex flex-wrap gap-2 mt-2">
//           {daysOfWeek.map(day => (
//             <Button
//               key={day}
//               variant={selectedDay === day ? "default" : "outline"}
//               size="sm"
//               className="text-xs"
//               onClick={() => setSelectedDay(day)}
//             >
//               {day.slice(0, 3)}
//             </Button>
//           ))}
//         </div>
//       </div>

//       <div>
//         <Label>Consultation Type</Label>
//         <div className="grid grid-cols-2 gap-4 mt-2">
//           {['Clinic', 'Tele'].map(type => (
//             <Button
//               key={type}
//               variant={selectedType === type ? "default" : "outline"}
//               onClick={() => setSelectedType(type as 'Clinic' | 'Tele')}
//             >
//               {type === 'Tele' ? 'Tele-Consultation' : 'Clinic Consultation'}
//             </Button>
//           ))}
//         </div>
//       </div>

//       <div>
//         <Label>Available Time Slots for {selectedDay} ({selectedType})</Label>
//         <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2 max-h-64 overflow-y-auto p-2">
//           {timeSlots.map(slot => {
//             const isSelected = slotsByDay[selectedDay][selectedType.toLowerCase()].includes(slot);
//             const isDisabled = slotsByDay[selectedDay][selectedType === 'Clinic' ? 'tele' : 'clinic'].includes(slot);
            
//             return (
//               <Button
//                 key={slot}
//                 variant={isSelected ? "default" : "outline"}
//                 size="sm"
//                 className="text-xs"
//                 onClick={() => {
//                   const daySlots = slotsByDay[selectedDay][selectedType.toLowerCase()];
//                   if (daySlots.includes(slot)) {
//                     setSlotsByDay(prev => ({
//                       ...prev,
//                       [selectedDay]: {
//                         ...prev[selectedDay],
//                         [selectedType.toLowerCase()]: daySlots.filter(s => s !== slot)
//                       }
//                     }));
//                   } else if (!isDisabled) {
//                     setSlotsByDay(prev => ({
//                       ...prev,
//                       [selectedDay]: {
//                         ...prev[selectedDay],
//                         [selectedType.toLowerCase()]: [...daySlots, slot].sort()
//                       }
//                     }));
//                   }
//                 }}
//                 disabled={isDisabled}
//               >
//                 {slot}
//               </Button>
//             );
//           })}
//         </div>
//         <p className="text-xs text-gray-500 mt-2">
//           {selectedType === 'Clinic' ? 'Clinic' : 'Tele'} slots: {slotsByDay[selectedDay][selectedType.toLowerCase()].length} selected
//         </p>
//       </div>

//       <div className="bg-blue-50 p-4 rounded-lg">
//         <h4 className="font-semibold text-blue-800 mb-2">Selected Schedule Summary</h4>
//         {daysOfWeek.map(day => {
//           const clinicSlots = slotsByDay[day].clinic;
//           const teleSlots = slotsByDay[day].tele;
//           if (clinicSlots.length === 0 && teleSlots.length === 0) return null;
          
//           return (
//             <div key={day} className="mb-2 text-sm">
//               <span className="font-medium">{day}:</span>
//               {clinicSlots.length > 0 && (
//                 <span className="ml-2 text-blue-600">Clinic: {clinicSlots.join(', ')}</span>
//               )}
//               {teleSlots.length > 0 && (
//                 <span className="ml-2 text-teal-600">Tele: {teleSlots.join(', ')}</span>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );

//   return (
//     <AuthLayout
//       title="Medical Professional Registration"
//       description="Join our network of verified healthcare professionals"
//       userType="doctor"
//     >
//       <div className="bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 p-6 rounded-xl">
//         <StepIndicator />
        
//         <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
//           {currentStep === 1 && renderStep1()}
//           {currentStep === 2 && renderStep2()}
//           {currentStep === 3 && renderStep3()}
//           {currentStep === 4 && renderStep4()}
//           {currentStep === 5 && renderStep5()}
//           {currentStep === 6 && renderStep6()}

//           <div className="flex justify-between pt-6">
//             {currentStep > 1 && (
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleBack}
//                 className="border-2 border-gray-300 hover:border-blue-500"
//                 disabled={isSubmitting}
//               >
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 Back
//               </Button>
//             )}
            
//             {currentStep < totalSteps ? (
//               <Button
//                 type="button"
//                 onClick={handleNext}
//                 disabled={isSubmitting}
//                 className={`bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white ${currentStep === 1 ? "ml-auto" : ""}`}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <span className="animate-spin mr-2">⟳</span>
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     Next
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </>
//                 )}
//               </Button>
//             ) : (
//               <Button
//                 type="button"
//                 onClick={handleFinalSubmit}
//                 disabled={isSubmitting}
//                 className="ml-auto bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <span className="animate-spin mr-2">⟳</span>
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <Stethoscope className="mr-2 h-5 w-5" />
//                     Complete Registration
//                   </>
//                 )}
//               </Button>
//             )}
//           </div>

//           <div className="text-center text-sm text-gray-600">
//             Already registered?{" "}
//             <Button
//               variant="link"
//               className="p-0 h-auto font-semibold text-blue-600 hover:text-teal-600"
//               onClick={() => navigate("/login/doctor")}
//             >
//               Sign in here →
//             </Button>
//           </div>
//         </form>
//       </div>

//       <SuccessPopup 
//         isOpen={showSuccessPopup}
//         onClose={() => {
//           setShowSuccessPopup(false);
//           navigate("/dashboard/doctor");
//         }}
//         userType="doctor"
//       />
//     </AuthLayout>
//   );
// };

// export default DoctorRegistration;

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePopup } from '@/contexts/popup-context';
import mixpanelInstance from "@/utils/mixpanel";
import { 
  User, Mail, Lock, Phone, MapPin, 
  Stethoscope, GraduationCap, Award, 
  Clock, Languages, IndianRupee, FileText,
  ArrowLeft, ArrowRight, Heart, Shield, Sparkles,
  Calendar, BookOpen, Briefcase, Camera, Upload, CheckCircle
} from 'lucide-react';

import AuthLayout from "./AuthLayout";
import { MedicalProfessional } from "@/Models/MedicalProfessional";
import { supabase } from "@/integrations/supabase/client";
import '../../styles/form-input-styles.css';
import { Country, State, City } from "country-state-city";
import { Progress } from "@/components/ui/progress";

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
];

// PDF Loader Component
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
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
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
    doctor: {
      title: "Welcome to Your Doctor Dashboard! 👨‍⚕️",
      message: "Your professional profile is now active. Start managing your schedule, accepting appointments, and providing care to patients.",
      features: [
        "Manage your availability",
        "View patient appointments",
        "Access patient records",
        "Tele-consultation ready"
      ]
    }
  };

  const currentConfig = config[userType] || config.doctor;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">{currentConfig.title}</h2>
          <p className="text-gray-600 mb-4">{currentConfig.message}</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-2">What's next?</h4>
            <ul className="space-y-2">
              {currentConfig.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { openPopup } = usePopup();
  const [currentStep, setCurrentStep] = useState(1);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [kycAccepted, setKycAccepted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const [uploadedDocs, setUploadedDocs] = useState<Array<{name: string, type: string}>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  // Time slot states
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [slotsByDay, setSlotsByDay] = useState<{ [key: string]: { clinic: string[], tele: string[] } }>(
    () => daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: { clinic: [], tele: [] } }), {})
  );
  const [selectedType, setSelectedType] = useState<'Clinic' | 'Tele'>('Clinic');
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const [formData, setFormData] = useState<MedicalProfessional>({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    address: '',
    city: '',
    state: '',
    pincode: '',
    medicalSpeciality: "",
    licenseNumber: "",
    graduationYear: new Date().getFullYear(),
    medicalSchool: "",
    yearsOfExperience: 0,
    languagesKnown: "",
    consultationFees: 0,
    additionalQualifications: "",
    aboutYourself: "",
    kycVerified: false,
    isVerified: true,
    country_code: "India",
  });

  const specialties = [
    "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
    "Orthopedic", "Pediatrician", "Gynecologist", "Psychiatrist",
    "Dentist", "Physiotherapist", "Dietician", "Ayurveda Practitioner",
    "Homeopath", "Psychologist", "ENT Specialist", "Ophthalmologist"
  ];

  // Calculate progress
  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  // useEffect(() => {
  //   if (formData.country_code) {
  //     const selectedCountry = countries.find(c => c.name === formData.country_code);
  //     if (selectedCountry) {
  //       const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
  //       setStates(countryStates);
  //       if (!countryStates.find(s => s.isoCode === formData.state)) {
  //         setFormData(prev => ({ ...prev, state: '', city: '' }));
  //         setCities([]);
  //       }
  //     } else {
  //       setStates([]);
  //       setCities([]);
  //     }
  //   } else {
  //     setStates([]);
  //     setCities([]);
  //   }
  // }, [formData.country_code, countries]);

  // useEffect(() => {
  //   if (formData.country_code && formData.state) {
  //     const selectedCountry = countries.find(c => c.name === formData.country_code);
  //     const selectedState = states.find(s => s.name === formData.state);
      
  //     if (selectedCountry && selectedState) {
  //       const countryCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
  //       setCities(countryCities);
  //       if (formData.city && !countryCities.find(c => c.name === formData.city)) {
  //         setFormData(prev => ({ ...prev, city: '' }));
  //       }
  //     } else {
  //       setCities([]);
  //     }
  //   } else {
  //     setCities([]);
  //   }
  // }, [formData.country_code, formData.state, countries, states]);
// Remove the incorrect useEffect hooks and replace with these:

useEffect(() => {
  if (formData.country_code && countries.length > 0) {
    const selectedCountry = countries.find(c => c.name === formData.country_code);
    if (selectedCountry) {
      const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(countryStates);
      // Don't reset state automatically
    } else {
      setStates([]);
      setCities([]);
    }
  } else {
    setStates([]);
    setCities([]);
  }
}, [formData.country_code, countries]);

useEffect(() => {
  if (formData.country_code && formData.state && states.length > 0 && countries.length > 0) {
    const selectedCountry = countries.find(c => c.name === formData.country_code);
    const selectedState = states.find(s => s.name === formData.state);
    
    if (selectedCountry && selectedState) {
      const countryCities = City.getCitiesOfState(
        selectedCountry.isoCode, 
        selectedState.isoCode
      );
      setCities(countryCities);
    } else {
      setCities([]);
    }
  } else {
    setCities([]);
  }
}, [formData.country_code, formData.state, countries, states]);
  const validateStep1 = () => {
    const errors: { [key: string]: string } = {};
    let valid = true;

    if (!formData.firstName) {
      errors.firstName = "First name is required";
      valid = false;
    }

    if (!formData.lastName) {
      errors.lastName = "Last name is required";
      valid = false;
    }

    if (!formData.emailAddress) {
      errors.emailAddress = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      errors.emailAddress = "Invalid email format";
      valid = false;
    }

    if (!phoneNumber) {
      errors.phoneNumber = "Phone number is required";
      valid = false;
    } else if (phoneNumber.length !== 10) {
      errors.phoneNumber = "Phone number must be 10 digits";
      valid = false;
    } else if (!/^\d+$/.test(phoneNumber)) {
      errors.phoneNumber = "Phone number must contain only digits";
      valid = false;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      errors.password = passwordError;
      valid = false;
    }

    if (password !== repeatPassword) {
      errors.repeatPassword = "Passwords do not match";
      valid = false;
    }

    if (!termsAccepted || !kycAccepted) {
      errors.terms = "Please accept terms and KYC verification";
      valid = false;
    }
    setErrors(errors);
    return valid;
  };

  const validateStep2 = () => {
    const errors: { [key: string]: string } = {};
    let valid = true;

    if (!formData.address) {
      errors.address = "Address is required";
      valid = false;
    }

    if (!formData.city) {
      errors.city = "City is required";
      valid = false;
    }

    if (!formData.state) {
      errors.state = "State is required";
      valid = false;
    }

    if (!formData.pincode) {
      errors.pincode = "Pincode is required";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const validateStep3 = () => {
    const errors: { [key: string]: string } = {};
    let valid = true;

    if (!formData.medicalSpeciality) {
      errors.medicalSpeciality = "Medical specialty is required";
      valid = false;
    }

    if (!formData.licenseNumber) {
      errors.licenseNumber = "License number is required";
      valid = false;
    }

    if (!formData.graduationYear) {
      errors.graduationYear = "Graduation year is required";
      valid = false;
    }

    if (!formData.medicalSchool) {
      errors.medicalSchool = "Medical school is required";
      valid = false;
    }

    if (!formData.yearsOfExperience && formData.yearsOfExperience !== 0) {
      errors.yearsOfExperience = "Years of experience is required";
      valid = false;
    }

    if (!formData.languagesKnown) {
      errors.languagesKnown = "Languages known is required";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!password) {
      return "Password is required";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (!passwordRegex.test(password)) {
      return "Password must contain letter, number and special character";
    }

    return "";
  };

  // Step 1: Create user account and profile (SAVES IMMEDIATELY)
  const handleSignUp = async () => {
    setIsSubmitting(true);
    
    try {
      const fullPhoneNumber = countryCode + phoneNumber;
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.emailAddress,
        password: password,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone_number: fullPhoneNumber,
            role: 'doctor',
          },
        },
      });

      if (signUpError) {
        toast({
          title: 'Registration Failed',
          description: signUpError.message,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return null;
      }

      const userId = signUpData.user?.id;
      
      if (!userId) {
        toast({
          title: 'Registration Failed',
          description: 'Could not retrieve user information',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return null;
      }
      const { data: existingProfile, error: checkError } = await supabase
                              .from('profiles')
                              .select('id')
                              .eq('id', userId)
                              .maybeSingle();
                        
                            let profileError;
await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: fullPhoneNumber,
          role: 'doctor',
        })
        .eq('email', formData.emailAddress);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast({
          title: 'Profile Update Issue',
          description: 'Your account was created but profile update had issues',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account Created!',
          description: 'Your basic account has been created. Please continue with the registration.',
        });
      }

      setIsSubmitting(false);
      return signUpData.user;
      
    } catch (error) {
      console.error('Error saving step 1:', error);
      toast({
        title: 'Error',
        description: 'Failed to save personal information',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return null;
    }
  };

  // Final Submit - Saves all remaining data (Steps 2, 3, 4, 5, 6)
  const handleFinalSubmit = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User not found. Please complete step 1 first.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const fullPhoneNumber = countryCode + phoneNumber;
      
      // Save professional info (Steps 2 and 3 data)
      const { error: medProfError } = await supabase
        .from('medical_professionals')
        .upsert({
          user_id: userId,
          // first_name: formData.firstName,
          // last_name: formData.lastName,
          // email: formData.emailAddress,
          // phone_number: fullPhoneNumber,
          medical_speciality: formData.medicalSpeciality,
          license_number: formData.licenseNumber,
          graduation_year: formData.graduationYear,
          medical_school: formData.medicalSchool,
          years_experience: formData.yearsOfExperience,
          languages_known: formData.languagesKnown,
          consultation_fee: formData.consultationFees,
          education: formData.additionalQualifications,
          about_yourself: formData.aboutYourself,
          is_verified: formData.isVerified,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country_code: formData.country_code,
        }, { onConflict: 'user_id' });

      if (medProfError) {
        console.error('Error saving medical professional:', medProfError);
        toast({
          title: "Error",
          description: "Failed to save professional information",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Save profile image (Step 4)
      if (profileImage) {
                  const { data: existingProfile, error: checkError } = await supabase
                                .from('profiles')
                                .select('id')
                                .eq('id', userId)
                                .maybeSingle();
                          
                              let updateError;
                              
                              await supabase
                  .from('profiles')
                  .update({ 
                    avatar_url: profileImage 
                  })
                  .eq('email', formData.emailAddress);

        if (updateError) {
          console.error('Error saving profile image:', updateError);
        }
      }

      // Save documents (Step 5)
      // if (uploadedDocs.length > 0) {
      //   const documentUrls = uploadedDocs.map(doc => doc.name);
      //   const { error: docError } = await supabase
      //     .from('medical_professionals')
      //     .update({
      //       documents: documentUrls,
      //     })
      //     .eq('user_id', userId);

      //   if (docError) {
      //     console.error('Error saving documents:', docError);
      //   }
      // }

      // Save time slots (Step 6)
      let rows = [];
      Object.entries(slotsByDay).forEach(([weekday, slotObj]) => {
        Object.entries(slotObj).forEach(([slotType, slots]) => {
          slots.forEach(start => {
            const endHour = parseInt(start.split(':')[0]) + 1;
            const endTime = `${String(endHour).padStart(2, '0')}:${start.split(':')[1]}`;
            rows.push({
              doctor_id: userId,
              day_of_week: weekday,
              start_time: start,
              end_time: endTime,
              is_available: true,
              slot_type: slotType
            });
          });
        });
      });

      if (rows.length > 0) {
        const { error: slotError } = await supabase
          .from('time_slots')
          .insert(rows);

        if (slotError) {
          console.error('Error saving time slots:', slotError);
          toast({
            title: "Time Slot Error",
            description: "Failed to save time slots, but other data was saved.",
            variant: "destructive",
          });
        }
      }

      mixpanelInstance.track('Doctor Registration Completed', {
        email: formData.emailAddress,
        user_id: userId,
      });
      
      toast({
        title: "Registration Complete!",
        description: "Your doctor profile has been successfully created.",
      });
      
      setShowSuccessPopup(true);
      
    } catch (error) {
      console.error("Error completing registration:", error);
      toast({
        title: "Error",
        description: "Failed to complete registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const cleanFileName = file.name
        .replace(/\s+/g, "_")
        .replace(/[^\w.-]/g, "")
        .toLowerCase();

      const filePath = `profile_images/${Date.now()}_${cleanFileName}`;
      const { error: uploadError } = await supabase
        .storage
        .from('heal_med_app_images_bucket')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase
        .storage
        .from('heal_med_app_images_bucket')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData?.publicUrl;
      setProfileImage(publicUrl);

      toast({
        title: "Profile Picture Uploaded",
        description: "Your profile picture has been uploaded. It will be saved when you complete registration.",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
      if (!files) return;
      
      setIsUploading(true);
      
      for (let file of files) {
        try {
          if (file.type === 'application/pdf') {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          
          const cleanFileName = file.name
            .replace(/\s+/g, "_")
            .replace(/[^\w.-]/g, "")
            .toLowerCase();
  
          const filePath = `medical_documents/${Date.now()}_${cleanFileName}`;
          const { error } = await supabase
            .storage
            .from('heal_med_app_files_bucket')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });
  
          if (error) {
            toast({
              title: "Upload failed",
              description: error.message,
              variant: "destructive",
            });
            setIsUploading(false);
            return;
          } else {
            setUploadedDocs(prev => [...prev, { 
              name: file.name, 
              type: 'doctor' 
            }]);
            toast({
              title: "Document Uploaded",
              description: `${file.name} uploaded successfully.`,
            });
          }
        } catch (err) {
          console.error('Upload error:', err);
          toast({
            title: "Upload Failed",
            description: "An unexpected error occurred.",
            variant: "destructive",
          });
        }
      }
      
      setIsUploading(false);
};

  // const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (!files) return;
    
  //   setIsUploading(true);
    
  //   for (let file of files) {
  //     try {
  //       const cleanFileName = file.name
  //         .replace(/\s+/g, "_")
  //         .replace(/[^\w.-]/g, "")
  //         .toLowerCase();

  //       const filePath = `doctor_documents/${Date.now()}_${cleanFileName}`;
  //       const { error } = await supabase
  //         .storage
  //         .from('heal_med_app_files_bucket')
  //         .upload(filePath, file, {
  //           cacheControl: '3600',
  //           upsert: false
  //         });

  //       if (error) {
  //         toast({
  //           title: "Upload failed",
  //           description: error.message,
  //           variant: "destructive",
  //         });
  //         setIsUploading(false);
  //         return;
  //       } else {
  //         setUploadedDocs(prev => [...prev, { 
  //           name: file.name, 
  //           type: 'doctor' 
  //         }]);
  //         toast({
  //           title: "Document Uploaded",
  //           description: `${file.name} uploaded successfully. It will be saved when you complete registration.`,
  //         });
  //       }
  //     } catch (err) {
  //       console.error('Upload error:', err);
  //       toast({
  //         title: "Upload Failed",
  //         description: "An unexpected error occurred.",
  //         variant: "destructive",
  //       });
  //     }
  //   }
    
  //   setIsUploading(false);
  // };

  const handleStep1Submit = async () => {
    if (!validateStep1()) return false;
    
    const user = await handleSignUp();
    
    if (user) {
      setUserId(user.id);
      return true;
    }
    return false;
  };

  const handleNext = async () => {
    let success = false;
    
    if (currentStep === 1) {
      success = await handleStep1Submit();
    } else if (currentStep === 2) {
      // Only validate, don't save
      success = validateStep2();
    } else if (currentStep === 3) {
      // Only validate, don't save
      success = validateStep3();
    } else if (currentStep === 4 || currentStep === 5 || currentStep === 6) {
      success = true;
    }

    if (success) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      if (currentStep === 2 || currentStep === 3) {
        toast({
          title: "Validation Error",
          description: "Please fix the errors before proceeding",
          variant: "destructive",
        });
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const StepIndicator = () => (
    <div className="mb-8 px-4">
      <div className="mb-2">
        <Progress value={progress} className="h-2" />
      </div>
      <div className="flex items-center justify-between relative mt-4">
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="relative flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  currentStep >= step
                    ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step}
              </div>
              <span className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap hidden sm:block ${
                currentStep >= step ? "text-teal-600" : "text-gray-500"
              }`}>
                {step === 1 && "Account"}
                {step === 2 && "Address"}
                {step === 3 && "Professional"}
                {step === 4 && "Profile Pic"}
                {step === 5 && "Documents"}
                {step === 6 && "Schedule"}
              </span>
            </div>
            {step < 6 && (
              <div className={`flex-1 h-1 mx-1 rounded-full transition-all duration-300 ${
                currentStep > step ? "bg-gradient-to-r from-blue-500 to-teal-500" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          Step 1: Create Your Account
        </h3>
        <p className="text-sm text-gray-500">Enter your basic information</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="label-required text-sm font-semibold text-gray-700">
            First Name
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className={`border-2 ${errors.firstName ? "border-red-500" : "border-gray-200"}`}
            placeholder="John"
          />
          {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="label-required text-sm font-semibold text-gray-700">
            Last Name
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className={`border-2 ${errors.lastName ? "border-red-500" : "border-gray-200"}`}
            placeholder="Doe"
          />
          {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="label-required text-sm font-semibold text-gray-700">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.emailAddress}
          onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
          className={`border-2 ${errors.emailAddress ? "border-red-500" : "border-gray-200"}`}
          placeholder="doctor@example.com"
        />
        {errors.emailAddress && <p className="text-red-500 text-xs">{errors.emailAddress}</p>}
      </div>

      <div className="space-y-2">
        <Label className="label-required text-sm font-semibold text-gray-700">Phone Number</Label>
        <div className="flex space-x-2">
          <Select value={countryCode} onValueChange={(value) => setCountryCode(value)}>
            <SelectTrigger className="w-24 border-2 border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <span className="flex items-center space-x-2">
                    <span>{country.flag}</span>
                    <span>{country.code}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="tel"
            value={phoneNumber}
            maxLength={10}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) setPhoneNumber(value);
            }}
            className={`flex-1 border-2 ${errors.phoneNumber ? "border-red-500" : "border-gray-200"}`}
            placeholder="9876543210"
          />
        </div>
        {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="label-required text-sm font-semibold text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`border-2 ${errors.password ? "border-red-500" : "border-gray-200"}`}
          placeholder="••••••"
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="repeatpassword" className="label-required text-sm font-semibold text-gray-700">
          Confirm Password
        </Label>
        <Input
          id="repeatpassword"
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className={`border-2 ${errors.repeatPassword ? "border-red-500" : "border-gray-200"}`}
          placeholder="••••••"
        />
        {errors.repeatPassword && <p className="text-red-500 text-xs">{errors.repeatPassword}</p>}
      </div>

      <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <span className="font-semibold">Password must contain:</span>
        <br />• Minimum 6 characters
        <br />• At least 1 letter
        <br />• At least 1 number
        <br />• At least 1 special character (@$!%*?&)
      </p>

      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
        <h4 className="font-semibold text-blue-800 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Terms & Verification
        </h4>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm">
              I accept the{" "}
              <span 
                className="text-blue-600 font-semibold cursor-pointer hover:underline" 
                onClick={() => navigate("/terms")}
              >
                Terms and Conditions
              </span>{" "}
              for medical professionals
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="kyc"
              checked={kycAccepted}
              onCheckedChange={(checked) => setKycAccepted(checked as boolean)}
            />
            <Label htmlFor="kyc" className="text-sm">
              I consent to KYC verification and license validation
            </Label>
          </div>
          {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
        </div>
      </div>
    </div>
  );
const renderStep2 = () => {
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState<any[]>([]);

  // Filter cities based on search term
  useEffect(() => {
    if (citySearchTerm.trim() === '') {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(citySearchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [citySearchTerm, cities]);

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          Step 2: Address Information
        </h3>
        <p className="text-sm text-gray-500">Where is your practice located?</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="label-required text-sm font-semibold text-gray-700">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className={`border-2 ${errors.address ? "border-red-500" : "border-gray-200"}`}
          placeholder="Enter your complete address"
          rows={3}
        />
        {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country" className="label-required">Country</Label>
          <select
            id="country"
            value={formData.country_code || ''}
            onChange={(e) => {
              const selectedCountry = e.target.value;
              setFormData({ 
                ...formData, 
                country_code: selectedCountry,
                state: '',
                city: ''
              });
              setCitySearchTerm('');
            }}
            className={`w-full p-2 border rounded ${errors.country_code ? "border-red-500" : "border-gray-200"}`}
          >
            <option value="">Select Country</option>
            {countries && countries.length > 0 ? (
              countries.map((country) => (
                <option key={country.isoCode} value={country.name}>
                  {country.name}
                </option>
              ))
            ) : (
              <option disabled>Loading countries...</option>
            )}
          </select>
          {errors.country_code && <p className="text-red-500 text-sm">{errors.country_code}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="label-required">State</Label>
          <select
            id="state"
            value={formData.state || ''}
            onChange={(e) => {
              const selectedState = e.target.value;
              setFormData({ ...formData, state: selectedState, city: '' });
              setCitySearchTerm('');
            }}
            className={`w-full p-2 border rounded ${errors.state ? "border-red-500" : "border-gray-200"}`}
            disabled={!formData.country_code}
          >
            <option value="">Select State</option>
            {states && states.length > 0 ? (
              states.map((state) => (
                <option key={state.isoCode} value={state.name}>
                  {state.name}
                </option>
              ))
            ) : (
              <option disabled>Select country first</option>
            )}
          </select>
          {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="label-required">City</Label>
          <div className="relative">
            <Input
              id="city"
              type="text"
              value={citySearchTerm}
              onChange={(e) => {
                setCitySearchTerm(e.target.value);
                const exactMatch = cities.find(
                  (city) => city.name.toLowerCase() === e.target.value.toLowerCase()
                );
                if (exactMatch) {
                  setFormData({ ...formData, city: exactMatch.name });
                } else if (e.target.value === '') {
                  setFormData({ ...formData, city: '' });
                }
              }}
              placeholder={!formData.state ? "Select state first" : "Search and select city"}
              className={`border-2 ${errors.city ? "border-red-500" : "border-gray-200"}`}
              disabled={!formData.state}
              autoComplete="off"
            />
            {citySearchTerm && filteredCities.length > 0 && formData.state && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredCities.map((city) => (
                  <div
                    key={city.name}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                    onClick={() => {
                      setFormData({ ...formData, city: city.name });
                      setCitySearchTerm(city.name);
                    }}
                  >
                    {city.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        </div>

        <div>
          <Label className="label-required" htmlFor="pincode">Pincode</Label>
          <Input
            id="pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            className={errors.pincode ? "border-red-500" : ""}
          />
          {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
        </div>
      </div>
    </div>
  );
};
  // const renderStep2 = () => (
  //   <div className="space-y-5">
  //     <div className="text-center mb-6">
  //       <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
  //         Step 2: Address Information
  //       </h3>
  //       <p className="text-sm text-gray-500">Where is your practice located?</p>
  //     </div>

  //     <div className="space-y-2">
  //       <Label htmlFor="address" className="label-required text-sm font-semibold text-gray-700">Address</Label>
  //       <Textarea
  //         id="address"
  //         value={formData.address}
  //         onChange={(e) => setFormData({ ...formData, address: e.target.value })}
  //         className={`border-2 ${errors.address ? "border-red-500" : "border-gray-200"}`}
  //         placeholder="Enter your complete address"
  //         rows={3}
  //       />
  //       {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
  //     </div>

  //     <div className="grid grid-cols-2 gap-4">
  //       <div className="space-y-2">
  //         <Label htmlFor="country" className="label-required">Country</Label>
  //         <select
  //           id="country"
  //           value={formData.country_code || ''}
  //           onChange={(e) => setFormData({ 
  //             ...formData, 
  //             country_code: e.target.value,
  //             state: '',
  //             city: ''
  //           })}
  //           className={`w-full p-2 border rounded ${errors.country_code ? "border-red-500" : "border-gray-200"}`}
  //         >
  //           <option value="">Select Country</option>
  //           {countries.map((country) => (
  //             <option key={country.isoCode} value={country.name}>
  //               {country.name}
  //             </option>
  //           ))}
  //         </select>
  //       </div>

  //       <div className="space-y-2">
  //         <Label htmlFor="state" className="label-required">State</Label>
  //         <select
  //           id="state"
  //           value={formData.state || ''}
  //           onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
  //           className={`w-full p-2 border rounded ${errors.state ? "border-red-500" : "border-gray-200"}`}
  //           disabled={!formData.country_code}
  //         >
  //           <option value="">Select State</option>
  //           {states.map((state) => (
  //             <option key={state.isoCode} value={state.name}>
  //               {state.name}
  //             </option>
  //           ))}
  //         </select>
  //         {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
  //       </div>
  //     </div>

  //     <div className="grid grid-cols-2 gap-4">
  //       <div className="space-y-2">
  //         <Label htmlFor="city" className="label-required">City</Label>
  //         <select
  //           id="city"
  //           value={formData.city || ''}
  //           onChange={(e) => setFormData({ ...formData, city: e.target.value })}
  //           className={`w-full p-2 border rounded ${errors.city ? "border-red-500" : "border-gray-200"}`}
  //           disabled={!formData.state}
  //         >
  //           <option value="">Select City</option>
  //           {cities.map((city) => (
  //             <option key={city.name} value={city.name}>
  //               {city.name}
  //             </option>
  //           ))}
  //         </select>
  //         {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
  //       </div>

  //       <div>
  //         <Label className="label-required" htmlFor="pincode">Pincode</Label>
  //         <Input
  //           id="pincode"
  //           value={formData.pincode}
  //           onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
  //           className={errors.pincode ? "border-red-500" : ""}
  //         />
  //         {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
  //       </div>
  //     </div>
  //   </div>
  // );
// const renderStep2 = () => {
//   const [citySearchTerm, setCitySearchTerm] = useState('');
//   const [filteredCities, setFilteredCities] = useState([]);

//   // Filter cities based on search term
//   useEffect(() => {
//     if (citySearchTerm.trim() === '') {
//       setFilteredCities(cities);
//     } else {
//       const filtered = cities.filter((city) =>
//         city.name.toLowerCase().includes(citySearchTerm.toLowerCase())
//       );
//       setFilteredCities(filtered);
//     }
//   }, [citySearchTerm, cities]);

//   return (
//     <div className="space-y-5">
//       <div className="text-center mb-6">
//         <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
//           Step 2: Address Information
//         </h3>
//         <p className="text-sm text-gray-500">Where is your practice located?</p>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="address" className="label-required text-sm font-semibold text-gray-700">Address</Label>
//         <Textarea
//           id="address"
//           value={formData.address}
//           onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//           className={`border-2 ${errors.address ? "border-red-500" : "border-gray-200"}`}
//           placeholder="Enter your complete address"
//           rows={3}
//         />
//         {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="country" className="label-required">Country</Label>
//           <select
//             id="country"
//             value={formData.country_code || ''}
//             onChange={(e) => {
//               const selectedCountry = e.target.value;
//               setFormData({ 
//                 ...formData, 
//                 country_code: selectedCountry,
//                 state: '',
//                 city: ''
//               });
//               // Reset search term when country changes
//               setCitySearchTerm('');
//             }}
//             className={`w-full p-2 border rounded ${errors.country_code ? "border-red-500" : "border-gray-200"}`}
//           >
//             <option value="">Select Country</option>
//             {countries && countries.length > 0 ? (
//               countries.map((country) => (
//                 <option key={country.isoCode} value={country.name}>
//                   {country.name}
//                 </option>
//               ))
//             ) : (
//               <option disabled>Loading countries...</option>
//             )}
//           </select>
//           {errors.country_code && <p className="text-red-500 text-sm">{errors.country_code}</p>}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="state" className="label-required">State</Label>
//           <select
//             id="state"
//             value={formData.state || ''}
//             onChange={(e) => {
//               const selectedState = e.target.value;
//               setFormData({ ...formData, state: selectedState, city: '' });
//               // Reset search term when state changes
//               setCitySearchTerm('');
//             }}
//             className={`w-full p-2 border rounded ${errors.state ? "border-red-500" : "border-gray-200"}`}
//             disabled={!formData.country_code}
//           >
//             <option value="">Select State</option>
//             {states && states.length > 0 ? (
//               states.map((state) => (
//                 <option key={state.isoCode} value={state.name}>
//                   {state.name}
//                 </option>
//               ))
//             ) : (
//               <option disabled>Select country first</option>
//             )}
//           </select>
//           {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="city" className="label-required">City</Label>
//           <div className="relative">
//             <Input
//               id="city"
//               type="text"
//               value={citySearchTerm}
//               onChange={(e) => {
//                 setCitySearchTerm(e.target.value);
//                 // If search term matches exactly a city name, update form data
//                 const exactMatch = cities.find(
//                   (city) => city.name.toLowerCase() === e.target.value.toLowerCase()
//                 );
//                 if (exactMatch) {
//                   setFormData({ ...formData, city: exactMatch.name });
//                 } else if (e.target.value === '') {
//                   setFormData({ ...formData, city: '' });
//                 }
//               }}
//               placeholder="Search and select city"
//               className={`border-2 ${errors.city ? "border-red-500" : "border-gray-200"}`}
//               disabled={!formData.state}
//               autoComplete="off"
//             />
//             {citySearchTerm && filteredCities.length > 0 && formData.state && (
//               <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
//                 {filteredCities.map((city) => (
//                   <div
//                     key={city.name}
//                     className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
//                     onClick={() => {
//                       setFormData({ ...formData, city: city.name });
//                       setCitySearchTerm(city.name);
//                     }}
//                   >
//                     {city.name}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
//         </div>

//         <div>
//           <Label className="label-required" htmlFor="pincode">Pincode</Label>
//           <Input
//             id="pincode"
//             value={formData.pincode}
//             onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
//             className={errors.pincode ? "border-red-500" : ""}
//           />
//           {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
//         </div>
//       </div>
//     </div>
//   );
// };
  const renderStep3 = () => (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          Step 3: Professional Information
        </h3>
        <p className="text-sm text-gray-500">Tell us about your medical career</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialty" className="label-required text-sm font-semibold text-gray-700">
          <Stethoscope className="inline h-4 w-4 mr-1 text-blue-500" />
          Medical Specialty
        </Label>
        <Select value={formData.medicalSpeciality} onValueChange={(value) => setFormData({ ...formData, medicalSpeciality: value })}>
          <SelectTrigger className={`border-2 ${errors.medicalSpeciality ? "border-red-500" : "border-gray-200"}`}>
            <SelectValue placeholder="Select your specialty" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.medicalSpeciality && <p className="text-red-500 text-xs">{errors.medicalSpeciality}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="licenseNumber" className="label-required text-sm font-semibold text-gray-700">
            <FileText className="inline h-4 w-4 mr-1 text-purple-500" />
            License Number
          </Label>
          <Input
            id="licenseNumber"
            value={formData.licenseNumber}
            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
            className={`border-2 ${errors.licenseNumber ? "border-red-500" : "border-gray-200"}`}
            placeholder="Medical license number"
          />
          {errors.licenseNumber && <p className="text-red-500 text-xs">{errors.licenseNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="graduationYear" className="label-required text-sm font-semibold text-gray-700">
            <GraduationCap className="inline h-4 w-4 mr-1 text-green-500" />
            Graduation Year
          </Label>
          <Input
            id="graduationYear"
            type="number"
            min="1950"
            max={new Date().getFullYear()}
            value={formData.graduationYear}
            onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
            className={`border-2 ${errors.graduationYear ? "border-red-500" : "border-gray-200"}`}
          />
          {errors.graduationYear && <p className="text-red-500 text-xs">{errors.graduationYear}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="medicalSchool" className="label-required text-sm font-semibold text-gray-700">
          <BookOpen className="inline h-4 w-4 mr-1 text-orange-500" />
          Medical School/University
        </Label>
        <Input
          id="medicalSchool"
          value={formData.medicalSchool}
          onChange={(e) => setFormData({ ...formData, medicalSchool: e.target.value })}
          className={`border-2 ${errors.medicalSchool ? "border-red-500" : "border-gray-200"}`}
          placeholder="Name of medical school"
        />
        {errors.medicalSchool && <p className="text-red-500 text-xs">{errors.medicalSchool}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="experience" className="label-required text-sm font-semibold text-gray-700">
            <Briefcase className="inline h-4 w-4 mr-1 text-indigo-500" />
            Years of Experience
          </Label>
          <Input
            id="experience"
            type="number"
            min="0"
            max="50"
            value={formData.yearsOfExperience}
            onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
            className={`border-2 ${errors.yearsOfExperience ? "border-red-500" : "border-gray-200"}`}
          />
          {errors.yearsOfExperience && <p className="text-red-500 text-xs">{errors.yearsOfExperience}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="consultationFee" className="text-sm font-semibold text-gray-700">
            <IndianRupee className="inline h-4 w-4 mr-1 text-emerald-500" />
            Consultation Fee (₹)
          </Label>
          <Input
            id="consultationFee"
            type="number"
            min="0"
            value={formData.consultationFees}
            onChange={(e) => setFormData({ ...formData, consultationFees: Number(e.target.value) })}
            className="border-2 border-gray-200"
            placeholder="e.g., 500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="languages" className="label-required text-sm font-semibold text-gray-700">
          <Languages className="inline h-4 w-4 mr-1 text-pink-500" />
          Languages Spoken
        </Label>
        <Input
          id="languages"
          value={formData.languagesKnown}
          onChange={(e) => setFormData({ ...formData, languagesKnown: e.target.value })}
          className={`border-2 ${errors.languagesKnown ? "border-red-500" : "border-gray-200"}`}
          placeholder="e.g., English, Hindi, Marathi"
        />
        {errors.languagesKnown && <p className="text-red-500 text-xs">{errors.languagesKnown}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="qualifications" className="text-sm font-semibold text-gray-700">
          <Award className="inline h-4 w-4 mr-1 text-yellow-500" />
          Additional Qualifications
        </Label>
        <Textarea
          id="qualifications"
          value={formData.additionalQualifications}
          onChange={(e) => setFormData({ ...formData, additionalQualifications: e.target.value })}
          className="border-2 border-gray-200"
          placeholder="List your degrees, certifications, specializations..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="about" className="text-sm font-semibold text-gray-700">
          <Heart className="inline h-4 w-4 mr-1 text-red-500" />
          About Yourself
        </Label>
        <Textarea
          id="about"
          value={formData.aboutYourself}
          onChange={(e) => setFormData({ ...formData, aboutYourself: e.target.value })}
          className="border-2 border-gray-200"
          placeholder="Brief introduction about your practice, approach, achievements..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Step 4: Profile Picture</h3>
        <p className="text-muted-foreground">Add a professional profile picture for your patients</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        {profileImage ? (
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
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
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
            <Camera className="h-8 w-8 text-gray-400" />
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
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : (profileImage ? 'Change Picture' : 'Upload Picture')}
        </Button>
        <p className="text-xs text-gray-500">Recommended: Square image, at least 200x200 pixels</p>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Step 5: Upload Documents</h3>
        <p className="text-muted-foreground">Upload your medical license and certificates</p>
      </div>

      {isUploading ? (
        <PDFLoader />
      ) : (
        <>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleDocumentUpload}
              className="hidden"
              id="document-upload"
            />
            <Label htmlFor="document-upload" className="cursor-pointer">
              <Upload className="mx-auto h-8 w-8 mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Click to upload documents or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB each</p>
            </Label>
          </div>

          {uploadedDocs.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Uploaded Documents:</h4>
              <div className="flex flex-wrap gap-2">
                {uploadedDocs.map((doc, index) => (
                  <div key={index} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm border border-green-200 flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[200px]">{doc.name}</span>
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Step 6: Set Your Schedule</h3>
        <p className="text-muted-foreground">Define your working hours and availability</p>
      </div>

      <div>
        <Label>Working Days</Label>
        <div className="flex flex-wrap gap-2 mt-2">
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

      <div>
        <Label>Consultation Type</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {['Clinic', 'Tele'].map(type => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type as 'Clinic' | 'Tele')}
            >
              {type === 'Tele' ? 'Tele-Consultation' : 'Clinic Consultation'}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>Available Time Slots for {selectedDay} ({selectedType})</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2 max-h-64 overflow-y-auto p-2">
          {timeSlots.map(slot => {
            const isSelected = slotsByDay[selectedDay][selectedType.toLowerCase()].includes(slot);
            const isDisabled = slotsByDay[selectedDay][selectedType === 'Clinic' ? 'tele' : 'clinic'].includes(slot);
            
            return (
              <Button
                key={slot}
                variant={isSelected ? "default" : "outline"}
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
                  } else if (!isDisabled) {
                    setSlotsByDay(prev => ({
                      ...prev,
                      [selectedDay]: {
                        ...prev[selectedDay],
                        [selectedType.toLowerCase()]: [...daySlots, slot].sort()
                      }
                    }));
                  }
                }}
                disabled={isDisabled}
              >
                {slot}
              </Button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {selectedType === 'Clinic' ? 'Clinic' : 'Tele'} slots: {slotsByDay[selectedDay][selectedType.toLowerCase()].length} selected
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Selected Schedule Summary</h4>
        {daysOfWeek.map(day => {
          const clinicSlots = slotsByDay[day].clinic;
          const teleSlots = slotsByDay[day].tele;
          if (clinicSlots.length === 0 && teleSlots.length === 0) return null;
          
          return (
            <div key={day} className="mb-2 text-sm">
              <span className="font-medium">{day}:</span>
              {clinicSlots.length > 0 && (
                <span className="ml-2 text-blue-600">Clinic: {clinicSlots.join(', ')}</span>
              )}
              {teleSlots.length > 0 && (
                <span className="ml-2 text-teal-600">Tele: {teleSlots.join(', ')}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <AuthLayout
      title="Medical Professional Registration"
      description="Join our network of verified healthcare professionals"
      userType="doctor"
    >
      <div className="bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 p-6 rounded-xl">
        <StepIndicator />
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}

          <div className="flex justify-between pt-6">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="border-2 border-gray-300 hover:border-blue-500"
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white ${currentStep === 1 ? "ml-auto" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="ml-auto bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Stethoscope className="mr-2 h-5 w-5" />
                    Complete Registration
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="text-center text-sm text-gray-600">
            Already registered?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold text-blue-600 hover:text-teal-600"
              onClick={() => navigate("/login/doctor")}
            >
              Sign in here →
            </Button>
          </div>
        </form>
      </div>

      <SuccessPopup 
        isOpen={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false);
          navigate("/dashboard/doctor");
        }}
        userType="doctor"
      />
    </AuthLayout>
  );
};

export default DoctorRegistration;