// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useNavigate } from "react-router-dom";
// import { useToast } from "@/hooks/use-toast";
// import AuthLayout from "./AuthLayout";
// import { MedicalFacility } from "@/Models/MedicalFacility";
// import { supabase } from "@/integrations/supabase/client";
// import '../../styles/form-input-styles.css';
// import mixpanelInstance from "@/utils/mixpanel";
// import { Country, State, City } from "country-state-city";
// import { Camera, Check, Upload } from "lucide-react";
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
// const SuccessPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="text-center text-2xl font-bold text-green-600">
//             Welcome to Your Facility Dashboard! 🏥
//           </DialogTitle>
//           <DialogDescription className="text-center pt-4">
//             Your facility has been successfully registered. You can now manage appointments, access medical records, and connect with patients.
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
//               Complete your facility profile
//             </li>
//             <li className="flex items-center text-sm text-gray-600">
//               <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
//               Add doctors and staff members
//             </li>
//             <li className="flex items-center text-sm text-gray-600">
//               <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
//               Manage appointments and schedules
//             </li>
//             <li className="flex items-center text-sm text-gray-600">
//               <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
//               Accept online consultations
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

// const FacilityRegistration = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState<MedicalFacility>({
//     facilityName: '',
//     facilityType: '',
//     phoneNumber: '',
//     emailAddress: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     latitude: 0,
//     longitude: 0,
//     licenseNumber: '',
//     establishedYear: 0,
//     totalBeds: 0,
//     departments: ["Bed Management"],
//     emergencyServices: false,
//     ambulanceService: false,
//     onlineConsultation: false,
//     homeVisit: false,
//     isVerified: true,
//     insurancePartners: '',
//     operatingHours: '',
//     website: '',
//     aboutFacility: '',
//     country_code: "India",
//   });
//   const [password, setPassword] = useState('');
//   const [repeatPassword, setRepeatPassword] = useState('');
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [kycAccepted, setKycAccepted] = useState(false);
//   const [countryCode, setCountryCode] = useState('+91');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [userId, setUserId] = useState<string | null>(null);
//   const [facilityId, setFacilityId] = useState<string | null>(null);
  
//   const [countries] = useState(Country.getAllCountries());
//   const [states, setStates] = useState<any[]>([]);
//   const [cities, setCities] = useState<any[]>([]);
//   const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  
//   const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
//   const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [profileImage, setProfileImage] = useState<string>("");
//   const [uploadedDocs, setUploadedDocs] = useState<Array<{name: string, type: string}>>([]);
//   const [user, setUser] = useState<any>(null);

//   const facilityTypes = [
//     "Hospital", "Clinic", "Diagnostic Center", "Pharmacy", "Ayurveda Center",
//     "Homeopathy Clinic", "Physiotherapy Center", "Dental Clinic",
//     "Eye Care Center", "Maternity Home", "Nursing Home", "Rehabilitation Center"
//   ];

//   const getDepartmentsByFacilityType = (facilityType: string) => {
//     const departmentMap: { [key: string]: string[] } = {
//       'hospital': [
//         "General Medicine", "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
//         "Gynecology", "Surgery", "Emergency", "ICU", "Radiology", "Pathology",
//         "Dermatology", "ENT", "Ophthalmology", "Psychiatry", "Physiotherapy"
//       ],
//       'clinic': [
//         "General Medicine", "Pediatrics", "Gynecology", "Dermatology", "ENT", 
//         "Physiotherapy"
//       ],
//       'diagnostic-center': [
//         "Radiology", "Pathology", "Cardiology", "Neurology"
//       ],
//       'pharmacy': [
//         "General Medicine", "Cardiology", "Diabetes Care", "Women's Health"
//       ],
//       'ayurveda-center': [
//         "Ayurveda", "Panchakarma", "Herbal Medicine", "Dietetics"
//       ],
//       'homeopathy-clinic': [
//         "Homeopathy", "General Medicine", "Pediatrics", "Dermatology"
//       ],
//       'physiotherapy-center': [
//         "Physiotherapy", "Orthopedics", "Neurology", "Sports Medicine"
//       ],
//       'dental-clinic': [
//         "Dental", "Orthodontics", "Endodontics", "Oral Surgery"
//       ],
//       'eye-care-center': [
//         "Ophthalmology", "Optometry", "Retina Specialists", "Cornea Specialists"
//       ],
//       'maternity-home': [
//         "Gynecology", "Pediatrics", "Neonatology", "Obstetrics"
//       ],
//       'nursing-home': [
//         "General Medicine", "Geriatrics", "Palliative Care", "Nursing Care"
//       ],
//       'rehabilitation-center': [
//         "Physiotherapy", "Occupational Therapy", "Speech Therapy", "Psychology"
//       ]
//     };
//     return departmentMap[facilityType] || [];
//   };

//   const validateField = (field: string, value: any): string => {
//     switch (field) {
//       case 'facilityName':
//         if (!value) return "Facility name is required";
//         if (value.length < 3) return "Facility name must be at least 3 characters";
//         return "";
//       case 'facilityType':
//         if (!value) return "Facility type is required";
//         return "";
//       case 'emailAddress':
//         if (!value) return "Email is required";
//         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
//         return "";
//       case 'phoneNumber':
//         if (!value) return "Phone number is required";
//         if (value.length !== 10) return "Phone number must be 10 digits";
//         if (!/^\d+$/.test(value)) return "Phone number must contain only digits";
//         return "";
//       case 'password':
//         if (!value) return "Password is required";
//         if (value.length < 6) return "Password must be at least 6 characters";
//         const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
//         if (!passwordRegex.test(value)) return "Password must contain letter, number and special character";
//         return "";
//       case 'repeatPassword':
//         if (!value) return "Please confirm your password";
//         if (value !== password) return "Passwords do not match";
//         return "";
//       case 'terms':
//         if (!termsAccepted) return "Please accept the terms and conditions";
//         return "";
//       case 'kyc':
//         if (!kycAccepted) return "Please accept KYC verification";
//         return "";
//       case 'address':
//         if (!value) return "Address is required";
//         if (value.length < 10) return "Address must be at least 10 characters";
//         return "";
//       case 'city':
//         if (!value) return "City is required";
//         if (value.length < 3) return "City must be at least 3 characters";
//         return "";
//       case 'state':
//         if (!value) return "State is required";
//         if (value.length < 3) return "State must be at least 3 characters";
//         return "";
//       case 'country_code':
//         if (!value) return "Country is required";
//         return "";
//       case 'pincode':
//         if (!value) return "Pincode is required";
//         if (value.length !== 6) return "Pincode must be 6 digits";
//         if (!/^\d+$/.test(value)) return "Pincode must contain only digits";
//         return "";
//       case 'licenseNumber':
//         if (!value) return "License number is required";
//         if (value.length < 5) return "License number must be at least 5 characters";
//         return "";
//       case 'establishedYear':
//         if (!value) return "Established year is required";
//         const currentYear = new Date().getFullYear();
//         if (value < 1900 ) return `Year must be between 1900 and ${currentYear}`;
//         return "";
//       case 'departments':
//         if (!value || value.length === 0) return "Please select at least one department";
//         return "";
//       case 'operatingHours':
//         if (!value) return "Operating hours are required";
//         return "";
//       default:
//         return "";
//     }
//   };

//   const handleBlur = (field: string) => {
//     setTouchedFields(prev => ({ ...prev, [field]: true }));
//     const error = validateField(field, getFieldValue(field));
//     setFieldErrors(prev => ({ ...prev, [field]: error }));
//   };

//   const getFieldValue = (field: string): any => {
//     switch (field) {
//       case 'phoneNumber': return phoneNumber;
//       case 'password': return password;
//       case 'repeatPassword': return repeatPassword;
//       case 'terms': return termsAccepted;
//       case 'kyc': return kycAccepted;
//       case 'departments': return formData.departments;
//       default: return formData[field as keyof MedicalFacility];
//     }
//   };

//   useEffect(() => {
//     if (formData.country_code) {
//       const selectedCountry = countries.find(c => c.name === formData.country_code);
//       if (selectedCountry) {
//         const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
//         setStates(countryStates);
//         if (!countryStates.find(s => s.name === formData.state)) {
//           setFormData(prev => ({ ...prev, state: '', city: '' }));
//           setCities([]);
//         }
//       } else {
//         setStates([]);
//         setCities([]);
//       }
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
//     }
//   }, [formData.country_code, formData.state, countries, states]);

//   const handleFacilityTypeChange = (value: string) => {
//     setFormData({ ...formData, facilityType: value });
//     const departments = getDepartmentsByFacilityType(value);
//     setAvailableDepartments(departments);
//     setFormData(prev => ({ ...prev, departments: ["Bed Management"] }));
    
//     if (touchedFields.facilityType) {
//       const error = validateField('facilityType', value);
//       setFieldErrors(prev => ({ ...prev, facilityType: error }));
//     }
//   };

//   const handleDepartmentToggle = (department: string) => {
//     const updatedDepartments = formData.departments.includes(department)
//       ? formData.departments.filter(d => d !== department)
//       : [...formData.departments, department];
    
//     setFormData(prev => ({
//       ...prev,
//       departments: updatedDepartments
//     }));
    
//     if (touchedFields.departments) {
//       const error = validateField('departments', updatedDepartments);
//       setFieldErrors(prev => ({ ...prev, departments: error }));
//     }
//   };

//   const checkLicenseNumberExists = async (licenseNumber: string): Promise<boolean> => {
//     try {
//       const { data, error } = await supabase
//         .from("facilities")
//         .select("license_number")
//         .eq("license_number", licenseNumber)
//         .maybeSingle();

//       if (error) {
//         console.error("Error checking license number:", error);
//         return false;
//       }
//       return !!data;
//     } catch (error) {
//       console.error("Error in license number check:", error);
//       return false;
//     }
//   };
  
//   // Step 1: Create user account and profile
// const saveStep1Data = async (): Promise<boolean> => {
//     setIsSubmitting(true);
//     const fullPhoneNumber = countryCode + phoneNumber;
    
//     try {
//       // Check if license exists BEFORE creating user
//       const licenseExists = await checkLicenseNumberExists(formData.licenseNumber);
//       if (licenseExists) {
//         toast({
//           title: "License Number Already Registered",
//           description: "This medical license number is already registered in our system.",
//           variant: "destructive",
//         });
//         setIsSubmitting(false);
//         return false;
//       }

