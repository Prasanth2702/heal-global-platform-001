// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';
// import { useNavigate } from 'react-router-dom';
// import { useToast } from '@/hooks/use-toast';
// import { CalendarIcon, Phone, Globe, Heart, Shield, Sparkles, User, Mail, Lock, MapPin, PhoneCall, AlertCircle, Pill, Droplet, ArrowLeft, ArrowRight, Upload, Camera, Check } from 'lucide-react';
// import AuthLayout from './AuthLayout';
// import { supabase } from '@/integrations/supabase/client';
// import { Patient } from '@/Models/Patient';
// import '../../styles/form-input-styles.css';
// import { isValidPhoneNumber } from '../../utils/phoneValidation';
// import mixpanelInstance from "@/utils/mixpanel";
// import { Textarea } from '../ui/textarea';
// import { format } from 'date-fns';
// import { Country, State, City } from "country-state-city";
// import { Progress } from "@/components/ui/progress";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

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

// // Success Popup Component
// const SuccessPopup = ({ isOpen, onClose }) => {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="text-center text-2xl font-bold text-green-600">
//             Welcome to Your Patient Dashboard! 🏥
//           </DialogTitle>
//           <DialogDescription className="text-center pt-4">
//             Your profile has been successfully created. You can now book appointments, access your medical records, and connect with healthcare providers.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="flex justify-center my-4">
//           <div className="bg-green-100 rounded-full p-3">
//             <Check className="h-12 w-12 text-green-600" />
//           </div>
//         </div>
//         <div className="bg-gray-50 rounded-lg p-4 my-2">
//           <h4 className="font-semibold mb-2 text-sm text-gray-700">What's next?</h4>
//           <ul className="space-y-2">
//             <li className="flex items-center text-sm text-gray-600">
//               <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
//               Book appointments with specialists
//             </li>
//             <li className="flex items-center text-sm text-gray-600">
//               <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
//               Access your medical history
//             </li>
//             <li className="flex items-center text-sm text-gray-600">
//               <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
//               Secure messaging with doctors
//             </li>
//             <li className="flex items-center text-sm text-gray-600">
//               <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
//               Prescription management
//             </li>
//           </ul>
//         </div>
//         <div className="flex justify-center mt-4">
//           <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
//             Go to Dashboard
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// // PDF Upload Loader Component
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
//         .loading-text {
//           color: #666;
//           font-size: 14px;
//           font-weight: 500;
//           margin-top: 10px;
//           animation: pulse 1.5s infinite;
//         }
//         @keyframes bounce {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-10px); }
//         }
//         @keyframes loading {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(200%); }
//         }
//         @keyframes pulse {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.5; }
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