//       // Create user account
//       const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
//         email: formData.emailAddress.toLowerCase(),
//         password: password,
//         options: {
//           data: {
//             first_name: formData.facilityName,
//             phone_number: fullPhoneNumber,
//             avatar_url: profileImage,
//             role: 'hospital_admin',
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
  
//     const userId = signUpData.user?.id;
//       if (!userId) {
//         toast({
//           title: 'Registration Failed',
//           description: 'Could not retrieve user information',
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return false;
//       }
  
//       setUserId(userId);
//       setUser(signUpData.user);
//         const { data: existingProfile, error: checkError } = await supabase
//             .from('profiles')
//             .select('id')
//             .eq('id', userId)
//             .maybeSingle();
      
//           let profileError;
      

//       // Create profile
//      await supabase
//                .from('profiles')
//                .update({
//           id: userId,
//           first_name: formData.facilityName,
//           phone_number: fullPhoneNumber,
//           role: 'hospital_admin',
//           email: formData.emailAddress.toLowerCase(),
//           updated_at: new Date().toISOString(),
//         })
//         .eq('email', formData.emailAddress);
//       if (profileError) {
//         console.error('Error creating profile:', profileError);
//         toast({
//           title: 'Profile Creation Issue',
//           description: 'Your account was created but we had trouble saving profile details.',
//         });
//       }

//       // Create facility record
//       const operatingHoursObj = {
//         schedule: formData.operatingHours || "Mon-Sat: 9AM-9PM",
//         timezone: "UTC"
//       };

//       const additionalServicesObj = {
//         emergencyServices: formData.emergencyServices,
//         ambulanceService: formData.ambulanceService,
//         onlineConsultation: formData.onlineConsultation,
//         homeVisit: formData.homeVisit
//       };

//       const { data: facilityData, error: facilityError } = await supabase
//         .from('facilities')
//         .insert({
//           admin_user_id: userId,
//           facility_name: formData.facilityName,
//           facility_type: formData.facilityType,
//           address: formData.address || '',
//           city: formData.city || '',
//           state: formData.state || '',
//           pincode: formData.pincode ? Number(formData.pincode) : null,
//           latitude: formData.latitude,
//           longitude: formData.longitude,
//           license_number: formData.licenseNumber,
//           established_year: formData.establishedYear ? Number(formData.establishedYear) : null,
//           total_beds: Number(formData.totalBeds) || 0,
//           is_verified: false,
//           departments: formData.departments,
//           insurance_partners: formData.insurancePartners || '',
//           operating_hours: operatingHoursObj,
//           additional_services: additionalServicesObj,
//           website: formData.website || '',
//           about_facility: formData.aboutFacility || '',
//           country_code: formData.country_code,
//           number_of_departments: formData.departments.length,
//           number_of_staffs: 0,
//           total_reviews: 0,
//           rating: 0,
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         })
//         .select()
//         .single();

//       if (facilityError) {
//         console.error('Error creating facility:', facilityError);
//         toast({
//           title: 'Facility Creation Issue',
//           description: 'Your account was created but we had trouble saving facility details.',
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return false;
//       }
      
//       setFacilityId(facilityData.id);
      
//       // Insert departments if any
//       if (formData.departments && formData.departments.length > 0) {
//         const departmentInserts = formData.departments.map(deptName => ({
//           facility_id: facilityData.id,
//           name: deptName,
//           description: formData.aboutFacility || '',
//           created_at: new Date().toISOString(),
//         }));

//         const { error: deptError } = await supabase
//           .from("departments")
//           .insert(departmentInserts);

//         if (deptError) {
//           console.error('Error inserting departments:', deptError);
//           // Don't fail the whole registration for department errors
//         }
//       }

//       toast({
//         title: 'Step 1 Completed',
//         description: 'Facility information saved successfully!',
//       });
      
//       setIsSubmitting(false);
//       return true;
      
//     } catch (error) {
//       console.error('Error saving step 1:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to save facility information',
//         variant: 'destructive',
//       });
//       setIsSubmitting(false);
//       return false;
//     }
//   };

//   // Step 2: Update facility with location and license details
//   const saveStep2Data = async (): Promise<boolean> => {
//     setIsSubmitting(true);
    
//     try {
//       if (!facilityId) {
//         toast({
//           title: 'Error',
//           description: 'Facility not found. Please complete step 1 first.',
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return false;
//       }

//       // Check if license number exists (excluding current facility)
//       const { data: existingLicense } = await supabase
//         .from("facilities")
//         .select("license_number")
//         .eq("license_number", formData.licenseNumber)
//         .neq("id", facilityId)
//         .maybeSingle();

//       if (existingLicense) {
//         toast({
//           title: "License Number Already Registered",
//           description: "This medical license number is already registered to another facility.",
//           variant: "destructive",
//         });
//         setIsSubmitting(false);
//         return false;
//       }

//       const { error: facilityError } = await supabase
//         .from('facilities')
//         .update({
//           address: formData.address,
//           city: formData.city,
//           state: formData.state,
//           pincode: Number(formData.pincode),
//           country_code: formData.country_code,
//           license_number: formData.licenseNumber,
//           established_year: Number(formData.establishedYear),
//           departments: formData.departments,
//           number_of_departments: formData.departments.length,
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', facilityId);

//       if (facilityError) {
//         console.error('Error updating facility:', facilityError);
//         toast({
//           title: 'Error',
//           description: 'Failed to save location and license information',
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return false;
//       }

//       // Update departments - delete existing and insert new
//       if (formData.departments && formData.departments.length > 0) {
//         // First delete existing departments
//         await supabase
//           .from("departments")
//           .delete()
//           .eq('facility_id', facilityId);
        
//         // Then insert new departments
//         const departmentInserts = formData.departments.map(deptName => ({
//           facility_id: facilityId,
//           name: deptName,
//           description: formData.aboutFacility || '',
//           created_at: new Date().toISOString(),
//         }));

//         const { error: deptError } = await supabase
//           .from("departments")
//           .insert(departmentInserts);

//         if (deptError) {
//           console.error('Error inserting departments:', deptError);
//         }
//       }

//       toast({
//         title: 'Step 2 Completed',
//         description: 'Location and license information saved successfully!',
//       });
      
//       setIsSubmitting(false);
//       return true;
      
//     } catch (error) {
//       console.error('Error saving step 2:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to save location and license information',
//         variant: 'destructive',
//       });
//       setIsSubmitting(false);
//       return false;
//     }
//   };

//   // Step 3: Update facility with services and operational details
//   const saveStep3Data = async (): Promise<boolean> => {
//     setIsSubmitting(true);
    
//     try {
//       if (!facilityId) {
//         toast({
//           title: 'Error',
//           description: 'Facility not found. Please complete step 1 first.',
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return false;
//       }

//       const operatingHoursObj = {
//         schedule: formData.operatingHours,
//         timezone: "UTC"
//       };

//       const additionalServicesObj = {
//         emergencyServices: formData.emergencyServices,
//         ambulanceService: formData.ambulanceService,
//         onlineConsultation: formData.onlineConsultation,
//         homeVisit: formData.homeVisit
//       };

//       const { error: facilityError } = await supabase
//         .from('facilities')
//         .update({
//           total_beds: Number(formData.totalBeds) || 0,
//           insurance_partners: formData.insurancePartners || '',
//           operating_hours: operatingHoursObj,
//           additional_services: additionalServicesObj,
//           website: formData.website || '',
//           about_facility: formData.aboutFacility || '',
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', facilityId);

//       if (facilityError) {
//         console.error('Error updating facility:', facilityError);
//         toast({
//           title: 'Error',
//           description: 'Failed to save services information',
//           variant: 'destructive',
//         });
//         setIsSubmitting(false);
//         return false;
//       }

//       toast({
//         title: 'Step 3 Completed',
//         description: 'Services information saved successfully!',
//       });
      
//       setIsSubmitting(false);
//       return true;
      
//     } catch (error) {
//       console.error('Error saving step 3:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to save services information',
//         variant: 'destructive',
//       });
//       setIsSubmitting(false);
//       return false;
//     }
//   };
  
//   const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setIsUploading(true);

//     try {
//       const filePath = `profile_images/${Date.now()}_${file.name}`;
//       const { error: uploadError } = await supabase
//         .storage
//         .from('heal_med_app_images_bucket')
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       const { data: publicUrlData } = supabase
//         .storage
//         .from('heal_med_app_images_bucket')
//         .getPublicUrl(filePath);

//       const publicUrl = publicUrlData?.publicUrl;
//       setProfileImage(publicUrl);

//       if (userId) {
//         const { error: updateError } = await supabase
//           .from('profiles')
//           .update({ avatar_url: publicUrl })
//           .eq('id', userId);

//         if (updateError) throw updateError;
        
//         toast({
//           title: "Profile Picture Updated",
//           description: "Your profile picture has been uploaded and saved.",
//         });
//       }
//     } catch (error: any) {
//       console.error('Upload error:', error);
//       toast({
//         title: "Upload Failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsUploading(false);
//     }
//   };
  
//     const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (!files) return;
    
//     setIsUploading(true);
    
//     for (let file of files) {
//       // Show PDF loader for PDF files
//       if (file.type === 'application/pdf') {
//         await new Promise(resolve => setTimeout(resolve, 2000));
//       }
      
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
//         setIsUploading(false);
//         return;
//       }
//       else {
//         // Store the document with its type based on userType
//         setUploadedDocs(prev => [...prev, { 
//           name: file.name, 
//           type: 'facility' 
//         }]);
//         toast({
//           title: "Files Uploaded",
//           description: `file(s) uploaded successfully.`,
//         });
//       }
//     }
    
//     setIsUploading(false);
//   };
// // const handleSubmit = async (e: React.FormEvent) => {
// //   e.preventDefault();

// //   // Only allow submit on last step (step 4)
// //   if (currentStep !== 4) return;

// //   // Prevent multiple clicks
// //   if (isSubmitting) return;

// //   setIsSubmitting(true);

// //   try {
// //     // Get the current user if not already set
// //     let currentUserId = userId;
// //     if (!currentUserId) {
// //       const { data: { user: currentUser } } = await supabase.auth.getUser();
// //       currentUserId = currentUser?.id;
// //       if (currentUserId) {
// //         setUserId(currentUserId);
// //         setUser(currentUser);
// //       }
// //     }
    
// //     if (!currentUserId) {
// //       toast({
// //         title: "Error",
// //         description: "User not found. Please complete previous steps.",
// //         variant: "destructive",
// //       });
// //       setIsSubmitting(false);
// //       return;
// //     }

// //     // Save profile image if uploaded
// //     if (profileImage && currentUserId) {
// //       const { error: updateError } = await supabase
// //         .from('profiles')
// //         .update({ avatar_url: profileImage })
// //         .eq('id', currentUserId);

// //       if (updateError) {
// //         console.error('Error saving profile image:', updateError);
// //         toast({
// //           title: "Profile Image Error",
// //           description: "Failed to save profile image, but registration continues.",
// //           variant: "destructive",
// //         });
// //       } else {
// //         toast({
// //           title: "Profile Image Saved",
// //           description: "Your profile picture has been saved.",
// //         });
// //       }
// //     }

// //     // Save documents if uploaded
// //     if (uploadedDocs.length > 0) {
// //       // Documents are already saved during upload, so just update the facility record
// //       // with document references if needed
// //       const documentUrls = uploadedDocs.map(doc => doc.name);
      
// //       const { error: docError } = await supabase
// //         .from('facilities')
// //         .update({
// //           documents: documentUrls,
// //           updated_at: new Date().toISOString()
// //         })
// //         .eq('admin_user_id', currentUserId);

// //       if (docError) {
// //         console.error('Error saving document references:', docError);
// //         toast({
// //           title: "Document Reference Error",
// //           description: "Documents uploaded but reference save failed.",
// //           variant: "destructive",
// //         });
// //       } else {
// //         toast({
// //           title: "Documents Saved",
// //           description: `${uploadedDocs.length} document(s) saved successfully.`,
// //         });
// //       }
// //     }

// //     // Track successful registration
// //     mixpanelInstance.track("Facility Registration Success", {
// //       email: formData.emailAddress,
// //       facility_name: formData.facilityName,
// //       facility_id: facilityId,
// //       has_profile_image: !!profileImage,
// //       documents_count: uploadedDocs.length,
// //     });

// //     // Success message
// //     toast({
// //       title: "Registration Successful! 🎉",
// //       description: "Your facility has been registered successfully.",
// //     });

// //     // Show success popup
// //     setShowSuccessPopup(true);

// //   } catch (error) {
// //     console.error("Error completing registration:", error);
// //     toast({
// //       title: "Error",
// //       description: "Failed to complete registration. Please try again.",
// //       variant: "destructive",
// //     });
// //   } finally {
// //     setIsSubmitting(false);
// //   }
// // };

// // const handleSubmit = async (e: React.FormEvent) => {
// //   e.preventDefault();

// //   // Only allow submit on last step
// //   if (currentStep !== 4) return;

// //   // Prevent multiple clicks
// //   if (isSubmitting) return;

// //   // ✅ Validate once
// //   const isValid = validateStep4();
// //   // if (!isValid) {
// //   //   toast({
// //   //     title: "Validation Error",
// //   //     description: "Please fix the errors before submitting",
// //   //     variant: "destructive",
// //   //   });
// //   //   return;
// //   // }

// //   setIsSubmitting(true);

// //   try {
// //     // ✅ Update profile image if exists
// //     if (userId && profileImage) {
// //       await supabase
// //         .from("profiles")
// //         .update({ avatar_url: profileImage })
// //         .eq("id", userId);
// //     }

// //     // ✅ Track event
// //     mixpanelInstance.track("Facility Registration Success", {
// //       email: formData.emailAddress,
// //       facility_name: formData.facilityName,
// //       facility_id: facilityId,
// //     });

// //     // ✅ Success message
// //     toast({
// //       title: "Registration Successful!",
// //       description: "Your facility has been registered successfully.",
// //     });

// //     // ✅ Show popup ONLY after success
// //     setShowSuccessPopup(true);

// //   } catch (error) {
// //     console.error("Error completing registration:", error);

// //     toast({
// //       title: "Error",
// //       description: "Failed to complete registration",
// //       variant: "destructive",
// //     });

// //   } finally {
// //     setIsSubmitting(false);
// //   }
// // };
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   // Only allow submit on last step (step 4)
//   if (currentStep !== 4) return;

//   // Prevent multiple clicks
//   if (isSubmitting) return;

//   setIsSubmitting(true);

//   try {
//     // Get the current user if not already set
//     let currentUserId = userId;
//     if (!currentUserId) {
//       const { data: { user: currentUser } } = await supabase.auth.getUser();
//       currentUserId = currentUser?.id;
//       if (currentUserId) {
//         setUserId(currentUserId);
//         setUser(currentUser);
//       }
//     }
    
//     if (!currentUserId) {
//       toast({
//         title: "Error",
//         description: "User not found. Please complete previous steps.",
//         variant: "destructive",
//       });
//       setIsSubmitting(false);
//       return;
//     }

//     // Save profile image if uploaded
//     if (profileImage && currentUserId) {
//       const { error: updateError } = await supabase
//         .from('profiles')
//         .update({ avatar_url: profileImage })
//         .eq('id', currentUserId);

//       if (updateError) {
//         console.error('Error saving profile image:', updateError);
//         toast({
//           title: "Profile Image Error",
//           description: "Failed to save profile image, but registration continues.",
//           variant: "destructive",
//         });
//       } else {
//         toast({
//           title: "Profile Image Saved",
//           description: "Your profile picture has been saved.",
//         });
//       }
//     }

//     // Save documents if uploaded
//     if (uploadedDocs.length > 0) {
//       // Documents are already saved during upload, so just update the facility record
//       // with document references if needed
//       const documentUrls = uploadedDocs.map(doc => doc.name);
      
//       const { error: docError } = await supabase
//         .from('facilities')
//         .update({
//           documents: documentUrls,
//           updated_at: new Date().toISOString()
//         })
//         .eq('admin_user_id', currentUserId);

//       if (docError) {
//         console.error('Error saving document references:', docError);
//         toast({
//           title: "Document Reference Error",
//           description: "Documents uploaded but reference save failed.",
//           variant: "destructive",
//         });
//       } else {
//         toast({
//           title: "Documents Saved",
//           description: `${uploadedDocs.length} document(s) saved successfully.`,
//         });
//       }
//     }

//     // Track successful registration
//     mixpanelInstance.track("Facility Registration Success", {
//       email: formData.emailAddress,
//       facility_name: formData.facilityName,
//       facility_id: facilityId,
//       has_profile_image: !!profileImage,
//       documents_count: uploadedDocs.length,
//     });

//     // Success message
//     toast({
//       title: "Registration Successful! 🎉",
//       description: "Your facility has been registered successfully.",
//     });

//     // Show success popup
//     setShowSuccessPopup(true);