// const PatientRegistration = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [date, setDate] = useState<Date | null>(null);
//   const [showManualDate, setShowManualDate] = useState(false);
//   const [isTermsAccepted, setTermsAccepted] = useState(false);
//   const [isPrivacyAccepted, setPrivacyAccepted] = useState(false);
//   const [password, setPassword] = useState('');
//   const [repeatPassword, setRepeatPassword] = useState('');
//   const [countryCode, setCountryCode] = useState('+91');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [emergencyContactCountryCode, setEmergencyContactCountryCode] = useState('+91');
//   const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState('');
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [manualDate, setManualDate] = useState({
//     manualYear: '',
//     manualMonth: '',
//     manualDay: ''
//   });
//   const [profileId, setProfileId] = useState<string>('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [countries] = useState(Country.getAllCountries());
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
  
//   // Onboarding States
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [profileImage, setProfileImage] = useState<string>("");
//   const [uploadedDocs, setUploadedDocs] = useState<Array<{name: string, type: string}>>([]);
//   const [user, setUser] = useState<any>(null);

//   const [formData, setFormData] = useState<Patient>({
//     firstName: '',
//     lastName: '',
//     phoneNumber: '',
//     dateOfBirth: '',
//     gender: '',
//     bloodGroup: '',
//     avatarUrl: '',
//     emergencyContactName: '',
//     emergencyContactPhone: '',
//     userType: 'patient',
//     knownAllergies: '',
//     currentMedications: '',
//     emailAddress: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     country_code: 'India',
//   });

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   // Validation Functions
//   const validateMinLength = (value: string, min: number, fieldName: string): string => {
//     if (!value) return `${fieldName} is required`;
//     if (value.trim().length < min) return `${fieldName} must be at least ${min} characters`;
//     return "";
//   };

//   const validateStep1 = () => {
//     const errors: { [key: string]: string } = {};
//     let valid = true;

//     const firstNameError = validateMinLength(formData.firstName, 3, "First name");
//     if (firstNameError) {
//       errors.firstName = firstNameError;
//       valid = false;
//     }

//     const lastNameError = validateMinLength(formData.lastName, 0, "Last name");
//     if (lastNameError) {
//       errors.lastName = lastNameError;
//       valid = false;
//     }

//     if (!formData.emailAddress) {
//       errors.emailAddress = "Email is required";
//       valid = false;
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
//       errors.emailAddress = "Invalid email format";
//       valid = false;
//     } else if (formData.emailAddress.length < 5) {
//       errors.emailAddress = "Email must be at least 5 characters";
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
    
//     if (!isTermsAccepted || !isPrivacyAccepted) {
//       errors.terms = "Please accept terms and privacy policy";
//       valid = false;
//     }

//     setErrors(errors);
//     return valid;
//   };

//   const validateStep2 = () => {
//     const errors: { [key: string]: string } = {};
//     let valid = true;

//     if (showManualDate) {
//       if (!manualDate.manualYear) {
//         errors.manualYear = "Year is required";
//         valid = false;
//       }
//       if (!manualDate.manualMonth) {
//         errors.manualMonth = "Month is required";
//         valid = false;
//       }
//       if (!manualDate.manualDay) {
//         errors.manualDay = "Day is required";
//         valid = false;
//       }
//     } else if (!formData.dateOfBirth) {
//       errors.dateOfBirth = "Date of birth is required";
//       valid = false;
//     }

//     if (!formData.gender) {
//       errors.gender = "Gender is required";
//       valid = false;
//     }

//     if (!formData.bloodGroup) {
//       errors.bloodGroup = "Blood group is required";
//       valid = false;
//     }

//     setErrors(errors);
//     return valid;
//   };

//   const validateStep3 = () => {
//     const errors: { [key: string]: string } = {};
//     let valid = true;

//     const addressError = validateMinLength(formData.address, 10, "Address");
//     if (addressError) {
//       errors.address = addressError;
//       valid = false;
//     }

//     const cityError = validateMinLength(formData.city, 3, "City");
//     if (cityError) {
//       errors.city = cityError;
//       valid = false;
//     }

//     const stateError = validateMinLength(formData.state, 3, "State");
//     if (stateError) {
//       errors.state = stateError;
//       valid = false;
//     }

//     if (!formData.country_code) {
//       errors.country_code = "Country is required";
//       valid = false;
//     }

//     if (!formData.pincode) {
//       errors.pincode = "Pincode is required";
//       valid = false;
//     } else if (formData.pincode.length !== 6) {
//       errors.pincode = "Pincode must be 6 digits";
//       valid = false;
//     } else if (!/^\d+$/.test(formData.pincode)) {
//       errors.pincode = "Pincode must contain only digits";
//       valid = false;
//     }

//     setErrors(errors);
//     return valid;
//   };

//   const validateStep4 = () => {
//     const errors: { [key: string]: string } = {};
//     let valid = true;

//     const contactNameError = validateMinLength(formData.emergencyContactName, 3, "Emergency contact name");
//     if (contactNameError) {
//       errors.emergencyContactName = contactNameError;
//       valid = false;
//     }

//     if (!emergencyPhoneNumber) {
//       errors.emergencyPhoneNumber = "Emergency contact phone is required";
//       valid = false;
//     } else if (emergencyPhoneNumber.length !== 10) {
//       errors.emergencyPhoneNumber = "Phone number must be 10 digits";
//       valid = false;
//     } else if (!/^\d+$/.test(emergencyPhoneNumber)) {
//       errors.emergencyPhoneNumber = "Phone number must contain only digits";
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

//   // Check user on mount
//   useEffect(() => {
//     const checkUser = async () => {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError || !user) {
//         return;
//       }
//       setUser(user);
//     };
//     checkUser();
//   }, []);

//   // Country/State/City effects
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
//         const countryCities = City.getCitiesOfState(
//           selectedCountry.isoCode, 
//           selectedState.isoCode
//         );
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

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

//   // Date handlers
//   const handleDateSelect = (selectedDate: Date | undefined) => {
//     if (selectedDate && !showManualDate) {
//       setDate(selectedDate);
//       setFormData({
//         ...formData,
//         dateOfBirth: format(selectedDate, 'yyyy-MM-dd')
//       });
//     }
//   };

//   const handleManualDateChange = (updatedManualDate: { manualYear: string; manualMonth: string; manualDay: string }) => {
//     if (
//       updatedManualDate.manualYear &&
//       updatedManualDate.manualMonth &&
//       updatedManualDate.manualDay
//     ) {
//       const monthIndex = months.indexOf(updatedManualDate.manualMonth);
//       const dateString = `${updatedManualDate.manualYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(updatedManualDate.manualDay).padStart(2, '0')}`;
//       const newDate = new Date(dateString);
//       setDate(newDate);
//       setFormData(prev => ({
//         ...prev,
//         dateOfBirth: dateString
//       }));
//     }
//   };

//   const generateCandidateId = (): string => {
//     const year = new Date().getFullYear().toString();
//     const randomDigits = Math.floor(Math.random() * 100000)
//       .toString()
//       .padStart(5, '0');
//     const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
//     return `${year}${randomDigits}${randomLetter}`;
//   };

//   const generateUniqueId = async () => {
//     let id = '';
//     let exists = true;

//     while (exists) {
//       const candidate = generateCandidateId();

//       const { data } = await supabase
//         .from('profiles')
//         .select('profile_id')
//         .eq('profile_id', candidate)
//         .single();

//       if (!data) {
//         id = candidate;
//         exists = false;
//       }
//     }

//     return id;
//   };

//   useEffect(() => {
//     (async () => {
//       const id = await generateUniqueId();
//       setProfileId(id);
//       setFormData(prev => ({ ...prev, profile_id: id }));
//     })();
//   }, []);

//   // Save Step 1 Data
//   const saveStep1Data = async () => {
//     setIsSubmitting(true);
    
//     try {
//       const fullPhoneNumber = countryCode + phoneNumber;
      
//       const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
//         email: formData.emailAddress.toLowerCase(),
//         password: password,
//         options: {
//           data: {
//             first_name: formData.firstName,
//             last_name: formData.lastName,
//             phone_number: fullPhoneNumber,
//             avatar_url: profileImage,
//             role: 'patient',
//           },
//         },
//       });

//       if (signUpError) {
//         toast({
//           title: 'Registration Failed',
//           description: signUpError.message,
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return false;
//       }

//       const userId = signUpData.user?.id;
//       if (!userId) {
//         toast({
//           title: 'Registration Failed',
//           description: 'Could not retrieve user information',
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return false;
//       }

//       // setUser({ id: userId });

//       // const { error: profileError } = await supabase
      
      
//           // Update profile with additional info
//             const { data: existingProfile, error: checkError } = await supabase
//                   .from('profiles')
//                   .select('id')
//                   .eq('id', userId)
//                   .maybeSingle();
            
//                 let profileError;

//                 await supabase
//         .from('profiles')
//         .update({
//           first_name: formData.firstName,
//           last_name: formData.lastName,
//           phone_number: fullPhoneNumber,
//           role: 'patient',
//           avatar_url: profileImage,
//           profile_id: profileId,
//         })
//         .eq('email', formData.emailAddress);

//       if (profileError) {
//         console.error('Error updating profile:', profileError);
//       }

//       toast({
//         title: 'Step 1 Completed',
//         description: 'Personal information saved successfully!',
//       });
      
//       setIsSubmitting(false);
//       return true;
      
//     } catch (error) {
//       console.error('Error saving step 1:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to save personal information',
//         variant: 'destructive',
//       });
//       setIsSubmitting(false);
//       return false;
//     }
//   };

//   // Save Step 2 Data
//   const saveStep2Data = async () => {
//     setIsSubmitting(true);
    
//     try {
//       let userId = user?.id;
//       if (!userId) {
//         const { data: { user: currentUser } } = await supabase.auth.getUser();
//         userId = currentUser?.id;
//         if (userId) {
//           setUser({ id: userId });
//         }
//       }
      
//       if (!userId) {
//         toast({
//           title: 'Error',
//           description: 'User not found. Please complete step 1 first.',
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return false;
//       }

//       let dateOfBirth = formData.dateOfBirth;
//       if (date) {
//         dateOfBirth = format(date, 'yyyy-MM-dd');
//       }

//       const { error: patientError } = await supabase
//         .from('patients')
//         .upsert({
//           user_id: userId,
//           gender: formData.gender,
//           date_of_birth: dateOfBirth,
//           blood_group: formData.bloodGroup,
//           known_allergies: formData.knownAllergies,
//           current_medications: formData.currentMedications,
//         }, { onConflict: 'user_id' });

//       if (patientError) {
//         console.error('Error saving medical info:', patientError);
//         toast({
//           title: 'Error',
//           description: patientError.message || 'Failed to save medical information',
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return false;
//       }

//       toast({
//         title: 'Step 2 Completed',
//         description: 'Medical information saved successfully!',
//       });
      
//       setIsSubmitting(false);
//       return true;
      
//     } catch (error) {
//       console.error('Error saving step 2:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to save medical information',
//         variant: 'destructive',
//       });
//       setIsSubmitting(false);
//       return false;
//     }
//   };

//   // Save Step 3 Data
//   const saveStep3Data = async () => {
//     setIsSubmitting(true);
    
//     try {
//       let userId = user?.id;
//       if (!userId) {
//         const { data: { user: currentUser } } = await supabase.auth.getUser();
//         userId = currentUser?.id;
//       }
      
//       if (!userId) {
//         toast({
//           title: 'Error',
//           description: 'User not found. Please complete step 1 first.',
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return false;
//       }

//       const { error: patientError } = await supabase
//         .from('patients')
//         .upsert({
//           user_id: userId,
//           address: formData.address,
//           city: formData.city,
//           state: formData.state,
//           pincode: formData.pincode,
//           country_code: formData.country_code,
//         }, { onConflict: 'user_id' });

//       if (patientError) {
//         console.error('Error saving address:', patientError);
//         toast({
//           title: 'Error',
//           description: patientError.message || 'Failed to save address information',
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return false;
//       }

//       toast({
//         title: 'Step 3 Completed',
//         description: 'Address information saved successfully!',
//       });
      
//       setIsSubmitting(false);
//       return true;
      
//     } catch (error) {
//       console.error('Error saving step 3:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to save address information',
//         variant: 'destructive',
//       });
//       setIsSubmitting(false);
//       return false;
//     }
//   };

//   // Profile Image Upload Handler
//   const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setIsUploading(true);

//     const cleanFileName = file.name
//       .replace(/\s+/g, "_")
//       .replace(/[^\w.-]/g, "")
//       .toLowerCase();

//     const filePath = `profile_images/${Date.now()}_${cleanFileName}`;
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
//     setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));

//     // Update profile if user exists
//     if (user?.id) {
//       const { error: updateError } = await supabase
//         .from('profiles')
//         .update({ avatar_url: publicUrl })
//         .eq('id', user.id);

//       if (updateError) {
//         console.error('Error updating profile picture:', updateError);
//       }
//     }

//     setIsUploading(false);

//     toast({
//       title: "Profile Picture Updated",
//       description: "Your profile picture has been uploaded.",
//     });
//   };

//   // Document Upload Handler
//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (!files) return;
    
//     setIsUploading(true);
    
//     for (let file of files) {
//       try {
//         if (file.type === 'application/pdf') {
//           await new Promise(resolve => setTimeout(resolve, 2000));
//         }
        
//         const cleanFileName = file.name
//           .replace(/\s+/g, "_")
//           .replace(/[^\w.-]/g, "")
//           .toLowerCase();

//         const filePath = `medical_documents/${Date.now()}_${cleanFileName}`;
//         const { error } = await supabase
//           .storage
//           .from('heal_med_app_files_bucket')
//           .upload(filePath, file, {
//             cacheControl: '3600',
//             upsert: false
//           });

//         if (error) {
//           toast({
//             title: "Upload failed",
//             description: error.message,
//             variant: "destructive",
//           });
//           setIsUploading(false);
//           return;
//         } else {
//           setUploadedDocs(prev => [...prev, { 
//             name: file.name, 
//             type: 'patient' 
//           }]);
//           toast({
//             title: "Document Uploaded",
//             description: `${file.name} uploaded successfully.`,
//           });
//         }
//       } catch (err) {
//         console.error('Upload error:', err);
//         toast({
//           title: "Upload Failed",
//           description: "An unexpected error occurred.",
//           variant: "destructive",
//         });
//       }
//     }
    
//     setIsUploading(false);
//   };

//   // Final Submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateStep4()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       let userId = user?.id;
//       if (!userId) {
//         const { data: { user: currentUser } } = await supabase.auth.getUser();
//         userId = currentUser?.id;
//       }
      
//       if (!userId) {
//         toast({
//           title: 'Error',
//           description: 'User not found. Please complete previous steps.',
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return;
//       }

//       const { error: patientError } = await supabase
//         .from('patients')
//         .upsert({
//           user_id: userId,
//           emergency_contact_name: formData.emergencyContactName,
//           emergency_contact_number: emergencyContactCountryCode + emergencyPhoneNumber,
//         }, { onConflict: 'user_id' });

//       if (patientError) {
//         console.error('Error saving emergency info:', patientError);
//         toast({
//           title: 'Error',
//           description: patientError.message || 'Failed to save emergency contact information',
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return;
//       }

//       mixpanelInstance.track('Patient Registration Success', {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.emailAddress,
//         userId: userId,
//       });

//       toast({
//         title: '🎉 Registration Successful!',
//         description: 'Welcome to NextGen Medical Platform.',
//       });

//       setShowSuccessPopup(true);
      
//     } catch (error) {
//       console.error('Error in final submission:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to complete registration',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle Next
//   const handleNext = async () => {
//     let isValid = false;
    
//     if (currentStep === 1) {
//       isValid = validateStep1();
//       if (isValid) {
//         const success = await saveStep1Data();
//         if (success) {
//           setCurrentStep(prev => prev + 1);
//           window.scrollTo(0, 0);
//         }
//       }
//     } else if (currentStep === 2) {
//       isValid = validateStep2();
//       if (isValid) {
//         const success = await saveStep2Data();
//         if (success) {
//           setCurrentStep(prev => prev + 1);
//           window.scrollTo(0, 0);
//         }
//       }
//     } else if (currentStep === 3) {
//       isValid = validateStep3();
//       if (isValid) {
//         const success = await saveStep3Data();
//         if (success) {
//           setCurrentStep(prev => prev + 1);
//           window.scrollTo(0, 0);
//         }
//       }
//     } else if (currentStep === 4) {
//       isValid = validateStep4();
//       if (isValid) {
//         await handleSubmit(new Event('submit') as any);
//       }
//     }
//   };

//   const handleBack = () => {
//     setCurrentStep(prev => prev - 1);
//     window.scrollTo(0, 0);
//   };

//   const handleSuccessPopupClose = () => {
//     setShowSuccessPopup(false);
//     navigate('/dashboard/patient');
//   };

//   const StepIndicator = () => (
//     <div className="mb-8 px-4">
//       <div className="flex items-center justify-between relative">
//         {[1, 2, 3, 4].map((step) => (
//           <div key={step} className="flex items-center flex-1">
//             <div className="relative flex flex-col items-center group">
//               <div
//                 className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
//                   currentStep >= step
//                     ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-200 scale-110"
//                     : "bg-gray-200 text-gray-500"
//                 } ${currentStep === step ? "ring-4 ring-blue-200" : ""}`}
//               >
//                 {step === 1 && <User className="h-5 w-5" />}
//                 {step === 2 && <Heart className="h-5 w-5" />}
//                 {step === 3 && <MapPin className="h-5 w-5" />}
//                 {step === 4 && <Shield className="h-5 w-5" />}
//               </div>
//               <span className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap ${
//                 currentStep >= step ? "text-blue-600" : "text-gray-500"
//               }`}>
//                 {step === 1 && "Personal"}
//                 {step === 2 && "Medical"}
//                 {step === 3 && "Address"}
//                 {step === 4 && "Emergency"}
//               </span>
//             </div>
//             {step < 4 && (
//               <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
//                 currentStep > step ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gray-200"
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
//         <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Personal Information
//         </h3>
//         <p className="text-sm text-gray-500">Tell us about yourself</p>
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
//             className={`border-2 ${errors.firstName ? "border-red-500" : "border-gray-200"} focus:border-blue-500 transition-colors`}
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
//             className={`border-2 ${errors.lastName ? "border-red-500" : "border-gray-200"} focus:border-blue-500 transition-colors`}
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
//           className={`border-2 ${errors.emailAddress ? "border-red-500" : "border-gray-200"} focus:border-blue-500 transition-colors`}
//           placeholder="john.doe@example.com"
//         />
//         {errors.emailAddress && <p className="text-red-500 text-xs">{errors.emailAddress}</p>}
//       </div>

//       <div className="space-y-2">
//         <Label className="label-required text-sm font-semibold text-gray-700">Phone Number</Label>
//         <div className="flex space-x-2">
//           <Select value={countryCode} onValueChange={(value) => setCountryCode(value)}>
//             <SelectTrigger className="w-24 border-2 border-gray-200 focus:border-blue-500">
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
//           <div className="relative flex-1">
//             <Input
//               type="tel"
//               value={phoneNumber}
//               maxLength={10}
//               onChange={(e) => {
//                 const value = e.target.value.replace(/\D/g, "");
//                 if (value.length <= 10) setPhoneNumber(value);
//               }}
//               className={`border-2 ${errors.phoneNumber ? "border-red-500" : "border-gray-200"} focus:border-blue-500 transition-colors`}
//               placeholder="9876543210"
//             />
//           </div>
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
//           className={`border-2 ${errors.password ? "border-red-500" : "border-gray-200"} focus:border-blue-500`}
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
//           className={`border-2 ${errors.repeatPassword ? "border-red-500" : "border-gray-200"} focus:border-blue-500`}
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

//       <div className="space-y-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
//         <div className="flex items-center space-x-3">
//           <Checkbox
//             id="terms"
//             checked={isTermsAccepted}
//             onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
//           />
//           <Label htmlFor="terms" className="text-sm">
//             I accept the <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate("/terms")}>Terms and Conditions</span>
//           </Label>
//         </div>

//         <div className="flex items-center space-x-3">
//           <Checkbox
//             id="privacy"
//             checked={isPrivacyAccepted}
//             onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
//           />
//           <Label htmlFor="privacy" className="text-sm">
//             I accept the <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate("/privacy")}>Privacy Policy</span>
//           </Label>
//         </div>
//         {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
//       </div>
//     </div>
//   );

//   const renderStep2 = () => (
//     <div className="space-y-5">
//       <div className="text-center mb-6">
//         <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Medical Information
//         </h3>
//         <p className="text-sm text-gray-500">Help us provide better care</p>
//       </div>

//       <div className="space-y-2">
//         <Label className="label-required text-sm font-semibold text-gray-700">Date of Birth</Label>
//         <div className="flex items-center space-x-3">
//           <div className="relative flex-1">
//             <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//             <Input
//               type="date"
//               value={formData.dateOfBirth}
//               onChange={(e) => {
//                 const selectedDate = new Date(e.target.value);
//                 handleDateSelect(selectedDate);
//                 setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }));
//               }}
//               disabled={showManualDate}
//               className={`pl-9 border-2 ${errors.dateOfBirth ? "border-red-500" : "border-gray-200"} focus:border-blue-500`}
//             />
//           </div>
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => setShowManualDate(!showManualDate)}
//             className="border-2 border-gray-200 hover:border-purple-500"
//           >
//             <Globe className="mr-2 h-4 w-4" />
//             Manual
//           </Button>
//         </div>
//         {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth}</p>}

//         {showManualDate && (
//           <div className="grid grid-cols-3 gap-3 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
//             <div>
//               <Label className="text-xs font-semibold">Year</Label>
//               <Select
//                 value={manualDate.manualYear}
//                 onValueChange={(value) => {
//                   const updated = { ...manualDate, manualYear: value };
//                   setManualDate(updated);
//                   handleManualDateChange(updated);
//                 }}
//               >
//                 <SelectTrigger className={`border-2 ${errors.manualYear ? "border-red-500" : "border-gray-200"}`}>
//                   <SelectValue placeholder="Year" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {years.map((year) => (
//                     <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label className="text-xs font-semibold">Month</Label>
//               <Select
//                 value={manualDate.manualMonth}
//                 onValueChange={(value) => {
//                   const updated = { ...manualDate, manualMonth: value };
//                   setManualDate(updated);
//                   handleManualDateChange(updated);
//                 }}
//               >
//                 <SelectTrigger className={`border-2 ${errors.manualMonth ? "border-red-500" : "border-gray-200"}`}>
//                   <SelectValue placeholder="Month" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {months.map((month) => (
//                     <SelectItem key={month} value={month}>{month}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label className="text-xs font-semibold">Day</Label>
//               <Select
//                 value={manualDate.manualDay}
//                 onValueChange={(value) => {
//                   const updated = { ...manualDate, manualDay: value };
//                   setManualDate(updated);
//                   handleManualDateChange(updated);
//                 }}
//               >
//                 <SelectTrigger className={`border-2 ${errors.manualDay ? "border-red-500" : "border-gray-200"}`}>
//                   <SelectValue placeholder="Day" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
//                     <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="gender" className="label-required text-sm font-semibold text-gray-700">Gender</Label>
//           <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
//             <SelectTrigger className={`border-2 ${errors.gender ? "border-red-500" : "border-gray-200"} focus:border-blue-500`}>
//               <SelectValue placeholder="Select gender" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="male">Male</SelectItem>
//               <SelectItem value="female">Female</SelectItem>
//               <SelectItem value="other">Other</SelectItem>
//             </SelectContent>
//           </Select>
//           {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="bloodGroup" className="label-required text-sm font-semibold text-gray-700">Blood Group</Label>
//           <Select value={formData.bloodGroup} onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}>
//             <SelectTrigger className={`border-2 ${errors.bloodGroup ? "border-red-500" : "border-gray-200"} focus:border-red-500`}>
//               <SelectValue placeholder="Select blood group" />
//             </SelectTrigger>
//             <SelectContent>
//               {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
//                 <SelectItem key={bg} value={bg}>{bg} 🩸</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {errors.bloodGroup && <p className="text-red-500 text-xs">{errors.bloodGroup}</p>}
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="allergies" className="text-sm font-semibold text-gray-700">
//           <AlertCircle className="inline h-4 w-4 mr-1 text-yellow-500" />
//           Known Allergies
//         </Label>
//         <Input
//           id="allergies"
//           value={formData.knownAllergies}
//           onChange={(e) => setFormData({ ...formData, knownAllergies: e.target.value })}
//           className="border-2 border-gray-200 focus:border-yellow-500"
//           placeholder="e.g., Penicillin, Shellfish"
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="currentMedications" className="text-sm font-semibold text-gray-700">
//           <Pill className="inline h-4 w-4 mr-1 text-green-500" />
//           Current Medications
//         </Label>
//         <Input
//           id="currentMedications"
//           value={formData.currentMedications}
//           onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
//           className="border-2 border-gray-200 focus:border-green-500"
//           placeholder="List medications with dosage"
//         />
//       </div>
//     </div>
//   );

//   const renderStep3 = () => (
//     <div className="space-y-5">
//       <div className="text-center mb-6">
//         <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Address Information
//         </h3>
//         <p className="text-sm text-gray-500">Where do you live?</p>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="address" className="label-required text-sm font-semibold text-gray-700">
//           Address
//         </Label>
//         <Textarea
//           id="address"
//           value={formData.address}
//           onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//           className={`border-2 ${errors.address ? "border-red-500" : "border-gray-200"} focus:border-blue-500`}
//           placeholder="Enter your complete address"
//           rows={3}
//         />
//         {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="country" className="label-required text-sm font-semibold text-gray-700">Country</Label>
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
//           {errors.country_code && <p className="text-red-500 text-xs">{errors.country_code}</p>}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="state" className="label-required text-sm font-semibold text-gray-700">State</Label>
//           <select
//             id="state"
//             value={formData.state || ''}
//             onChange={(e) => setFormData({ 
//               ...formData, 
//               state: e.target.value,
//               city: ''
//             })}
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
//           {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="city" className="label-required text-sm font-semibold text-gray-700">City</Label>
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
//           {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="pincode" className="label-required text-sm font-semibold text-gray-700">Pincode</Label>
//           <Input
//             id="pincode"
//             value={formData.pincode}
//             onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
//             className={errors.pincode ? "border-red-500" : "border-gray-200"}
//             maxLength={6}
//             placeholder="400001"
//           />
//           {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode}</p>}
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep4 = () => (
//     <div className="space-y-5">
//       <div className="text-center mb-6">
//         <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Emergency & Profile Setup
//         </h3>
//         <p className="text-sm text-gray-500">Complete your profile</p>
//       </div>

//       {/* Profile Picture Upload */}
//       <div className="space-y-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
//         <h4 className="font-semibold text-purple-800 flex items-center">
//           <Camera className="h-5 w-5 mr-2" />
//           Profile Picture
//         </h4>
//         <div className="flex flex-col items-center space-y-4">
//           {profileImage ? (
//             <div className="relative">
//               <img
//                 src={profileImage}
//                 alt="Profile"
//                 className="w-24 h-24 rounded-full object-cover border-4 border-purple-400"
//               />
//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="absolute bottom-0 right-0 rounded-full bg-white"
//                 onClick={() => document.getElementById('profile-upload')?.click()}
//               >
//                 <Camera className="h-3 w-3" />
//               </Button>
//             </div>
//           ) : (
//             <div className="w-24 h-24 rounded-full border-2 border-dashed border-purple-400 flex items-center justify-center">
//               <Camera className="h-8 w-8 text-purple-400" />
//             </div>
//           )}
//           <Input
//             type="file"
//             accept="image/*"
//             onChange={handleProfileImageUpload}
//             className="hidden"
//             id="profile-upload"
//           />
//           <Button
//             variant="outline"
//             onClick={() => document.getElementById('profile-upload')?.click()}
//             className="border-purple-300 text-purple-700"
//             disabled={isUploading}
//           >
//             {isUploading ? 'Uploading...' : (profileImage ? 'Change Picture' : 'Upload Picture')}
//           </Button>
//         </div>
//       </div>

//       {/* Document Upload */}
//       <div className="space-y-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
//         <h4 className="font-semibold text-blue-800 flex items-center">
//           <Upload className="h-5 w-5 mr-2" />
//           Upload Documents
//         </h4>
//         <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
//           <Input
//             type="file"
//             multiple
//             accept=".pdf,.jpg,.jpeg,.png"
//             onChange={handleFileUpload}
//             className="hidden"
//             id="document-upload"
//           />
//           <Label htmlFor="document-upload" className="cursor-pointer">
//             <Upload className="mx-auto h-8 w-8 mb-2 text-blue-500" />
//             <p className="text-sm text-blue-600">Click to upload medical documents</p>
//             <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB each</p>
//           </Label>
//         </div>

//         {uploadedDocs.length > 0 && (
//           <div className="mt-3">
//             <h5 className="text-xs font-semibold text-gray-600 mb-2">Uploaded Documents:</h5>
//             <div className="flex flex-wrap gap-2">
//               {uploadedDocs.map((doc, index) => (
//                 <div key={index} className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
//                   <Check className="h-3 w-3" />
//                   <span className="truncate max-w-[120px]">{doc.name}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Emergency Contact */}
//       <div className="space-y-4 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
//         <h4 className="font-semibold text-orange-800 flex items-center">
//           <PhoneCall className="h-5 w-5 mr-2" />
//           Emergency Contact Information
//         </h4>

//         <div className="space-y-2">
//           <Label htmlFor="emergencyContact" className="label-required text-sm font-semibold text-gray-700">
//             Emergency Contact Name
//           </Label>
//           <Input
//             id="emergencyContact"
//             value={formData.emergencyContactName}
//             onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
//             className={`border-2 ${errors.emergencyContactName ? "border-red-500" : "border-gray-200"} focus:border-orange-500`}
//             placeholder="Full name of emergency contact"
//           />
//           {errors.emergencyContactName && <p className="text-red-500 text-xs">{errors.emergencyContactName}</p>}
//         </div>

//         <div className="space-y-2">
//           <Label className="label-required text-sm font-semibold text-gray-700">Emergency Contact Phone</Label>
//           <div className="flex space-x-2">
//             <Select value={emergencyContactCountryCode} onValueChange={(value) => setEmergencyContactCountryCode(value)}>
//               <SelectTrigger className="w-24 border-2 border-gray-200 focus:border-orange-500">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {countryCodes.map((country) => (
//                   <SelectItem key={country.code} value={country.code}>
//                     <span>{country.flag} {country.code}</span>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <div className="relative flex-1">
//               <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//               <Input
//                 type="tel"
//                 value={emergencyPhoneNumber}
//                 maxLength={10}
//                 onChange={(e) => {
//                   const value = e.target.value.replace(/\D/g, "");
//                   if (value.length <= 10) setEmergencyPhoneNumber(value);
//                 }}
//                 className={`pl-9 border-2 ${errors.emergencyPhoneNumber ? "border-red-500" : "border-gray-200"} focus:border-orange-500`}
//                 placeholder="9876543210"
//               />
//             </div>
//           </div>
//           {errors.emergencyPhoneNumber && <p className="text-red-500 text-xs">{errors.emergencyPhoneNumber}</p>}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <AuthLayout
//       title="Join as Patient"
//       description="🌟 Your health journey starts here"
//       userType="patient"
//     >
//       <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 rounded-xl">
//         <StepIndicator />
        
//         <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
//           {currentStep === 1 && renderStep1()}
//           {currentStep === 2 && renderStep2()}
//           {currentStep === 3 && renderStep3()}
//           {currentStep === 4 && renderStep4()}

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
            
//             {currentStep < 4 ? (
//               <Button
//                 type="button"
//                 onClick={handleNext}
//                 disabled={isSubmitting}
//                 className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white ${currentStep === 1 ? "ml-auto" : ""}`}
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
//                 onClick={handleNext}
//                 disabled={isSubmitting}
//                 className="ml-auto bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <span className="animate-spin mr-2">⟳</span>
//                     Creating Account...
//                   </>
//                 ) : (
//                   <>
//                     <Heart className="mr-2 h-5 w-5" />
//                     Complete Registration
//                   </>
//                 )}
//               </Button>
//             )}
//           </div>

//           <div className="text-center text-sm text-gray-600">
//             Already have an account?{" "}
//             <Button
//               variant="link"
//               className="p-0 h-auto font-semibold text-blue-600 hover:text-purple-600"
//               onClick={() => navigate("/login/patient")}
//             >
//               Sign in here →
//             </Button>
//           </div>
//         </form>
//       </div>

//       <SuccessPopup 
//         isOpen={showSuccessPopup}
//         onClose={handleSuccessPopupClose}
//       />

//       {isUploading && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6">
//             <PDFLoader />
//           </div>
//         </div>
//       )}
//     </AuthLayout>
//   );
// };

// export default PatientRegistration;

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon, Phone, Globe, Heart, Shield, Sparkles, User, Mail, Lock, MapPin, PhoneCall, AlertCircle, Pill, Droplet, ArrowLeft, ArrowRight, Upload, Camera, Check } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/Models/Patient';
import '../../styles/form-input-styles.css';
import { isValidPhoneNumber } from '../../utils/phoneValidation';
import mixpanelInstance from "@/utils/mixpanel";
import { Textarea } from '../ui/textarea';
import { format } from 'date-fns';
import { Country, State } from "country-state-city";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

// Success Popup Component
const SuccessPopup = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-green-600">
            Welcome to Your Patient Dashboard! 🏥
          </DialogTitle>
          <DialogDescription className="text-center pt-4">
            Your profile has been successfully created. You can now book appointments, access your medical records, and connect with healthcare providers.
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
            <li className="flex items-center text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              Book appointments with specialists
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              Access your medical history
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              Secure messaging with doctors
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              Prescription management
            </li>
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

const PatientRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [date, setDate] = useState<Date | null>(null);
  const [showManualDate, setShowManualDate] = useState(false);
  const [isTermsAccepted, setTermsAccepted] = useState(false);
  const [isPrivacyAccepted, setPrivacyAccepted] = useState(false);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emergencyContactCountryCode, setEmergencyContactCountryCode] = useState('+91');
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [manualDate, setManualDate] = useState({
    manualYear: '',
    manualMonth: '',
    manualDay: ''
  });
  const [profileId, setProfileId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Onboarding States
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const [uploadedDocs, setUploadedDocs] = useState<Array<{name: string, type: string}>>([]);
  const [user, setUser] = useState<any>(null);
  
  // Store Step 1 Data After Submission
  const [step1Completed, setStep1Completed] = useState(false);
  const [savedUserId, setSavedUserId] = useState<string>('');

  const [formData, setFormData] = useState<Patient>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    avatarUrl: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    userType: 'patient',
    knownAllergies: '',
    currentMedications: '',
    emailAddress: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country_code: 'India',
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Validation Functions
  const validateMinLength = (value: string, min: number, fieldName: string): string => {
    if (!value) return `${fieldName} is required`;
    if (value.trim().length < min) return `${fieldName} must be at least ${min} characters`;
    return "";
  };

  const validateStep1 = () => {
    const errors: { [key: string]: string } = {};
    let valid = true;

    const firstNameError = validateMinLength(formData.firstName, 3, "First name");
    if (firstNameError) {
      errors.firstName = firstNameError;
      valid = false;
    }

    const lastNameError = validateMinLength(formData.lastName, 0, "Last name");
    if (lastNameError) {
      errors.lastName = lastNameError;
      valid = false;
    }

    if (!formData.emailAddress) {
      errors.emailAddress = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      errors.emailAddress = "Invalid email format";
      valid = false;
    } else if (formData.emailAddress.length < 5) {
      errors.emailAddress = "Email must be at least 5 characters";
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
    
    if (!isTermsAccepted || !isPrivacyAccepted) {
      errors.terms = "Please accept terms and privacy policy";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const validateStep2 = () => {
    const errors: { [key: string]: string } = {};
    let valid = true;

    if (showManualDate) {
      if (!manualDate.manualYear) {
        errors.manualYear = "Year is required";
        valid = false;
      }
      if (!manualDate.manualMonth) {
        errors.manualMonth = "Month is required";
        valid = false;
      }
      if (!manualDate.manualDay) {
        errors.manualDay = "Day is required";
        valid = false;
      }
    } else if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
      valid = false;
    }

    if (!formData.gender) {
      errors.gender = "Gender is required";
      valid = false;
    }

    if (!formData.bloodGroup) {
      errors.bloodGroup = "Blood group is required";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const validateStep3 = () => {
    const errors: { [key: string]: string } = {};
    let valid = true;

    const addressError = validateMinLength(formData.address, 10, "Address");
    if (addressError) {
      errors.address = addressError;
      valid = false;
    }

    const cityError = validateMinLength(formData.city, 3, "City");
    if (cityError) {
      errors.city = cityError;
      valid = false;
    }

    const stateError = validateMinLength(formData.state, 3, "State");
    if (stateError) {
      errors.state = stateError;
      valid = false;
    }

    if (!formData.country_code) {
      errors.country_code = "Country is required";
      valid = false;
    }

    if (!formData.pincode) {
      errors.pincode = "Pincode is required";
      valid = false;
    } else if (formData.pincode.length !== 6) {
      errors.pincode = "Pincode must be 6 digits";
      valid = false;
    } else if (!/^\d+$/.test(formData.pincode)) {
      errors.pincode = "Pincode must contain only digits";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const validateStep4 = () => {
    const errors: { [key: string]: string } = {};
    let valid = true;

    const contactNameError = validateMinLength(formData.emergencyContactName, 3, "Emergency contact name");
    if (contactNameError) {
      errors.emergencyContactName = contactNameError;
      valid = false;
    }

    if (!emergencyPhoneNumber) {
      errors.emergencyPhoneNumber = "Emergency contact phone is required";
      valid = false;
    } else if (emergencyPhoneNumber.length !== 10) {
      errors.emergencyPhoneNumber = "Phone number must be 10 digits";
      valid = false;
    } else if (!/^\d+$/.test(emergencyPhoneNumber)) {
      errors.emergencyPhoneNumber = "Phone number must contain only digits";
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

  // Check user on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        return;
      }
      setUser(user);
    };
    checkUser();
  }, []);

  // Country/State/City effects
  useEffect(() => {
    if (formData.country_code) {
      const selectedCountry = countries.find(c => c.name === formData.country_code);
      if (selectedCountry) {
        const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
        setStates(countryStates);
        if (!countryStates.find(s => s.isoCode === formData.state)) {
          setFormData(prev => ({ ...prev, state: '', city: '' }));
          setCities([]);
        }
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
    if (formData.country_code && formData.state) {
      const selectedCountry = countries.find(c => c.name === formData.country_code);
      const selectedState = states.find(s => s.name === formData.state);
      
      
    } else {
      setCities([]);
    }
  }, [formData.country_code, formData.state, countries, states]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Date handlers
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && !showManualDate) {
      setDate(selectedDate);
      setFormData({
        ...formData,
        dateOfBirth: format(selectedDate, 'yyyy-MM-dd')
      });
    }
  };

  const handleManualDateChange = (updatedManualDate: { manualYear: string; manualMonth: string; manualDay: string }) => {
    if (
      updatedManualDate.manualYear &&
      updatedManualDate.manualMonth &&
      updatedManualDate.manualDay
    ) {
      const monthIndex = months.indexOf(updatedManualDate.manualMonth);
      const dateString = `${updatedManualDate.manualYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(updatedManualDate.manualDay).padStart(2, '0')}`;
      const newDate = new Date(dateString);
      setDate(newDate);
      setFormData(prev => ({
        ...prev,
        dateOfBirth: dateString
      }));
    }
  };

  const generateCandidateId = (): string => {
    const year = new Date().getFullYear().toString();
    const randomDigits = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, '0');
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return `${year}${randomDigits}${randomLetter}`;
  };

  const generateUniqueId = async () => {
    let id = '';
    let exists = true;

    while (exists) {
      const candidate = generateCandidateId();

      const { data } = await supabase
        .from('profiles')
        .select('profile_id')
        .eq('profile_id', candidate)
        .single();

      if (!data) {
        id = candidate;
        exists = false;
      }
    }

    return id;
  };

  useEffect(() => {
    (async () => {
      const id = await generateUniqueId();
      setProfileId(id);
      setFormData(prev => ({ ...prev, profile_id: id }));
    })();
  }, []);

  // Save Step 1 Data Only
//   const saveStep1Data = async () => {
//     setIsSubmitting(true);
    
//     try {
//       const fullPhoneNumber = countryCode + phoneNumber;
      
//       const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
//         email: formData.emailAddress.toLowerCase(),
//         password: password,
//         options: {
//           data: {
//             first_name: formData.firstName,
//             last_name: formData.lastName,
//             phone_number: fullPhoneNumber,
//             avatar_url: profileImage,
//             role: 'patient',
//           },
//         },
//       });

//       if (signUpError) {
//         toast({
//           title: 'Registration Failed',
//           description: signUpError.message,
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return false;
//       }

//       const userId = signUpData.user?.id;
//       if (!userId) {
//         toast({
//           title: 'Registration Failed',
//           description: 'Could not retrieve user information',
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return false;
//       }

//       setSavedUserId(userId);
//       setUser({ id: userId });
// const { data: existingProfile, error: checkError } = await supabase
//                         .from('profiles')
//                         .select('id')
//                         .eq('id', userId)
//                         .maybeSingle();
                  
//                       let profileError;
      
//                       await supabase
//         .from('profiles')
//         .update({
//           first_name: formData.firstName,
//           last_name: formData.lastName,
//           phone_number: fullPhoneNumber,
//           role: 'patient',
//           avatar_url: profileImage,
//           profile_id: profileId,
//         })
//         .eq('email', formData.emailAddress);

//       if (profileError) {
//         console.error('Error updating profile:', profileError);
//       }
//           try {
//       // Get the current session to get the access token
//       const { data: { session } } = await supabase.auth.getSession();
//       const accessToken = session?.access_token;
      
//       if (!accessToken) {
//         console.error('No access token available for email function');
//       } else {
//         const response = await fetch(
//           'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/patient-welcome-email',
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${accessToken}`,
//             },
//             body: JSON.stringify({
//               email: formData.emailAddress.toLowerCase(),
//               password: password,
//               // firstName: formData.firstName,
//               // lastName: formData.lastName,
//               // userId: userId,
//             }),
//           }
//         );

//         const responseData = await response.json();
        
//         if (response.ok) {
//           console.log('Welcome email sent successfully:', responseData);
//           toast({
//             title: 'Welcome Email Sent',
//             description: 'Check your email for login instructions.',
//           });
//         } else {
//           console.error('Failed to send welcome email:', responseData);
//           // Optionally show a non-blocking warning
//           toast({
//             title: 'Email Notification Issue',
//             description: 'Account created but welcome email could not be sent. Please contact support.',
            
//           });
//         }
//       }
//     } catch (emailError) {
//       console.error('Error calling welcome email function:', emailError);
//       // Don't block registration if email fails
//       toast({
//         title: 'Email Notification Issue',
//         description: 'Account created but welcome email could not be sent. Please contact support.',
      
//       });
//     }



//       toast({
//         title: 'Step 1 Completed',
//         description: 'Personal information saved successfully!',
//       });
      
//       setIsSubmitting(false);
//       setStep1Completed(true);
//       return true;
      
//     } catch (error) {
//       console.error('Error saving step 1:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to save personal information',
//         variant: 'destructive',
//       });
//       setIsSubmitting(false);
//       return false;
//     }
//   };
const saveStep1Data = async () => {
  setIsSubmitting(true);
  
  try {
    const fullPhoneNumber = countryCode + phoneNumber;
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: formData.emailAddress.toLowerCase(),
      password: password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: fullPhoneNumber,
          avatar_url: profileImage,
          role: 'patient',
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
      return false;
    }

    const userId = signUpData.user?.id;
    if (!userId) {
      toast({
        title: 'Registration Failed',
        description: 'Could not retrieve user information',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return false;
    }

    setSavedUserId(userId);
    setUser({ id: userId });

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
        role: 'patient',
        // avatar_url: profileImage,
        // profile_id: profileId,
      })
      .eq('email', formData.emailAddress);

    if (profileError) {
      console.error('Error updating profile:', profileError);
    }

    // Call the welcome email edge function with better error handling
    try {
      // Get the current session to get the access token
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      if (!accessToken) {
        console.error('No access token available for email function');
      } else {
        const response = await fetch(
          'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/patient-welcome-email',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              email: formData.emailAddress.toLowerCase(),
              password: password,
              firstName: formData.firstName,
              lastName: formData.lastName,
              userId: userId,
            }),
          }
        );

        const responseData = await response.json();
        
        if (response.ok) {
          console.log('Welcome email sent successfully:', responseData);
          toast({
            title: 'Welcome Email Sent',
            description: 'Check your email for login instructions.',
          });
        } else {
          console.error('Failed to send welcome email:', responseData);
          // Optionally show a non-blocking warning
          toast({
            title: 'Email Notification Issue',
            description: 'Account created but welcome email could not be sent. Please contact support.',
            
          });
        }
      }
    } catch (emailError) {
      console.error('Error calling welcome email function:', emailError);
      // Don't block registration if email fails
      toast({
        title: 'Email Notification Issue',
        description: 'Account created but welcome email could not be sent. Please contact support.',
      
      });
    }

    toast({
      title: 'Step 1 Completed',
      description: 'Personal information saved successfully!',
    });
    
    setIsSubmitting(false);
    setStep1Completed(true);
    return true;
    
  } catch (error) {
    console.error('Error saving step 1:', error);
    toast({
      title: 'Error',
      description: 'Failed to save personal information',
      variant: 'destructive',
    });
    setIsSubmitting(false);
    return false;
  }
};
  // Save All Remaining Data (Steps 2, 3, 4) at Once
  const saveAllRemainingData = async () => {
    setIsSubmitting(true);
    
    try {
      const userId = savedUserId || user?.id;
      
      if (!userId) {
        toast({
          title: 'Error',
          description: 'User not found. Please complete step 1 first.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return false;
      }

      let dateOfBirth = formData.dateOfBirth;
      if (date) {
        dateOfBirth = format(date, 'yyyy-MM-dd');
      }

        if (profileImage) {
          const { data: existingProfile, error: checkError } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('id', userId)
                        .maybeSingle();
                  
                      let profileUpdateError;
                      
                      await supabase
          .from('profiles')
          .update({ 
            avatar_url: profileImage ,
            profile_id: profileId
          })
        .eq('email', formData.emailAddress);

        if (profileUpdateError) {
          console.error('Error updating profile avatar:', profileUpdateError);
          // Continue with patient data save even if avatar update fails
        }
      }

      // Save Step 2, 3, 4 data together
      const { error: patientError } = await supabase
        .from('patients')
        .upsert({
          user_id: userId,
          gender: formData.gender,
          date_of_birth: dateOfBirth,
          blood_group: formData.bloodGroup,
          known_allergies: formData.knownAllergies,
          current_medications: formData.currentMedications,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country_code: formData.country_code,
          emergency_contact_name: formData.emergencyContactName,
          emergency_contact_number: emergencyContactCountryCode + emergencyPhoneNumber,
        }, { onConflict: 'user_id' });

      if (patientError) {
        console.error('Error saving patient data:', patientError);
        toast({
          title: 'Error',
          description: patientError.message || 'Failed to save patient information',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return false;
      }

      mixpanelInstance.track('Patient Registration Success', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.emailAddress,
        userId: userId,
      });

      toast({
        title: '🎉 Registration Successful!',
        description: 'Welcome to NextGen Medical Platform.',
      });

      setIsSubmitting(false);
      return true;
      
    } catch (error) {
      console.error('Error saving remaining data:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete registration',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return false;
    }
  };

  // Handle Next
  const handleNext = async () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = validateStep1();
      if (isValid) {
        const success = await saveStep1Data();
        if (success) {
          setCurrentStep(prev => prev + 1);
          window.scrollTo(0, 0);
        }
      }
    } else if (currentStep === 2) {
      isValid = validateStep2();
      if (isValid) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    } else if (currentStep === 3) {
      isValid = validateStep3();
      if (isValid) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    } else if (currentStep === 4) {
      isValid = validateStep4();
      if (isValid) {
        const success = await saveAllRemainingData();
        if (success) {
          setShowSuccessPopup(true);
        }
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  // Profile Image Upload Handler
  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const cleanFileName = file.name
      .replace(/\s+/g, "_")
      .replace(/[^\w.-]/g, "")
      .toLowerCase();

    const filePath = `profile_images/${Date.now()}_${cleanFileName}`;
    const { error: uploadError } = await supabase
      .storage
      .from('heal_med_app_images_bucket')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive",
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
    setFormData(prev => ({ ...prev, avatarUrl: publicUrl }));

    // Update profile if user exists
    // if (user?.id) {
    //   const { error: updateError } = await supabase
    //     .from('profiles')
    //     .update({ avatar_url: publicUrl })
    //     .eq('id', user.id);

    //   if (updateError) {
    //     console.error('Error updating profile picture:', updateError);
    //   }
    // }

    setIsUploading(false);

    toast({
      title: "Profile Picture Updated",
      description: "Your profile picture has been uploaded.",
    });
  };

  // Document Upload Handler
  // const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (!files) return;
    
  //   setIsUploading(true);
    
  //   for (let file of files) {
  //     try {
  //       if (file.type === 'application/pdf') {
  //         await new Promise(resolve => setTimeout(resolve, 2000));
  //       }
        
  //       const cleanFileName = file.name
  //         .replace(/\s+/g, "_")
  //         .replace(/[^\w.-]/g, "")
  //         .toLowerCase();

  //       const filePath = `medical_documents/${Date.now()}_${cleanFileName}`;
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
  //           type: 'patient' 
  //         }]);
  //         toast({
  //           title: "Document Uploaded",
  //           description: `${file.name} uploaded successfully.`,
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
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (!files) return;
  
  // Check if user exists
  if (!user) {
    toast({
      title: "Authentication Error",
      description: "Please log in to upload documents.",
      variant: "destructive"
    });
    return;
  }
  
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

      // Include user.id in the file path
      const filePath = `medical_documents/${user.id}/${Date.now()}_${cleanFileName}`;
      
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
      } 
      
      // Get signed URL for the uploaded file
      const { data: signedUrlData } = await supabase.storage
        .from('heal_med_app_files_bucket')
        .createSignedUrl(filePath, 3600); // 1 hour expiry
      
      // Store the document with more details including userId and URL
      setUploadedDocs(prev => [...prev, { 
        name: file.name, 
        type: 'patient',
        userId: user.id,
        url: signedUrlData?.signedUrl || '',
        path: filePath,
        uploadedAt: new Date()
      }]);
      
      toast({
        title: "Document Uploaded",
        description: `${file.name} uploaded successfully.`,
      });
      
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
  event.target.value = ''; // Reset input
};
  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    navigate('/dashboard/patient');
  };

  const StepIndicator = () => (
    <div className="mb-8 px-4">
      <div className="flex items-center justify-between relative">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="relative flex flex-col items-center group">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                  currentStep >= step
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-200 scale-110"
                    : "bg-gray-200 text-gray-500"
                } ${currentStep === step ? "ring-4 ring-blue-200" : ""}`}
              >
                {step === 1 && <User className="h-5 w-5" />}
                {step === 2 && <Heart className="h-5 w-5" />}
                {step === 3 && <MapPin className="h-5 w-5" />}
                {step === 4 && <Shield className="h-5 w-5" />}
              </div>
              <span className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap ${
                currentStep >= step ? "text-blue-600" : "text-gray-500"
              }`}>
                {step === 1 && "Personal"}
                {step === 2 && "Medical"}
                {step === 3 && "Address"}
                {step === 4 && "Emergency"}
              </span>
            </div>
            {step < 4 && (
              <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300 ${
                currentStep > step ? "bg-gradient-to-r from-blue-500 to-purple-500" : "bg-gray-200"
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
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Personal Information
        </h3>
        <p className="text-sm text-gray-500">Tell us about yourself</p>
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
            className={`border-2 ${errors.firstName ? "border-red-500" : "border-gray-200"} focus:border-blue-500 transition-colors`}
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
            className={`border-2 ${errors.lastName ? "border-red-500" : "border-gray-200"} focus:border-blue-500 transition-colors`}
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
          className={`border-2 ${errors.emailAddress ? "border-red-500" : "border-gray-200"} focus:border-blue-500 transition-colors`}
          placeholder="john.doe@example.com"
        />
        {errors.emailAddress && <p className="text-red-500 text-xs">{errors.emailAddress}</p>}
      </div>

      <div className="space-y-2">
        <Label className="label-required text-sm font-semibold text-gray-700">Phone Number</Label>
        <div className="flex space-x-2">
          <Select value={countryCode} onValueChange={(value) => setCountryCode(value)}>
            <SelectTrigger className="w-24 border-2 border-gray-200 focus:border-blue-500">
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
          <div className="relative flex-1">
            <Input
              type="tel"
              value={phoneNumber}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) setPhoneNumber(value);
              }}
              className={`border-2 ${errors.phoneNumber ? "border-red-500" : "border-gray-200"} focus:border-blue-500 transition-colors`}
              placeholder="9876543210"
            />
          </div>
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
          className={`border-2 ${errors.password ? "border-red-500" : "border-gray-200"} focus:border-blue-500`}
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
          className={`border-2 ${errors.repeatPassword ? "border-red-500" : "border-gray-200"} focus:border-blue-500`}
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

      <div className="space-y-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="terms"
            checked={isTermsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm">
            I accept the <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate("/terms")}>Terms and Conditions</span>
          </Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="privacy"
            checked={isPrivacyAccepted}
            onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
          />
          <Label htmlFor="privacy" className="text-sm">
            I accept the <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate("/privacy")}>Privacy Policy</span>
          </Label>
        </div>
        {errors.terms && <p className="text-red-500 text-xs">{errors.terms}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Medical Information
        </h3>
        <p className="text-sm text-gray-500">Help us provide better care</p>
      </div>

      <div className="space-y-2">
        <Label className="label-required text-sm font-semibold text-gray-700">Date of Birth</Label>
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                handleDateSelect(selectedDate);
                setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }));
              }}
              disabled={showManualDate}
              className={`pl-9 border-2 ${errors.dateOfBirth ? "border-red-500" : "border-gray-200"} focus:border-blue-500`}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowManualDate(!showManualDate)}
            className="border-2 border-gray-200 hover:border-purple-500"
          >
            <Globe className="mr-2 h-4 w-4" />
            Manual
          </Button>
        </div>
        {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth}</p>}

        {showManualDate && (
          <div className="grid grid-cols-3 gap-3 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <div>
              <Label className="text-xs font-semibold">Year</Label>
              <Select
                value={manualDate.manualYear}
                onValueChange={(value) => {
                  const updated = { ...manualDate, manualYear: value };
                  setManualDate(updated);
                  handleManualDateChange(updated);
                }}
              >
                <SelectTrigger className={`border-2 ${errors.manualYear ? "border-red-500" : "border-gray-200"}`}>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Month</Label>
              <Select
                value={manualDate.manualMonth}
                onValueChange={(value) => {
                  const updated = { ...manualDate, manualMonth: value };
                  setManualDate(updated);
                  handleManualDateChange(updated);
                }}
              >
                <SelectTrigger className={`border-2 ${errors.manualMonth ? "border-red-500" : "border-gray-200"}`}>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Day</Label>
              <Select
                value={manualDate.manualDay}
                onValueChange={(value) => {
                  const updated = { ...manualDate, manualDay: value };
                  setManualDate(updated);
                  handleManualDateChange(updated);
                }}
              >
                <SelectTrigger className={`border-2 ${errors.manualDay ? "border-red-500" : "border-gray-200"}`}>
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender" className="label-required text-sm font-semibold text-gray-700">Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger className={`border-2 ${errors.gender ? "border-red-500" : "border-gray-200"} focus:border-blue-500`}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bloodGroup" className="label-required text-sm font-semibold text-gray-700">Blood Group</Label>
          <Select value={formData.bloodGroup} onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}>
            <SelectTrigger className={`border-2 ${errors.bloodGroup ? "border-red-500" : "border-gray-200"} focus:border-red-500`}>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <SelectItem key={bg} value={bg}>{bg} 🩸</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.bloodGroup && <p className="text-red-500 text-xs">{errors.bloodGroup}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergies" className="text-sm font-semibold text-gray-700">
          <AlertCircle className="inline h-4 w-4 mr-1 text-yellow-500" />
          Known Allergies
        </Label>
        <Input
          id="allergies"
          value={formData.knownAllergies}
          onChange={(e) => setFormData({ ...formData, knownAllergies: e.target.value })}
          className="border-2 border-gray-200 focus:border-yellow-500"
          placeholder="e.g., Penicillin, Shellfish"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentMedications" className="text-sm font-semibold text-gray-700">
          <Pill className="inline h-4 w-4 mr-1 text-green-500" />
          Current Medications
        </Label>
        <Input
          id="currentMedications"
          value={formData.currentMedications}
          onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
          className="border-2 border-gray-200 focus:border-green-500"
          placeholder="List medications with dosage"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Address Information
        </h3>
        <p className="text-sm text-gray-500">Where do you live?</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="label-required text-sm font-semibold text-gray-700">
          Address
        </Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className={`border-2 ${errors.address ? "border-red-500" : "border-gray-200"} focus:border-blue-500`}
          placeholder="Enter your complete address"
          rows={3}
        />
        {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country" className="label-required text-sm font-semibold text-gray-700">Country</Label>
          <select
            id="country"
            value={formData.country_code || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              country_code: e.target.value,
              state: '',
              city: ''
            })}
            className={`w-full p-2 border rounded ${errors.country_code ? "border-red-500" : "border-gray-200"}`}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country_code && <p className="text-red-500 text-xs">{errors.country_code}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="label-required text-sm font-semibold text-gray-700">State</Label>
          <select
            id="state"
            value={formData.state || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              state: e.target.value,
              city: ''
            })}
            className={`w-full p-2 border rounded ${errors.state ? "border-red-500" : "border-gray-200"}`}
            disabled={!formData.country_code}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="label-required text-sm font-semibold text-gray-700">City</Label>
          {/* <select
            id="city"
            value={formData.city || ''}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={`w-full p-2 border rounded ${errors.city ? "border-red-500" : "border-gray-200"}`}
            disabled={!formData.state}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select> */}
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className={`border-2 ${errors.city ? "border-red-500" : "border-gray-200"} focus:border-blue-500 transition-colors`}
            placeholder="Enter city name"
          />
          
          {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pincode" className="label-required text-sm font-semibold text-gray-700">Pincode</Label>
          <Input
            id="pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            className={errors.pincode ? "border-red-500" : "border-gray-200"}
            maxLength={6}
            placeholder="400001"
          />
          {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Emergency & Profile Setup
        </h3>
        <p className="text-sm text-gray-500">Complete your profile</p>
      </div>

      {/* Profile Picture Upload */}
      <div className="space-y-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
        <h4 className="font-semibold text-purple-800 flex items-center">
          <Camera className="h-5 w-5 mr-2" />
          Profile Picture
        </h4>
        <div className="flex flex-col items-center space-y-4">
          {profileImage ? (
            <div className="relative">
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-400"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute bottom-0 right-0 rounded-full bg-white"
                onClick={() => document.getElementById('profile-upload')?.click()}
              >
                <Camera className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-purple-400 flex items-center justify-center">
              <Camera className="h-8 w-8 text-purple-400" />
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
            className="border-purple-300 text-purple-700"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : (profileImage ? 'Change Picture' : 'Upload Picture')}
          </Button>
        </div>
      </div>

      {/* Document Upload */}
      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
        <h4 className="font-semibold text-blue-800 flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Upload Documents
        </h4>
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
          <Input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
            id="document-upload"
          />
          <Label htmlFor="document-upload" className="cursor-pointer">
            <Upload className="mx-auto h-8 w-8 mb-2 text-blue-500" />
            <p className="text-sm text-blue-600">Click to upload medical documents</p>
            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB each</p>
          </Label>
        </div>

        {uploadedDocs.length > 0 && (
          <div className="mt-3">
            <h5 className="text-xs font-semibold text-gray-600 mb-2">Uploaded Documents:</h5>
            <div className="flex flex-wrap gap-2">
              {uploadedDocs.map((doc, index) => (
                <div key={index} className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  <Check className="h-3 w-3" />
                  <span className="truncate max-w-[120px]">{doc.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      <div className="space-y-4 p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
        <h4 className="font-semibold text-orange-800 flex items-center">
          <PhoneCall className="h-5 w-5 mr-2" />
          Emergency Contact Information
        </h4>

        <div className="space-y-2">
          <Label htmlFor="emergencyContact" className="label-required text-sm font-semibold text-gray-700">
            Emergency Contact Name
          </Label>
          <Input
            id="emergencyContact"
            value={formData.emergencyContactName}
            onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
            className={`border-2 ${errors.emergencyContactName ? "border-red-500" : "border-gray-200"} focus:border-orange-500`}
            placeholder="Full name of emergency contact"
          />
          {errors.emergencyContactName && <p className="text-red-500 text-xs">{errors.emergencyContactName}</p>}
        </div>

        <div className="space-y-2">
          <Label className="label-required text-sm font-semibold text-gray-700">Emergency Contact Phone</Label>
          <div className="flex space-x-2">
            <Select value={emergencyContactCountryCode} onValueChange={(value) => setEmergencyContactCountryCode(value)}>
              <SelectTrigger className="w-24 border-2 border-gray-200 focus:border-orange-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countryCodes.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span>{country.flag} {country.code}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="tel"
                value={emergencyPhoneNumber}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) setEmergencyPhoneNumber(value);
                }}
                className={`pl-9 border-2 ${errors.emergencyPhoneNumber ? "border-red-500" : "border-gray-200"} focus:border-orange-500`}
                placeholder="9876543210"
              />
            </div>
          </div>
          {errors.emergencyPhoneNumber && <p className="text-red-500 text-xs">{errors.emergencyPhoneNumber}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout
      title="Join as Patient"
      description="🌟 Your health journey starts here"
      userType="patient"
    >
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 rounded-xl">
        <StepIndicator />
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

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
            
            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white ${currentStep === 1 ? "ml-auto" : ""}`}
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
                onClick={handleNext}
                disabled={isSubmitting}
                className="ml-auto bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-5 w-5" />
                    Complete Registration
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold text-blue-600 hover:text-purple-600"
              onClick={() => navigate("/login/patient")}
            >
              Sign in here →
            </Button>
          </div>
        </form>
      </div>

      <SuccessPopup 
        isOpen={showSuccessPopup}
        onClose={handleSuccessPopupClose}
      />

      {isUploading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <PDFLoader />
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default PatientRegistration;