//   } catch (error) {
//     console.error("Error completing registration:", error);
//     toast({
//       title: "Error",
//       description: "Failed to complete registration. Please try again.",
//       variant: "destructive",
//     });
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   const handleNext = async () => {
//     if (isSubmitting) return;
    
//     let isValid = false;
    
//     if (currentStep === 1) {
//       isValid = validateStep1();
//       if (isValid) {
//         const success = await saveStep1Data();
//         if (success) {
//           setCurrentStep(prev => prev + 1);
//           window.scrollTo(0, 0);
//         }
//       } else {
//         toast({
//           title: "Validation Error",
//           description: "Please fix the errors before proceeding",
//           variant: "destructive",
//         });
//       }
//     } else if (currentStep === 2) {
//       isValid = validateStep2();
//       if (isValid) {
//         const success = await saveStep2Data();
//         if (success) {
//           setCurrentStep(prev => prev + 1);
//           window.scrollTo(0, 0);
//         }
//       } else {
//         toast({
//           title: "Validation Error",
//           description: "Please fix the errors before proceeding",
//           variant: "destructive",
//         });
//       }
//     } else if (currentStep === 3) {
//       isValid = validateStep3();
//       if (isValid) {
//         const success = await saveStep3Data();
//         if (success) {
//           setCurrentStep(prev => prev + 1);
//           window.scrollTo(0, 0);
//         }
//       } else {
//         toast({
//           title: "Validation Error",
//           description: "Please fix the errors before proceeding",
//           variant: "destructive",
//         });
//       }
//     } else if (currentStep === 4) {
//       // Just validate, don't submit
//       isValid = validateStep4();
//       if (!isValid) {
//         toast({
//           title: "Validation Error",
//           description: "Please fix the errors before proceeding",
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   const handleBack = () => {
//     setCurrentStep(prev => prev - 1);
//     window.scrollTo(0, 0);
//   };

//   const handleSuccessPopupClose = () => {
//     setShowSuccessPopup(false);
//     navigate('/dashboard/facility');
//   };

//   const StepIndicator = () => (
//     <div className="mb-8">
//       <div className="flex items-center justify-between">
//         {[1, 2, 3, 4].map((step) => (
//           <div key={step} className="flex items-center flex-1">
//             <div className="relative flex flex-col items-center">
//               <div
//                 className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
//                   currentStep >= step
//                     ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
//                     : "bg-gray-200 text-gray-600"
//                 }`}
//               >
//                 {step}
//               </div>
//               <span className="absolute -bottom-6 text-xs font-medium text-gray-600 whitespace-nowrap">
//                 {step === 1 && "Basic Info"}
//                 {step === 2 && "Location & License"}
//                 {step === 3 && "Services"}
//                 {step === 4 && "Documents"}
//               </span>
//             </div>
//             {step < 4 && (
//               <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
//                 currentStep > step ? "bg-blue-600" : "bg-gray-200"
//               }`} />
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const renderFieldError = (field: string) => {
//     if (touchedFields[field] && fieldErrors[field]) {
//       return <p className="text-red-500 text-sm mt-1">{fieldErrors[field]}</p>;
//     }
//     return null;
//   };

//   const renderStep1 = () => (
//     <div className="space-y-4">
//       <div>
//         <Label className="label-required" htmlFor="facilityName">Facility Name</Label>
//         <Input
//           id="facilityName"
//           value={formData.facilityName}
//           onChange={(e) => {
//             setFormData({ ...formData, facilityName: e.target.value });
//             if (touchedFields.facilityName) {
//               const error = validateField('facilityName', e.target.value);
//               setFieldErrors(prev => ({ ...prev, facilityName: error }));
//             }
//           }}
//           onBlur={() => handleBlur('facilityName')}
//           placeholder="Enter facility name"
//           className={touchedFields.facilityName && fieldErrors.facilityName ? "border-red-500" : ""}
//         />
//         {renderFieldError('facilityName')}
//       </div>

//       <div>
//         <Label className="label-required" htmlFor="facilityType">Facility Type</Label>
//         <Select 
//           value={formData.facilityType} 
//           onValueChange={handleFacilityTypeChange}
//           onOpenChange={() => handleBlur('facilityType')}
//         >
//           <SelectTrigger className={touchedFields.facilityType && fieldErrors.facilityType ? "border-red-500" : ""}>
//             <SelectValue placeholder="Select facility type" />
//           </SelectTrigger>
//           <SelectContent>
//             {facilityTypes.map((type) => (
//               <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
//                 {type}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         {renderFieldError('facilityType')}
//       </div>

//       <div>
//         <Label className="label-required" htmlFor="email">Email</Label>
//         <Input
//           id="email"
//           type="email"
//           value={formData.emailAddress}
//           onChange={(e) => {
//             setFormData({ ...formData, emailAddress: e.target.value });
//             if (touchedFields.emailAddress) {
//               const error = validateField('emailAddress', e.target.value);
//               setFieldErrors(prev => ({ ...prev, emailAddress: error }));
//             }
//           }}
//           onBlur={() => handleBlur('emailAddress')}
//           className={touchedFields.emailAddress && fieldErrors.emailAddress ? "border-red-500" : ""}
//         />
//         {renderFieldError('emailAddress')}
//       </div>

//       <div>
//         <Label className="label-required">Phone Number</Label>
//         <div className="flex space-x-2">
//           <Select value={countryCode} onValueChange={(value) => setCountryCode(value)}>
//             <SelectTrigger className="w-24">
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
//               if (value.length <= 10) {
//                 setPhoneNumber(value);
//                 if (touchedFields.phoneNumber) {
//                   const error = validateField('phoneNumber', value);
//                   setFieldErrors(prev => ({ ...prev, phoneNumber: error }));
//                 }
//               }
//             }}
//             onBlur={() => handleBlur('phoneNumber')}
//             className={`flex-1 ${touchedFields.phoneNumber && fieldErrors.phoneNumber ? "border-red-500" : ""}`}
//             placeholder="Enter phone number"
//           />
//         </div>
//         {renderFieldError('phoneNumber')}
//       </div>

//       <div>
//         <Label className="label-required" htmlFor="password">Password</Label>
//         <Input
//           id="password"
//           value={password}
//           type="password"
//           onChange={(e) => {
//             setPassword(e.target.value);
//             if (touchedFields.password) {
//               const error = validateField('password', e.target.value);
//               setFieldErrors(prev => ({ ...prev, password: error }));
//             }
//             if (touchedFields.repeatPassword && repeatPassword) {
//               const error = validateField('repeatPassword', repeatPassword);
//               setFieldErrors(prev => ({ ...prev, repeatPassword: error }));
//             }
//           }}
//           onBlur={() => handleBlur('password')}
//           className={touchedFields.password && fieldErrors.password ? "border-red-500" : ""}
//           placeholder="Enter your password"
//         />
//         {renderFieldError('password')}
//         <p className="text-xs text-gray-500 mt-1">
//           Password must contain: minimum 6 characters, 1 letter, 1 number, 1 special character (@$!%*?&)
//         </p>
//       </div>

//       <div>
//         <Label className="label-required" htmlFor="repeatpassword">Repeat Password</Label>
//         <Input
//           id="repeatpassword"
//           value={repeatPassword}
//           type="password"
//           onChange={(e) => {
//             setRepeatPassword(e.target.value);
//             if (touchedFields.repeatPassword) {
//               const error = validateField('repeatPassword', e.target.value);
//               setFieldErrors(prev => ({ ...prev, repeatPassword: error }));
//             }
//           }}
//           onBlur={() => handleBlur('repeatPassword')}
//           className={touchedFields.repeatPassword && fieldErrors.repeatPassword ? "border-red-500" : ""}
//           placeholder="Enter your password again"
//         />
//         {renderFieldError('repeatPassword')}
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <Label className="label-required" htmlFor="licenseNumber">Medical License Number</Label>
//           <Input
//             id="licenseNumber"
//             value={formData.licenseNumber}
//             onChange={(e) => {
//               setFormData({ ...formData, licenseNumber: e.target.value });
//               if (touchedFields.licenseNumber) {
//                 const error = validateField('licenseNumber', e.target.value);
//                 setFieldErrors(prev => ({ ...prev, licenseNumber: error }));
//               }
//             }}
//             onBlur={() => handleBlur('licenseNumber')}
//             className={touchedFields.licenseNumber && fieldErrors.licenseNumber ? "border-red-500" : ""}
//             placeholder="Enter license number"
//           />
//           {renderFieldError('licenseNumber')}
//         </div>
//         <div>
//           <Label className="label-required" htmlFor="establishedYear">Established Year</Label>
//           <Input
//             id="establishedYear"
//             type="number"
//             value={formData.establishedYear || ''}
//             onChange={(e) => {
//               const value = e.target.value ? Number(e.target.value) : 0;
//               setFormData({ ...formData, establishedYear: value });
//               if (touchedFields.establishedYear) {
//                 const error = validateField('establishedYear', value);
//                 setFieldErrors(prev => ({ ...prev, establishedYear: error }));
//               }
//             }}
//             onBlur={() => handleBlur('establishedYear')}
//             className={touchedFields.establishedYear && fieldErrors.establishedYear ? "border-red-500" : ""}
//             placeholder="Enter year"
//           />
//           {renderFieldError('establishedYear')}
//         </div>
//       </div>

//       <div>
//         <div className="flex items-center space-x-2">
//           <Checkbox
//             id="terms"
//             checked={termsAccepted}
//             onCheckedChange={(checked) => {
//               setTermsAccepted(checked as boolean);
//               if (touchedFields.terms) {
//                 const error = validateField('terms', checked);
//                 setFieldErrors(prev => ({ ...prev, terms: error }));
//               }
//             }}
//             onBlur={() => handleBlur('terms')}
//           />
//           <Label htmlFor="terms" className="text-sm">
//             I accept the <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate("/terms")}>Terms and Conditions</span> for Medical Facilities
//           </Label>
//         </div>
//         {renderFieldError('terms')}
//       </div>

//       <div>
//         <div className="flex items-center space-x-2">
//           <Checkbox
//             id="kyc"
//             checked={kycAccepted}
//             onCheckedChange={(checked) => {
//               setKycAccepted(checked as boolean);
//               if (touchedFields.kyc) {
//                 const error = validateField('kyc', checked);
//                 setFieldErrors(prev => ({ ...prev, kyc: error }));
//               }
//             }}
//             onBlur={() => handleBlur('kyc')}
//           />
//           <Label htmlFor="kyc" className="text-sm">
//             I consent to KYC verification and license validation
//           </Label>
//         </div>
//         {renderFieldError('kyc')}
//       </div>
//     </div>
//   );

//   const renderStep2 = () => (
//     <div className="space-y-4">
//       <div>
//         <Label className="label-required" htmlFor="address">Address</Label>
//         <Textarea
//           id="address"
//           value={formData.address}
//           onChange={(e) => {
//             setFormData({ ...formData, address: e.target.value });
//             if (touchedFields.address) {
//               const error = validateField('address', e.target.value);
//               setFieldErrors(prev => ({ ...prev, address: error }));
//             }
//           }}
//           onBlur={() => handleBlur('address')}
//           placeholder="Enter complete address"
//           className={touchedFields.address && fieldErrors.address ? "border-red-500" : ""}
//           rows={3}
//         />
//         {renderFieldError('address')}
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="country" className="label-required">Country</Label>
//           <select
//             id="country"
//             value={formData.country_code || ''}
//             onChange={(e) => {
//               setFormData({ 
//                 ...formData, 
//                 country_code: e.target.value,
//                 state: '',
//                 city: ''
//               });
//               if (touchedFields.country_code) {
//                 const error = validateField('country_code', e.target.value);
//                 setFieldErrors(prev => ({ ...prev, country_code: error }));
//               }
//             }}
//             onBlur={() => handleBlur('country_code')}
//             className={`w-full p-2 border rounded ${touchedFields.country_code && fieldErrors.country_code ? "border-red-500" : "border-gray-200"}`}
//           >
//             <option value="">Select Country</option>
//             {countries.map((country) => (
//               <option key={country.isoCode} value={country.name}>
//                 {country.name}
//               </option>
//             ))}
//           </select>
//           {renderFieldError('country_code')}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="state" className="label-required">State</Label>
//           <select
//             id="state"
//             value={formData.state || ''}
//             onChange={(e) => {
//               setFormData({ 
//                 ...formData, 
//                 state: e.target.value,
//                 city: ''
//               });
//               if (touchedFields.state) {
//                 const error = validateField('state', e.target.value);
//                 setFieldErrors(prev => ({ ...prev, state: error }));
//               }
//             }}
//             onBlur={() => handleBlur('state')}
//             className={`w-full p-2 border rounded ${touchedFields.state && fieldErrors.state ? "border-red-500" : "border-gray-200"}`}
//             disabled={!formData.country_code}
//           >
//             <option value="">Select State</option>
//             {states.map((state) => (
//               <option key={state.isoCode} value={state.name}>
//                 {state.name}
//               </option>
//             ))}
//           </select>
//           {renderFieldError('state')}
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <Label htmlFor="city" className="label-required">City</Label>
//           <select
//             id="city"
//             value={formData.city || ''}
//             onChange={(e) => {
//               setFormData({ ...formData, city: e.target.value });
//               if (touchedFields.city) {
//                 const error = validateField('city', e.target.value);
//                 setFieldErrors(prev => ({ ...prev, city: error }));
//               }
//             }}
//             onBlur={() => handleBlur('city')}
//             className={`w-full p-2 border rounded ${touchedFields.city && fieldErrors.city ? "border-red-500" : "border-gray-200"}`}
//             disabled={!formData.state}
//           >
//             <option value="">Select City</option>
//             {cities.map((city) => (
//               <option key={city.name} value={city.name}>
//                 {city.name}
//               </option>
//             ))}
//           </select>
//           {renderFieldError('city')}
//         </div>

//         <div>
//           <Label className="label-required" htmlFor="pincode">Pincode</Label>
//           <Input
//             id="pincode"
//             value={formData.pincode}
//             onChange={(e) => {
//               setFormData({ ...formData, pincode: e.target.value });
//               if (touchedFields.pincode) {
//                 const error = validateField('pincode', e.target.value);
//                 setFieldErrors(prev => ({ ...prev, pincode: error }));
//               }
//             }}
//             onBlur={() => handleBlur('pincode')}
//             className={touchedFields.pincode && fieldErrors.pincode ? "border-red-500" : ""}
//             maxLength={6}
//             placeholder="Enter pincode"
//           />
//           {renderFieldError('pincode')}
//         </div>
//       </div>

//       <div>
//         <Label className="label-required">Departments/Services Available</Label>
//         <div className={`grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border rounded p-3 ${touchedFields.departments && fieldErrors.departments ? "border-red-500" : "border-gray-200"}`}>
//           {availableDepartments.map((department) => (
//             <div key={department} className="flex items-center space-x-2">
//               <Checkbox
//                 id={department}
//                 checked={formData.departments.includes(department)}
//                 onCheckedChange={() => handleDepartmentToggle(department)}
//                 onBlur={() => handleBlur('departments')}
//               />
//               <Label htmlFor={department} className="text-sm">{department}</Label>
//             </div>
//           ))}
//           {availableDepartments.length === 0 && formData.facilityType && (
//             <p className="text-gray-500 text-sm col-span-2">No departments available for this facility type</p>
//           )}
//         </div>
//         {renderFieldError('departments')}
//       </div>
//     </div>
//   );

//   const renderStep3 = () => (
//     <div className="space-y-4">
//       <div>
//         <Label>Additional Services</Label>
//         <div className="grid grid-cols-2 gap-4 mt-2">
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="emergency"
//               checked={formData.emergencyServices}
//               onCheckedChange={(checked) => setFormData({ ...formData, emergencyServices: checked as boolean })}
//             />
//             <Label htmlFor="emergency" className="text-sm">24/7 Emergency Services</Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="ambulance"
//               checked={formData.ambulanceService}
//               onCheckedChange={(checked) => setFormData({ ...formData, ambulanceService: checked as boolean })}
//             />
//             <Label htmlFor="ambulance" className="text-sm">Ambulance Service</Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="teleconsult"
//               checked={formData.onlineConsultation}
//               onCheckedChange={(checked) => setFormData({ ...formData, onlineConsultation: checked as boolean })}
//             />
//             <Label htmlFor="teleconsult" className="text-sm">Online Consultation</Label>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="homevisit"
//               checked={formData.homeVisit}
//               onCheckedChange={(checked) => setFormData({ ...formData, homeVisit: checked as boolean })}
//             />
//             <Label htmlFor="homevisit" className="text-sm">Home Visit Service</Label>
//           </div>
//         </div>
//       </div>

//       <div>
//         <Label htmlFor="insuranceAccepted">Insurance Partners</Label>
//         <Input
//           id="insuranceAccepted"
//           value={formData.insurancePartners}
//           onChange={(e) => setFormData({ ...formData, insurancePartners: e.target.value })}
//           placeholder="e.g., ICICI Lombard, Star Health, Cashless accepted"
//         />
//       </div>

//       <div>
//         <Label className="label-required" htmlFor="operatingHours">Operating Hours</Label>
//         <Input
//           id="operatingHours"
//           value={formData.operatingHours}
//           onChange={(e) => {
//             setFormData({ ...formData, operatingHours: e.target.value });
//             if (touchedFields.operatingHours) {
//               const error = validateField('operatingHours', e.target.value);
//               setFieldErrors(prev => ({ ...prev, operatingHours: error }));
//             }
//           }}
//           onBlur={() => handleBlur('operatingHours')}
//           className={touchedFields.operatingHours && fieldErrors.operatingHours ? "border-red-500" : ""}
//           placeholder="e.g., Mon-Sat: 9AM-9PM, Sun: 9AM-6PM"
//         />
//         {renderFieldError('operatingHours')}
//       </div>

//       <div>
//         <Label htmlFor="website">Website (Optional)</Label>
//         <Input
//           id="website"
//           type="url"
//           value={formData.website}
//           onChange={(e) => setFormData({ ...formData, website: e.target.value })}
//           placeholder="https://www.yourfacility.com"
//         />
//       </div>

//       <div>
//         <Label htmlFor="description">About Your Facility</Label>
//         <Textarea
//           id="description"
//           value={formData.aboutFacility}
//           onChange={(e) => setFormData({ ...formData, aboutFacility: e.target.value })}
//           placeholder="Brief description of your facility, specialties, achievements..."
//           rows={4}
//         />
//       </div>
//     </div>
//   );

//   const renderStep4 = () => (
//     <div className="space-y-5">
//       <div className="text-center mb-6">
//         <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Profile & Document Setup
//         </h3>
//         <p className="text-sm text-gray-500">Complete your facility profile (Optional)</p>
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
//           >
//             {profileImage ? 'Change Picture' : 'Upload Picture'}
//           </Button>
//           <p className="text-xs text-gray-500">Optional: Upload a profile picture for your facility</p>
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
//             <p className="text-sm text-blue-600">Click to upload facility documents</p>
//             <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB each (Optional)</p>
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
//     </div>
//   );

//   const validateStep = (step: number): boolean => {
//     let isValid = true;
//     const fieldsToValidate: string[] = [];
    
//     if (step === 1) {
//       fieldsToValidate.push('facilityName', 'facilityType', 'emailAddress', 'phoneNumber', 'password', 'repeatPassword', 'terms', 'kyc');
//     } else if (step === 2) {
//       fieldsToValidate.push('address', 'city', 'state', 'country_code', 'pincode', 'licenseNumber', 'establishedYear', 'departments');
//     } else if (step === 3) {
//       fieldsToValidate.push('operatingHours');
//     } else if (step === 4) {
//       // Step 4 has NO required fields - everything is optional
//       return false;
//     }
    
//     fieldsToValidate.forEach(field => {
//       const value = getFieldValue(field);
//       const error = validateField(field, value);
//       setFieldErrors(prev => ({ ...prev, [field]: error }));
//       setTouchedFields(prev => ({ ...prev, [field]: true }));
//       if (error) isValid = false;
//     });
    
//     return isValid;
//   };

//   // Individual step validation functions
//   const validateStep1 = (): boolean => {
//     return validateStep(1);
//   };

//   const validateStep2 = (): boolean => {
//     return validateStep(2);
//   };

//   const validateStep3 = (): boolean => {
//     return validateStep(3);
//   };

//   const validateStep4 = (): boolean => {
//     // return validateStep(4);
//       return false;
//   };

//   return (
//     <AuthLayout
//       title="Medical Facility Registration"
//       description="Register your healthcare facility on our platform"
//       userType="facility"
//     >
//       <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 rounded-xl">
//         <StepIndicator />
        
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {currentStep === 1 && renderStep1()}
//           {currentStep === 2 && renderStep2()}
//           {currentStep === 3 && renderStep3()}
//           {currentStep === 4 && renderStep4()}

//           <div className="flex justify-between pt-4">
//             {currentStep > 1 && (
//               <Button type="button" variant="outline" onClick={handleBack}>
//                 ← Back
//               </Button>
//             )}
            
//             {currentStep < 4 ? (
//               <Button 
//                 type="button" 
//                 variant="facility" 
//                 onClick={handleNext}
//                 disabled={isSubmitting}
//                 className={currentStep === 1 ? "ml-auto" : ""}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <span className="animate-spin mr-2">⟳</span>
//                     Saving...
//                   </>
//                 ) : (
//                   "Next →"
//                 )}
//               </Button>
//             ) : (
//               <>
//               {currentStep === 4 && (
//               <Button 
//                 type="button" 
//                 variant="facility" 
//                 onClick={handleSubmit}
//                 className="ml-auto"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <span className="animate-spin mr-2">⟳</span>
//                     Submitting...
//                   </>
//                 ) : (
//                   "Complete Registration"
//                 )}
//               </Button>
//               )}
//               </>
//             )}
//           </div>

//           <div className="text-center text-sm text-muted-foreground">
//             Already registered?{" "}
//             <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/login/facility")}>
//               Sign in here
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

// export default FacilityRegistration;

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "./AuthLayout";
import { MedicalFacility } from "@/Models/MedicalFacility";
import { supabase } from "@/integrations/supabase/client";
import '../../styles/form-input-styles.css';
import mixpanelInstance from "@/utils/mixpanel";
// import { Country, State, City } from "country-state-city";
import { Camera, Check, Upload } from "lucide-react";
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
const SuccessPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-green-600">
            Welcome to Your Facility Dashboard! 🏥
          </DialogTitle>
          <DialogDescription className="text-center pt-4">
            Your facility has been successfully registered. You can now manage appointments, access medical records, and connect with patients.
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
              Complete your facility profile
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              Add doctors and staff members
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              Manage appointments and schedules
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              Accept online consultations
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

const FacilityRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MedicalFacility>({
    facilityName: '',
    facilityType: '',
    phoneNumber: '',
    emailAddress: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: 0,
    longitude: 0,
    licenseNumber: '',
    establishedYear: 0,
    totalBeds: 0,
    departments: ["Bed Management"],
    emergencyServices: false,
    ambulanceService: false,
    onlineConsultation: false,
    homeVisit: false,
    isVerified: true,
    insurancePartners: '',
    operatingHours: '',
    website: '',
    aboutFacility: '',
    country_code: "India",
  });
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [kycAccepted, setKycAccepted] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [facilityId, setFacilityId] = useState<string | null>(null);
  
  // const [countries] = useState(Country.getAllCountries());
  // const [states, setStates] = useState<any[]>([]);
  // const [cities, setCities] = useState<any[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([]);
  
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const [uploadedDocs, setUploadedDocs] = useState<Array<{name: string, type: string}>>([]);
  const [user, setUser] = useState<any>(null);

  const facilityTypes = [
    "Hospital", "Clinic", "Diagnostic Center", "Pharmacy", "Ayurveda Center",
    "Homeopathy Clinic", "Physiotherapy Center", "Dental Clinic",
    "Eye Care Center", "Maternity Home", "Nursing Home", "Rehabilitation Center"
  ];

  const getDepartmentsByFacilityType = (facilityType: string) => {
    const departmentMap: { [key: string]: string[] } = {
      'hospital': [
        "General Medicine", "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
        "Gynecology", "Surgery", "Emergency", "ICU", "Radiology", "Pathology",
        "Dermatology", "ENT", "Ophthalmology", "Psychiatry", "Physiotherapy"
      ],
      'clinic': [
        "General Medicine", "Pediatrics", "Gynecology", "Dermatology", "ENT", 
        "Physiotherapy"
      ],
      'diagnostic-center': [
        "Radiology", "Pathology", "Cardiology", "Neurology"
      ],
      'pharmacy': [
        "General Medicine", "Cardiology", "Diabetes Care", "Women's Health"
      ],
      'ayurveda-center': [
        "Ayurveda", "Panchakarma", "Herbal Medicine", "Dietetics"
      ],
      'homeopathy-clinic': [
        "Homeopathy", "General Medicine", "Pediatrics", "Dermatology"
      ],
      'physiotherapy-center': [
        "Physiotherapy", "Orthopedics", "Neurology", "Sports Medicine"
      ],
      'dental-clinic': [
        "Dental", "Orthodontics", "Endodontics", "Oral Surgery"
      ],
      'eye-care-center': [
        "Ophthalmology", "Optometry", "Retina Specialists", "Cornea Specialists"
      ],
      'maternity-home': [
        "Gynecology", "Pediatrics", "Neonatology", "Obstetrics"
      ],
      'nursing-home': [
        "General Medicine", "Geriatrics", "Palliative Care", "Nursing Care"
      ],
      'rehabilitation-center': [
        "Physiotherapy", "Occupational Therapy", "Speech Therapy", "Psychology"
      ]
    };
    return departmentMap[facilityType] || [];
  };

  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'facilityName':
        if (!value) return "Facility name is required";
        if (value.length < 3) return "Facility name must be at least 3 characters";
        return "";
      case 'facilityType':
        if (!value) return "Facility type is required";
        return "";
      case 'emailAddress':
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        return "";
      case 'phoneNumber':
        if (!value) return "Phone number is required";
        if (value.length !== 10) return "Phone number must be 10 digits";
        if (!/^\d+$/.test(value)) return "Phone number must contain only digits";
        return "";
      case 'password':
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(value)) return "Password must contain letter, number and special character";
        return "";
      case 'repeatPassword':
        if (!value) return "Please confirm your password";
        if (value !== password) return "Passwords do not match";
        return "";
      case 'terms':
        if (!termsAccepted) return "Please accept the terms and conditions";
        return "";
      case 'kyc':
        if (!kycAccepted) return "Please accept KYC verification";
        return "";
      case 'address':
        if (!value) return "Address is required";
        if (value.length < 10) return "Address must be at least 10 characters";
        return "";
      case 'city':
        if (!value) return "City is required";
        if (value.length < 3) return "City must be at least 3 characters";
        return "";
      case 'state':
        if (!value) return "State is required";
        if (value.length < 3) return "State must be at least 3 characters";
        return "";
      case 'country_code':
        if (!value) return "Country is required";
        return "";
      case 'pincode':
        if (!value) return "Pincode is required";
        if (value.length !== 6) return "Pincode must be 6 digits";
        if (!/^\d+$/.test(value)) return "Pincode must contain only digits";
        return "";
      case 'licenseNumber':
        if (!value) return "License number is required";
        if (value.length < 5) return "License number must be at least 5 characters";
        return "";
      case 'establishedYear':
        if (!value) return "Established year is required";
        const currentYear = new Date().getFullYear();
        if (value < 1900 ) return `Year must be between 1900 and ${currentYear}`;
        return "";
      case 'departments':
        if (!value || value.length === 0) return "Please select at least one department";
        return "";
      case 'operatingHours':
        if (!value) return "Operating hours are required";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, getFieldValue(field));
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const getFieldValue = (field: string): any => {
    switch (field) {
      case 'phoneNumber': return phoneNumber;
      case 'password': return password;
      case 'repeatPassword': return repeatPassword;
      case 'terms': return termsAccepted;
      case 'kyc': return kycAccepted;
      case 'departments': return formData.departments;
      default: return formData[field as keyof MedicalFacility];
    }
  };

  // useEffect(() => {
  //   if (formData.country_code) {
  //     const selectedCountry = countries.find(c => c.name === formData.country_code);
  //     if (selectedCountry) {
  //       const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
  //       setStates(countryStates);
  //       if (!countryStates.find(s => s.name === formData.state)) {
  //         setFormData(prev => ({ ...prev, state: '', city: '' }));
  //         setCities([]);
  //       }
  //     } else {
  //       setStates([]);
  //       setCities([]);
  //     }
  //   }
  // }, [formData.country_code, countries]);

  // useEffect(() => {
  //   if (formData.country_code && formData.state) {
  //     const selectedCountry = countries.find(c => c.name === formData.country_code);
  //     const selectedState = states.find(s => s.name === formData.state);
      
  //     if (selectedCountry && selectedState) {
  //       const countryCities = City.getCitiesOfState(
  //         selectedCountry.isoCode, 
  //         selectedState.isoCode
  //       );
  //       setCities(countryCities);
  //       if (formData.city && !countryCities.find(c => c.name === formData.city)) {
  //         setFormData(prev => ({ ...prev, city: '' }));
  //       }
  //     } else {
  //       setCities([]);
  //     }
  //   }
  // }, [formData.country_code, formData.state, countries, states]);

  const handleFacilityTypeChange = (value: string) => {
    setFormData({ ...formData, facilityType: value });
    const departments = getDepartmentsByFacilityType(value);
    setAvailableDepartments(departments);
    setFormData(prev => ({ ...prev, departments: ["Bed Management"] }));
    
    if (touchedFields.facilityType) {
      const error = validateField('facilityType', value);
      setFieldErrors(prev => ({ ...prev, facilityType: error }));
    }
  };

  const handleDepartmentToggle = (department: string) => {
    const updatedDepartments = formData.departments.includes(department)
      ? formData.departments.filter(d => d !== department)
      : [...formData.departments, department];
    
    setFormData(prev => ({
      ...prev,
      departments: updatedDepartments
    }));
    
    if (touchedFields.departments) {
      const error = validateField('departments', updatedDepartments);
      setFieldErrors(prev => ({ ...prev, departments: error }));
    }
  };

  const checkLicenseNumberExists = async (licenseNumber: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("facilities")
        .select("license_number")
        .eq("license_number", licenseNumber)
        .maybeSingle();

      if (error) {
        console.error("Error checking license number:", error);
        return false;
      }
      return !!data;
    } catch (error) {
      console.error("Error in license number check:", error);
      return false;
    }
  };
  
  // Step 1: Create user account and profile (SAVES IMMEDIATELY)
  const saveStep1Data = async (): Promise<boolean> => {
    setIsSubmitting(true);
    const fullPhoneNumber = countryCode + phoneNumber;
    
    try {
      // Check if license exists BEFORE creating user
      const licenseExists = await checkLicenseNumberExists(formData.licenseNumber);
      if (licenseExists) {
        toast({
          title: "License Number Already Registered",
          description: "This medical license number is already registered in our system.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return false;
      }

      // Create user account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.emailAddress.toLowerCase(),
        password: password,
        options: {
          data: {
            first_name: formData.facilityName,
            phone_number: fullPhoneNumber,
            avatar_url: profileImage,
            role: 'hospital_admin',
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
  
      setUserId(userId);
      setUser(signUpData.user);
      
      const { data: existingProfile, error: checkError } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('id', userId)
                        .maybeSingle();
                  
                      let profileError;
      
                      await supabase
        .from('profiles')
        .update({
          first_name: formData.facilityName,
          phone_number: fullPhoneNumber,
          role: 'hospital_admin',
          email: formData.emailAddress.toLowerCase(),
          updated_at: new Date().toISOString(),
        })
        .eq('email',formData.emailAddress);
        
      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast({
          title: 'Profile Creation Issue',
          description: 'Your account was created but we had trouble saving profile details.',
        });
      }

      // Create facility record with minimal data (only step 1 data)
      const operatingHoursObj = {
        schedule: formData.operatingHours || "Mon-Sat: 9AM-9PM",
        timezone: "UTC"
      };

      const additionalServicesObj = {
        emergencyServices: formData.emergencyServices,
        ambulanceService: formData.ambulanceService,
        onlineConsultation: formData.onlineConsultation,
        homeVisit: formData.homeVisit
      };

      const { data: facilityData, error: facilityError } = await supabase
        .from('facilities')
        .insert({
          admin_user_id: userId,
          address: formData.address || "",
          city: formData.city || "",
          state: formData.state|| "",
          pincode: formData.pincode ? Number(formData.pincode) : null,
          country_code: formData.country_code|| "India",
          total_beds: Number(formData.totalBeds) || 0,
          departments: formData.departments,
          facility_name: formData.facilityName,
          facility_type: formData.facilityType,
          license_number: formData.licenseNumber,
          established_year: formData.establishedYear ? Number(formData.establishedYear) : null,
          is_verified: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (facilityError) {
        console.error('Error creating facility:', facilityError);
        toast({
          title: 'Facility Creation Issue',
          description: 'Your account was created but we had trouble saving facility details.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return false;
      }
      
      setFacilityId(facilityData.id);

      toast({
        title: 'Step 1 Completed',
        description: 'Facility information saved successfully!',
      });
      
      setIsSubmitting(false);
      return true;
      
    } catch (error) {
      console.error('Error saving step 1:', error);
      toast({
        title: 'Error',
        description: 'Failed to save facility information',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return false;
    }
  };

  // Final Submit - Saves all remaining data (Steps 2, 3, 4)
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (!facilityId) {
        toast({
          title: "Error",
          description: "Facility not found. Please complete step 1 first.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Update facility with ALL remaining data (Step 2, 3, and 4 data)
      const operatingHoursObj = {
        schedule: formData.operatingHours || "Mon-Sat: 9AM-9PM",
        timezone: "UTC"
      };

      const additionalServicesObj = {
        emergencyServices: formData.emergencyServices,
        ambulanceService: formData.ambulanceService,
        onlineConsultation: formData.onlineConsultation,
        homeVisit: formData.homeVisit
      };

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
                   avatar_url: profileImage 
                 })
                 .eq('email', formData.emailAddress);

        if (profileUpdateError) {
          console.error('Error updating profile avatar:', profileUpdateError);
          // Continue with patient data save even if avatar update fails
        }
      }

      const { error: facilityError } = await supabase
        .from('facilities')
        .update({
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode ? Number(formData.pincode) : null,
          country_code: formData.country_code,
          total_beds: Number(formData.totalBeds) || 0,
          departments: formData.departments,
          number_of_departments: formData.departments.length,
          insurance_partners: formData.insurancePartners || '',
          operating_hours: operatingHoursObj,
          additional_services: additionalServicesObj,
          website: formData.website || '',
          about_facility: formData.aboutFacility || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', facilityId);

      if (facilityError) {
        console.error('Error updating facility:', facilityError);
        toast({
          title: "Error",
          description: "Failed to save facility details",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Update departments - delete existing and insert new
      if (formData.departments && formData.departments.length > 0) {
        // First delete existing departments
        await supabase
          .from("departments")
          .delete()
          .eq('facility_id', facilityId);
        
        // Then insert new departments
        const departmentInserts = formData.departments.map(deptName => ({
          facility_id: facilityId,
          name: deptName,
          description: formData.aboutFacility || '',
          created_at: new Date().toISOString(),
        }));

        const { error: deptError } = await supabase
          .from("departments")
          .insert(departmentInserts);

        if (deptError) {
          console.error('Error inserting departments:', deptError);
        }
      }

      // Save profile image if uploaded
      if (profileImage && userId) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: profileImage })
          .eq('id', userId);

        if (updateError) {
          console.error('Error saving profile image:', updateError);
        }
      }

      // Save documents if uploaded
      if (uploadedDocs.length > 0) {
        const documentUrls = uploadedDocs.map(doc => doc.name);
        
        const { error: docError } = await supabase
          .from('facilities')
          .update({
            documents: documentUrls,
            updated_at: new Date().toISOString()
          })
          .eq('id', facilityId);

        if (docError) {
          console.error('Error saving document references:', docError);
        }
      }

      // Track successful registration
      mixpanelInstance.track("Facility Registration Success", {
        email: formData.emailAddress,
        facility_name: formData.facilityName,
        facility_id: facilityId,
        has_profile_image: !!profileImage,
        documents_count: uploadedDocs.length,
      });

      // Success message
      toast({
        title: "Registration Successful! 🎉",
        description: "Your facility has been registered successfully.",
      });

      // Show success popup
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
  
  // const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (!files) return;
    
  //   setIsUploading(true);
    
  //   for (let file of files) {
  //     try {
  //       const cleanFileName = file.name
  //         .replace(/\s+/g, "_")
  //         .replace(/[^\w.-]/g, "")
  //         .toLowerCase();

  //       const filePath = `facility_documents/${Date.now()}_${cleanFileName}`;
  //       const { error } = await supabase
  //         .storage
  //         .from('heal_med_app_files_bucket')
  //         .upload(filePath, file, {
  //           cacheControl: '3600',
  //           upsert: false
  //         });
  
  //       if (error) {
  //         toast({
  //           title: "Upload Failed",
  //           description: error.message,
  //           variant: "destructive",
  //         });
  //         setIsUploading(false);
  //         return;
  //       } else {
  //         setUploadedDocs(prev => [...prev, { 
  //           name: file.name, 
  //           type: 'facility' 
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
          type: 'facility' 
        }]);
        toast({
          title: "Files Uploaded",
          description: `file(s) uploaded successfully.`,
        });
      }
    }
    
    setIsUploading(false);
  };
  const handleNext = async () => {
    if (isSubmitting) return;
    
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = validateStep1();
      if (isValid) {
        const success = await saveStep1Data();
        if (success) {
          setCurrentStep(prev => prev + 1);
          window.scrollTo(0, 0);
        }
      } else {
        toast({
          title: "Validation Error",
          description: "Please fix the errors before proceeding",
          variant: "destructive",
        });
      }
    } else if (currentStep === 2) {
      isValid = validateStep2();
      if (isValid) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      } else {
        toast({
          title: "Validation Error",
          description: "Please fix the errors before proceeding",
          variant: "destructive",
        });
      }
    } else if (currentStep === 3) {
      isValid = validateStep3();
      if (isValid) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      } else {
        toast({
          title: "Validation Error",
          description: "Please fix the errors before proceeding",
          variant: "destructive",
        });
      }
    } else if (currentStep === 4) {
      isValid = validateStep4();
      if (isValid) {
        // Do nothing - just validate
      } else {
        toast({
          title: "Validation Error",
          description: "Please check your inputs",
          variant: "destructive",
        });
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    navigate('/dashboard/facility');
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="relative flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  currentStep >= step
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step}
              </div>
              <span className="absolute -bottom-6 text-xs font-medium text-gray-600 whitespace-nowrap">
                {step === 1 && "Basic Info"}
                {step === 2 && "Location & License"}
                {step === 3 && "Services"}
                {step === 4 && "Documents"}
              </span>
            </div>
            {step < 4 && (
              <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                currentStep > step ? "bg-blue-600" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderFieldError = (field: string) => {
    if (touchedFields[field] && fieldErrors[field]) {
      return <p className="text-red-500 text-sm mt-1">{fieldErrors[field]}</p>;
    }
    return null;
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label className="label-required" htmlFor="facilityName">Facility Name</Label>
        <Input
          id="facilityName"
          value={formData.facilityName}
          onChange={(e) => {
            setFormData({ ...formData, facilityName: e.target.value });
            if (touchedFields.facilityName) {
              const error = validateField('facilityName', e.target.value);
              setFieldErrors(prev => ({ ...prev, facilityName: error }));
            }
          }}
          onBlur={() => handleBlur('facilityName')}
          placeholder="Enter facility name"
          className={touchedFields.facilityName && fieldErrors.facilityName ? "border-red-500" : ""}
        />
        {renderFieldError('facilityName')}
      </div>

      <div>
        <Label className="label-required" htmlFor="facilityType">Facility Type</Label>
        <Select 
          value={formData.facilityType} 
          onValueChange={handleFacilityTypeChange}
          onOpenChange={() => handleBlur('facilityType')}
        >
          <SelectTrigger className={touchedFields.facilityType && fieldErrors.facilityType ? "border-red-500" : ""}>
            <SelectValue placeholder="Select facility type" />
          </SelectTrigger>
          <SelectContent>
            {facilityTypes.map((type) => (
              <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {renderFieldError('facilityType')}
      </div>

      <div>
        <Label className="label-required" htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.emailAddress}
          onChange={(e) => {
            setFormData({ ...formData, emailAddress: e.target.value });
            if (touchedFields.emailAddress) {
              const error = validateField('emailAddress', e.target.value);
              setFieldErrors(prev => ({ ...prev, emailAddress: error }));
            }
          }}
          onBlur={() => handleBlur('emailAddress')}
          className={touchedFields.emailAddress && fieldErrors.emailAddress ? "border-red-500" : ""}
        />
        {renderFieldError('emailAddress')}
      </div>

      <div>
        <Label className="label-required">Phone Number</Label>
        <div className="flex space-x-2">
          <Select value={countryCode} onValueChange={(value) => setCountryCode(value)}>
            <SelectTrigger className="w-24">
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
              if (value.length <= 10) {
                setPhoneNumber(value);
                if (touchedFields.phoneNumber) {
                  const error = validateField('phoneNumber', value);
                  setFieldErrors(prev => ({ ...prev, phoneNumber: error }));
                }
              }
            }}
            onBlur={() => handleBlur('phoneNumber')}
            className={`flex-1 ${touchedFields.phoneNumber && fieldErrors.phoneNumber ? "border-red-500" : ""}`}
            placeholder="Enter phone number"
          />
        </div>
        {renderFieldError('phoneNumber')}
      </div>

      <div>
        <Label className="label-required" htmlFor="password">Password</Label>
        <Input
          id="password"
          value={password}
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
            if (touchedFields.password) {
              const error = validateField('password', e.target.value);
              setFieldErrors(prev => ({ ...prev, password: error }));
            }
            if (touchedFields.repeatPassword && repeatPassword) {
              const error = validateField('repeatPassword', repeatPassword);
              setFieldErrors(prev => ({ ...prev, repeatPassword: error }));
            }
          }}
          onBlur={() => handleBlur('password')}
          className={touchedFields.password && fieldErrors.password ? "border-red-500" : ""}
          placeholder="Enter your password"
        />
        {renderFieldError('password')}
        <p className="text-xs text-gray-500 mt-1">
          Password must contain: minimum 6 characters, 1 letter, 1 number, 1 special character (@$!%*?&)
        </p>
      </div>

      <div>
        <Label className="label-required" htmlFor="repeatpassword">Repeat Password</Label>
        <Input
          id="repeatpassword"
          value={repeatPassword}
          type="password"
          onChange={(e) => {
            setRepeatPassword(e.target.value);
            if (touchedFields.repeatPassword) {
              const error = validateField('repeatPassword', e.target.value);
              setFieldErrors(prev => ({ ...prev, repeatPassword: error }));
            }
          }}
          onBlur={() => handleBlur('repeatPassword')}
          className={touchedFields.repeatPassword && fieldErrors.repeatPassword ? "border-red-500" : ""}
          placeholder="Enter your password again"
        />
        {renderFieldError('repeatPassword')}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="label-required" htmlFor="licenseNumber">Medical License Number</Label>
          <Input
            id="licenseNumber"
            value={formData.licenseNumber}
            onChange={(e) => {
              setFormData({ ...formData, licenseNumber: e.target.value });
              if (touchedFields.licenseNumber) {
                const error = validateField('licenseNumber', e.target.value);
                setFieldErrors(prev => ({ ...prev, licenseNumber: error }));
              }
            }}
            onBlur={() => handleBlur('licenseNumber')}
            className={touchedFields.licenseNumber && fieldErrors.licenseNumber ? "border-red-500" : ""}
            placeholder="Enter license number"
          />
          {renderFieldError('licenseNumber')}
        </div>
        <div>
          <Label className="label-required" htmlFor="establishedYear">Established Year</Label>
          <Input
            id="establishedYear"
            type="number"
            value={formData.establishedYear || ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : 0;
              setFormData({ ...formData, establishedYear: value });
              if (touchedFields.establishedYear) {
                const error = validateField('establishedYear', value);
                setFieldErrors(prev => ({ ...prev, establishedYear: error }));
              }
            }}
            onBlur={() => handleBlur('establishedYear')}
            className={touchedFields.establishedYear && fieldErrors.establishedYear ? "border-red-500" : ""}
            placeholder="Enter year"
          />
          {renderFieldError('establishedYear')}
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => {
              setTermsAccepted(checked as boolean);
              if (touchedFields.terms) {
                const error = validateField('terms', checked);
                setFieldErrors(prev => ({ ...prev, terms: error }));
              }
            }}
            onBlur={() => handleBlur('terms')}
          />
          <Label htmlFor="terms" className="text-sm">
            I accept the <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate("/terms")}>Terms and Conditions</span> for Medical Facilities
          </Label>
        </div>
        {renderFieldError('terms')}
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="kyc"
            checked={kycAccepted}
            onCheckedChange={(checked) => {
              setKycAccepted(checked as boolean);
              if (touchedFields.kyc) {
                const error = validateField('kyc', checked);
                setFieldErrors(prev => ({ ...prev, kyc: error }));
              }
            }}
            onBlur={() => handleBlur('kyc')}
          />
          <Label htmlFor="kyc" className="text-sm">
            I consent to KYC verification and license validation
          </Label>
        </div>
        {renderFieldError('kyc')}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label className="label-required" htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => {
            setFormData({ ...formData, address: e.target.value });
            if (touchedFields.address) {
              const error = validateField('address', e.target.value);
              setFieldErrors(prev => ({ ...prev, address: error }));
            }
          }}
          onBlur={() => handleBlur('address')}
          placeholder="Enter complete address"
          className={touchedFields.address && fieldErrors.address ? "border-red-500" : ""}
          rows={3}
        />
        {renderFieldError('address')}
      </div>

      {/* <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country" className="label-required">Country</Label>
          <select
            id="country"
            value={formData.country_code || ''}
            onChange={(e) => {
              setFormData({ 
                ...formData, 
                country_code: e.target.value,
                state: '',
                city: ''
              });
              if (touchedFields.country_code) {
                const error = validateField('country_code', e.target.value);
                setFieldErrors(prev => ({ ...prev, country_code: error }));
              }
            }}
            onBlur={() => handleBlur('country_code')}
            className={`w-full p-2 border rounded ${touchedFields.country_code && fieldErrors.country_code ? "border-red-500" : "border-gray-200"}`}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.isoCode} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          {renderFieldError('country_code')}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="label-required">State</Label>
          <select
            id="state"
            value={formData.state || ''}
            onChange={(e) => {
              setFormData({ 
                ...formData, 
                state: e.target.value,
                city: ''
              });
              if (touchedFields.state) {
                const error = validateField('state', e.target.value);
                setFieldErrors(prev => ({ ...prev, state: error }));
              }
            }}
            onBlur={() => handleBlur('state')}
            className={`w-full p-2 border rounded ${touchedFields.state && fieldErrors.state ? "border-red-500" : "border-gray-200"}`}
            disabled={!formData.country_code}
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.isoCode} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
          {renderFieldError('state')}
        </div>
      </div> */}

      <div className="grid grid-cols-2 gap-4">
        {/* <div className="space-y-2">
          <Label htmlFor="city" className="label-required">City</Label>
          <select
            id="city"
            value={formData.city || ''}
            onChange={(e) => {
              setFormData({ ...formData, city: e.target.value });
              if (touchedFields.city) {
                const error = validateField('city', e.target.value);
                setFieldErrors(prev => ({ ...prev, city: error }));
              }
            }}
            onBlur={() => handleBlur('city')}
            className={`w-full p-2 border rounded ${touchedFields.city && fieldErrors.city ? "border-red-500" : "border-gray-200"}`}
            disabled={!formData.state}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {renderFieldError('city')}
        </div> */}
        

        <div className="space-y-2">
          <Label className="label-required" htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => {
              setFormData({ ...formData, city: e.target.value });
              if (touchedFields.city) {
                const error = validateField('city', e.target.value);
                setFieldErrors(prev => ({ ...prev, city: error }));
              }
            }}
            onBlur={() => handleBlur('city')}
            className={touchedFields.city && fieldErrors.city ? "border-red-500" : ""}
            // maxLength={6}
            placeholder="Enter city"
          />
          {renderFieldError('city')}
        </div>

        <div>
          <Label className="label-required" htmlFor="pincode">Pincode</Label>
          <Input
            id="pincode"
            value={formData.pincode}
            onChange={(e) => {
              setFormData({ ...formData, pincode: e.target.value });
              if (touchedFields.pincode) {
                const error = validateField('pincode', e.target.value);
                setFieldErrors(prev => ({ ...prev, pincode: error }));
              }
            }}
            onBlur={() => handleBlur('pincode')}
            className={touchedFields.pincode && fieldErrors.pincode ? "border-red-500" : ""}
            maxLength={6}
            placeholder="Enter pincode"
          />
          {renderFieldError('pincode')}
        </div>
      </div>

      <div>
        <Label className="label-required">Departments/Services Available</Label>
        <div className={`grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border rounded p-3 ${touchedFields.departments && fieldErrors.departments ? "border-red-500" : "border-gray-200"}`}>
          {availableDepartments.map((department) => (
            <div key={department} className="flex items-center space-x-2">
              <Checkbox
                id={department}
                checked={formData.departments.includes(department)}
                onCheckedChange={() => handleDepartmentToggle(department)}
                onBlur={() => handleBlur('departments')}
              />
              <Label htmlFor={department} className="text-sm">{department}</Label>
            </div>
          ))}
          {availableDepartments.length === 0 && formData.facilityType && (
            <p className="text-gray-500 text-sm col-span-2">No departments available for this facility type</p>
          )}
        </div>
        {renderFieldError('departments')}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <Label>Additional Services</Label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emergency"
              checked={formData.emergencyServices}
              onCheckedChange={(checked) => setFormData({ ...formData, emergencyServices: checked as boolean })}
            />
            <Label htmlFor="emergency" className="text-sm">24/7 Emergency Services</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ambulance"
              checked={formData.ambulanceService}
              onCheckedChange={(checked) => setFormData({ ...formData, ambulanceService: checked as boolean })}
            />
            <Label htmlFor="ambulance" className="text-sm">Ambulance Service</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="teleconsult"
              checked={formData.onlineConsultation}
              onCheckedChange={(checked) => setFormData({ ...formData, onlineConsultation: checked as boolean })}
            />
            <Label htmlFor="teleconsult" className="text-sm">Online Consultation</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="homevisit"
              checked={formData.homeVisit}
              onCheckedChange={(checked) => setFormData({ ...formData, homeVisit: checked as boolean })}
            />
            <Label htmlFor="homevisit" className="text-sm">Home Visit Service</Label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="totalBeds">Total Beds</Label>
        <Input
          id="totalBeds"
          type="number"
          value={formData.totalBeds || ''}
          onChange={(e) => setFormData({ ...formData, totalBeds: Number(e.target.value) })}
          placeholder="Enter number of beds"
        />
      </div>

      <div>
        <Label htmlFor="insuranceAccepted">Insurance Partners</Label>
        <Input
          id="insuranceAccepted"
          value={formData.insurancePartners}
          onChange={(e) => setFormData({ ...formData, insurancePartners: e.target.value })}
          placeholder="e.g., ICICI Lombard, Star Health, Cashless accepted"
        />
      </div>

      <div>
        <Label className="label-required" htmlFor="operatingHours">Operating Hours</Label>
        <Input
          id="operatingHours"
          value={formData.operatingHours}
          onChange={(e) => {
            setFormData({ ...formData, operatingHours: e.target.value });
            if (touchedFields.operatingHours) {
              const error = validateField('operatingHours', e.target.value);
              setFieldErrors(prev => ({ ...prev, operatingHours: error }));
            }
          }}
          onBlur={() => handleBlur('operatingHours')}
          className={touchedFields.operatingHours && fieldErrors.operatingHours ? "border-red-500" : ""}
          placeholder="e.g., Mon-Sat: 9AM-9PM, Sun: 9AM-6PM"
        />
        {renderFieldError('operatingHours')}
      </div>

      <div>
        <Label htmlFor="website">Website (Optional)</Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="https://www.yourfacility.com"
        />
      </div>

      <div>
        <Label htmlFor="description">About Your Facility</Label>
        <Textarea
          id="description"
          value={formData.aboutFacility}
          onChange={(e) => setFormData({ ...formData, aboutFacility: e.target.value })}
          placeholder="Brief description of your facility, specialties, achievements..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Profile & Document Setup
        </h3>
        <p className="text-sm text-gray-500">Complete your facility profile (Optional)</p>
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
          <p className="text-xs text-gray-500">Optional: Upload a profile picture for your facility</p>
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
            <p className="text-sm text-blue-600">Click to upload facility documents</p>
            <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB each (Optional)</p>
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
    </div>
  );

  const validateStep = (step: number): boolean => {
    let isValid = true;
    const fieldsToValidate: string[] = [];
    
    if (step === 1) {
      fieldsToValidate.push('facilityName', 'facilityType', 'emailAddress', 'phoneNumber', 'password', 'repeatPassword', 'terms', 'kyc');
    } else if (step === 2) {
      fieldsToValidate.push('address', 'city', 'state', 'country_code', 'pincode', 'licenseNumber', 'establishedYear', 'departments');
    } else if (step === 3) {
      fieldsToValidate.push('operatingHours');
    } else if (step === 4) {
      // Step 4 has NO required fields - everything is optional
      return true;
    }
    
    fieldsToValidate.forEach(field => {
      const value = getFieldValue(field);
      const error = validateField(field, value);
      setFieldErrors(prev => ({ ...prev, [field]: error }));
      setTouchedFields(prev => ({ ...prev, [field]: true }));
      if (error) isValid = false;
    });
    
    return isValid;
  };

  // Individual step validation functions
  const validateStep1 = (): boolean => {
    return validateStep(1);
  };

  const validateStep2 = (): boolean => {
    return validateStep(2);
  };

  const validateStep3 = (): boolean => {
    return validateStep(3);
  };

  const validateStep4 = (): boolean => {
    return true; // Always valid - optional fields
  };

  return (
    <AuthLayout
      title="Medical Facility Registration"
      description="Register your healthcare facility on our platform"
      userType="facility"
    >
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 rounded-xl">
        <StepIndicator />
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          <div className="flex justify-between pt-4">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                ← Back
              </Button>
            )}
            
            {currentStep < 4 ? (
              <Button 
                type="button" 
                variant="facility" 
                onClick={handleNext}
                disabled={isSubmitting}
                className={currentStep === 1 ? "ml-auto" : ""}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Saving...
                  </>
                ) : (
                  "Next →"
                )}
              </Button>
            ) : (
              <Button 
                type="button" 
                variant="facility" 
                onClick={handleFinalSubmit}
                className="ml-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Submitting...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/login/facility")}>
              Sign in here
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

export default FacilityRegistration;