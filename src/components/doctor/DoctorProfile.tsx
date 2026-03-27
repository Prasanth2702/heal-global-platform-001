// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { useToast } from '@/hooks/use-toast';
// import { User, Mail, Phone, Edit, Save, X, Camera, Shield, Home } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';
// import { User as SupabaseUser } from '@supabase/supabase-js';
// import { profile } from 'console';
// import { isValidPhoneNumber } from "@/utils/phoneValidation";
// import { useParams, useNavigate } from "react-router-dom";  // 🟢 ADDED
// import { mixpanelInstance } from '@/utils/mixpanel';
// import { Textarea } from '../ui/textarea';

// export type UserRole = 'medicalProfessional';

// export interface MedicalProfessional {
//   firstName: string;
//   lastName: string;
//   emailAddress: string;
//   phoneNumber: string;
//   medicalSpeciality: string;
//   licenseNumber: string;
//   graduationYear: number;
//   medicalSchool: string;
//   yearsOfExperience: number;
//   consultationFees: number;
//   additionalQualifications?: string;
//   aboutYourself?: string;
//   kycVerified: boolean;
//   languagesKnown: string;
//   avatarUrl?: string;
//   userType: UserRole;
//   country_code: string;
//   address: string;
//     city: string;
//     state: string;
//     pincode: string;
// }

// interface DoctorProfileProps {
//   onBack?: () => void;  
//   // 🟢 It remains optional
// }

// const DoctorProfile: React.FC<DoctorProfileProps> = ({ onBack }) => {
//  const { id } = useParams();  
//  const navigate = useNavigate();
//   // 🟢 ADDED — so the system knows which doctor to load when a patient opens /doctor/:id
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();
//   const [isEditing, setIsEditing] = useState(false);
//   const [user, setUser] = useState<SupabaseUser>(null);
//   const [profileData, setProfileData] = useState<MedicalProfessional>({
//     firstName: '',
//     lastName: '',
//     emailAddress: '',
//     phoneNumber: '',
//     medicalSpeciality: '',
//     licenseNumber: '',
//     graduationYear: new Date().getFullYear(),
//     medicalSchool: '',
//     yearsOfExperience: 0,
//     consultationFees: 0,
//     additionalQualifications: '',
//     aboutYourself: '',
//     kycVerified: false,
//     languagesKnown: '',
//     avatarUrl: '',
//     userType: 'medicalProfessional',
//       address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     country_code: '',
//   });
//  const [profileInfo, setProfileInfo] = useState<Record<string, any> | null>(null);
//   const [showOutdatedWarning, setShowOutdatedWarning] = useState(false);

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
// useEffect(() => {
//   const fetchProfile = async () => {
//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) {
//       console.error('Auth error:', authError?.message || 'User not found');
//       return;
//     }

//     setUser(user);

//     // profiles
//     const { data: profilesData, error: profilesDataError } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('user_id', user.id)
//       .single();

//     if (profilesDataError) {
//       console.error('Profile fetch error:', profilesDataError.message);
//       return;
//     }

//     // medical_professionals
//     const { data: medicalData, error: medicalDataError } = await supabase
//       .from('medical_professionals')
//       .select('*')
//       .eq('user_id', user.id)
//       .single();

//     if (medicalDataError) {
//       console.error('Medical profile fetch error:', medicalDataError.message);
//       return;
//     }

//     if (medicalData) {
//       setProfileInfo(medicalData);
// }
//       setProfileData({
//         firstName: profilesData.first_name || '',
//         lastName: profilesData.last_name || '',
//         emailAddress: profilesData.email || '',
//         phoneNumber: profilesData.phone_number || '',
//         avatarUrl: profilesData.avatar_url || '',
//         userType: profilesData.user_type || 'medicalProfessional',

//         medicalSpeciality: medicalData.medical_speciality || '',
//         licenseNumber: medicalData.license_number || '',
//         graduationYear: medicalData.graduation_year || new Date().getFullYear(),
//         medicalSchool: medicalData.medical_school || '',
//         yearsOfExperience: medicalData.years_of_experience || 0,
//         consultationFees: medicalData.consultation_fees || 0,
//         aboutYourself: medicalData.about_yourself || '',
//         kycVerified: medicalData.kyc_verified || false,
//         languagesKnown: medicalData.languages_known || '',

//         city: medicalData.city || '',
//         state: medicalData.state || '',
//         pincode: medicalData.pincode || '',
//         country_code: medicalData.country_code || '',
//         address: medicalData.address || '',
//       });
    

//     // ✅ outdated check
//     if (profilesData?.updated_at) {
//       const lastUpdated = new Date(profilesData.updated_at);
//       const sixMonthsAgo = new Date();
//       sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

//       if (lastUpdated < sixMonthsAgo) {
//         setShowOutdatedWarning(true);
//       }
//     }
//   };

//   // ✅ CALL FUNCTION HERE (outside)
//   fetchProfile();

// }, []);
// //   useEffect(() => {
// //     const fetchProfile = async () => {
// //       const {
// //         data: { user },
// //         error: authError,
// //       } = await supabase.auth.getUser();

// //       if (authError || !user) {
// //         console.error('Auth error:', authError?.message || 'User not found');
// //         return;
// //       }

// //       setUser(user);

// //       // Fetch profiles table data
// //       const { data: profilesData, error: profilesDataError } = await supabase
// //         .from('profiles')
// //         .select('*')
// //         .eq('user_id', user.id)
// //         .single();

// //       if (profilesDataError) {
// //         console.error('Profile fetch error:', profilesDataError.message);
// //         return;
// //       }

// //       // Fetch medical_professionals table data
// //       const { data: medicalData, error: medicalDataError } = await supabase
// //         .from('medical_professionals')
// //         .select('*')
// //         .eq('user_id', user.id)
// //         .single();

// //       if (medicalDataError) {
// //         console.error('Medical profile fetch error:', medicalDataError.message);
// //         return;
// //       }
// // if (medicalData) {
// //   setProfileInfo(medicalData);

// //   setProfileData({
// //     firstName: profilesData.first_name || '',
// //     lastName: profilesData.last_name || '',
// //     emailAddress: profilesData.email || '',
// //     phoneNumber: profilesData.phone_number || '',
// //     avatarUrl: profilesData.avatar_url || '',
// //     userType: profilesData.user_type || 'medicalProfessional',

// //     medicalSpeciality: medicalData?.medical_speciality || '',
// //     licenseNumber: medicalData?.license_number || '',
// //     graduationYear: medicalData?.graduation_year || new Date().getFullYear(),
// //     medicalSchool: medicalData?.medical_school || '',
// //     yearsOfExperience: medicalData?.years_of_experience || 0,
// //     consultationFees: medicalData?.consultation_fees || 0,
// //     aboutYourself: medicalData?.about_yourself || '',
// //     kycVerified: medicalData?.kyc_verified || false,
// //     languagesKnown: medicalData?.languages_known || '',

// //     city: medicalData?.city || '',
// //     state: medicalData?.state || '',
// //     pincode: medicalData?.pincode || '',
// //     country_code: medicalData?.country_code || '',
// //     address: medicalData?.address || '',
// //   });
// // }
// //     if (profilesData?.updated_at) {
// //   const lastUpdated = new Date(profilesData.updated_at);
// //   const sixMonthsAgo = new Date();
// //   sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

// //   if (lastUpdated < sixMonthsAgo) {
// //     setShowOutdatedWarning(true);
// //   }
// // }
// //     fetchProfile();
// //   }, []);
//   // -----------------------------
//   //  🔙 BACK BUTTON BEHAVIOR FIX
//   // -----------------------------
//   const handleBack = () => {
//     if (onBack) {
//       onBack(); // 🟡 Use existing parent behavior (doctor side)
//     } else {
//       navigate(-1);  
//       // 🟢 ADDED fallback for patient navigation
//       // So when patient opens /doctor/46 → Back will return to the search list
//     }
//   };
//   // Validation function customized for doctor profile
//   const validateForm = (formData: MedicalProfessional) => {
//     const errors: { [key: string]: string } = {};
//     let valid = true;

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
//       errors.emailAddress = 'Invalid email format';
//       valid = false;
//     }
//     if (!formData.phoneNumber) {
//       errors.phoneNumber = 'Phone number is required';
//       valid = false;
//     } else if (!isValidPhoneNumber(formData.phoneNumber)) {
//       errors.phoneNumber = 'Invalid phone number';
//       valid = false;
//     }
//     if (!formData.medicalSpeciality) {
//       errors.medicalSpeciality = 'Medical speciality is required';
//       valid = false;
//     }
//     if (!formData.licenseNumber) {
//       errors.licenseNumber = 'License number is required';
//       valid = false;
//     }
//     if (!formData.graduationYear || formData.graduationYear < 1900 || formData.graduationYear > new Date().getFullYear()) {
//       errors.graduationYear = 'Invalid graduation year';
//       valid = false;
//     }
//     if (!formData.medicalSchool) {
//       errors.medicalSchool = 'Medical school is required';
//       valid = false;
//     }
//     if (formData.yearsOfExperience < 0) {
//       errors.yearsOfExperience = 'Years of experience cannot be negative';
//       valid = false;
//     }
//     if (formData.consultationFees < 0) {
//       errors.consultationFees = 'Consultation fees cannot be negative';
//       valid = false;
//     }
//     if (!formData.languagesKnown) {
//       errors.languagesKnown = 'Please specify languages known';
//       valid = false;
//     }

//     setErrors(errors);

//     const firstErrorKey = Object.keys(errors)[0];
//     if (firstErrorKey) {
//       toast({
//         title: 'Validation Error',
//         description: errors[firstErrorKey],
//         variant: 'destructive',
//         className: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0',
//       });
//     }
//     return valid;
//   };

//   const handleSave = async () => {
//     if (!validateForm(profileData)) return;
//     if (!user) return;

//     mixpanelInstance.track("Doctor Profile Update", {
//       userId: user.id,
//       email: profileData.emailAddress,
//       specialty: profileData.medicalSpeciality,
//       license: profileData.licenseNumber,
//       kycVerified: profileData.kycVerified
//     });

//     const profilesUpdate = {
//       user_id: user.id,
//       first_name: profileData.firstName,
//       last_name: profileData.lastName,
//       email: profileData.emailAddress,
//       phone_number: profileData.phoneNumber,
//       avatar_url: profileData.avatarUrl,
//     };

//     const medicalProfessionalsUpdate = {
//       user_id: user.id,
//       medical_speciality: profileData.medicalSpeciality,
//       license_number: profileData.licenseNumber,
//       graduation_year: profileData.graduationYear,
//       medical_school: profileData.medicalSchool,
//       years_experience: profileData.yearsOfExperience,
//       consultation_fee: profileData.consultationFees,
//       about_yourself: profileData.aboutYourself,
//       is_verified: profileData.kycVerified,
//       languages_known: profileData.languagesKnown,
//       address: profileData.address,
//       city: profileData.city,
//       state: profileData.state,
//       pincode: profileData.pincode,
//     };

//     console.log("before upating row: " + profileData);
//     const { error: profilesUpdateError } = await supabase
//       .from('profiles')
//       .upsert(profilesUpdate, { onConflict: 'user_id' });

//     const { error: medicalUpdateError } = await supabase
//       .from('medical_professionals')
//       .upsert(medicalProfessionalsUpdate, { onConflict: 'user_id' });

//     if (profilesUpdateError || medicalUpdateError) {
//       toast({
//         title: 'Update Failed',
//         description: profilesUpdateError?.message || medicalUpdateError?.message,
//         className: 'bg-red-500 text-white',
//       });
//     } else {
//       toast({
//         title: 'Profile Updated',
//         description: 'Your profile has been successfully updated.',
//         className: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0',
//       });
//       setIsEditing(false);
//       setErrors({});
//     }
//   };

//   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const filePath = `profile_images/${Date.now()}_${file.name}`;

//     const { data: uploadData, error: uploadError } = await supabase.storage
//       .from('heal_med_app_images_bucket')
//       .upload(filePath, file);

//     if (uploadError) {
//       toast({
//         title: 'Upload Failed',
//         description: 'Failed to upload profile picture. Please try again.',
//       });
//       return;
//     }

//     const { data: urlData } = supabase.storage
//       .from('heal_med_app_images_bucket')
//       .getPublicUrl(filePath);

//     const publicUrl = urlData.publicUrl;

//     const { error: updateError } = await supabase
//       .from('profiles')
//       .update({ avatar_url: publicUrl })
//       .eq('user_id', user?.id);

//     if (updateError) {
//       toast({
//         title: 'Profile Update Failed',
//         description: 'Failed to update profile picture URL. Please try again.',
//       });
//       return;
//     }

//     setProfileData(prev => ({ ...prev, avatarUrl: publicUrl }));
//     toast({
//       title: 'Profile Picture Updated',
//       description: 'Your profile picture has been updated.',
//       className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0',
//     });
//   };

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <Button
//             variant="outline"
//            onClick={handleBack}   // 🟡 CHANGED — now uses new function
//             className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
//           >
//             <X className="h-4 w-4" />
//             <span>Back</span>
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               My Profile
//             </h1>
//             <p className="text-muted-foreground">Manage your professional information</p>
//           </div>
//         </div>

//         <Button
//           onClick={isEditing ? handleSave : () => setIsEditing(true)}
//           className={`${isEditing
//               ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
//               : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
//             } text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
//         >
//           {isEditing ? (
//             <>
//               <Save className="h-4 w-4 mr-2" />
//               Save Changes
//             </>
//           ) : (
//             <>
//               <Edit className="h-4 w-4 mr-2" />
//               Edit Profile
//             </>
//           )}
//         </Button>
//       </div>

//       {/* Profile Picture and Basic Info */}
//       <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
//         <CardContent className="p-8">
//           <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
//             <div className="relative">
//               <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
//                 <AvatarImage src={profileData.avatarUrl} />
//                 <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
//                   {(profileData.firstName?.[0] || profileData.lastName?.[0] || '')}
//                 </AvatarFallback>
//               </Avatar>
//               {isEditing && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="absolute inset-0 opacity-0 cursor-pointer"
//                   />
//                   <Camera className="h-8 w-8 text-white" />
//                 </div>
//               )}
//             </div>

//             <div className="flex-1 text-center md:text-left">
//               <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 {profileData.firstName} {profileData.lastName}
//               </h2>
//               <p className="text-lg text-muted-foreground mb-4">{profileData.emailAddress}</p>

//               <div className="flex flex-wrap gap-2 justify-center md:justify-start">
//                 <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
//                   <Shield className="h-3 w-3 mr-1" />
//                   {profileData.kycVerified ? 'KYC Verified' : 'KYC Not Verified'}
//                 </Badge>
//                 <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0">
//                   {profileData.medicalSpeciality}
//                 </Badge>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//       <Card className="border-0 shadow-lg">
//         <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
//           <CardTitle className="flex items-center text-xl">
//             <User className="h-5 w-5 mr-2" />
//             Personal details
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <Label htmlFor="firstname" className="text-sm font-semibold text-gray-700">
//                 First Name
//               </Label>
//               {isEditing ? (
//                 <Input
//                   id="firstname"
//                   value={profileData.firstName}
//                   onChange={e => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.firstName}</p>
//               )}
//             </div>
//             <div>
//               <Label htmlFor="lastname" className="text-sm font-semibold text-gray-700">
//                 Last Name
//               </Label>
//               {isEditing ? (
//                 <Input
//                   id="lastname"
//                   value={profileData.lastName}
//                   onChange={e => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.lastName}</p>
//               )}
//             </div>
//           </div>
//           <div>
//             <div>
//               <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
//                 Email
//               </Label>
//               <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.emailAddress}</p>
//             </div>
//             <div>
//               <Label htmlFor="phonenumber" className="text-sm font-semibold text-gray-700">
//                 Phone Number
//               </Label>
//               {isEditing ? (
//                 <Input
//                   id="phonenumber"
//                   value={profileData.phoneNumber}
//                   onChange={e => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.phoneNumber}</p>
//               )}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card className="border-0 shadow-lg">
//   <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
//     <CardTitle className="flex items-center text-xl">
//       <Home className="h-5 w-5 mr-2" />
//       Address Details
//     </CardTitle>
//   </CardHeader>
//   <CardContent className="p-6 space-y-6">
//     <div>
//       <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
//         Address
//       </Label>
//       {isEditing ? (
//         <Textarea
//           id="address"
//           value={profileData.address}
//           onChange={e => setProfileData(prev => ({ ...prev, address: e.target.value }))}
//           className="mt-2 border-2 focus:border-blue-500 transition-colors"
//           rows={3}
//         />
//       ) : (
//         <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.address}</p>
//       )}
//     </div>
    
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div>
//         <Label htmlFor="country" className="text-sm font-semibold text-gray-700">
//           Country
//         </Label>
//         {isEditing ? (
//           <Input
//             id="country"
//             value={profileData.country_code}
//             onChange={e => setProfileData(prev => ({ ...prev, country_code: e.target.value }))}
//             className="mt-2 border-2 focus:border-blue-500 transition-colors"
//           />
//         ) : (
//           <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.country_code}</p>
//         )}
//       </div>
      
//       <div>
//         <Label htmlFor="state" className="text-sm font-semibold text-gray-700">
//           State
//         </Label>
//         {isEditing ? (
//           <Input
//             id="state"
//             value={profileData.state}
//             onChange={e => setProfileData(prev => ({ ...prev, state: e.target.value }))}
//             className="mt-2 border-2 focus:border-blue-500 transition-colors"
//           />
//         ) : (
//           <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.state}</p>
//         )}
//       </div>
//     </div>
    
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <div>
//         <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
//           City
//         </Label>
//         {isEditing ? (
//           <Input
//             id="city"
//             value={profileData.city}
//             onChange={e => setProfileData(prev => ({ ...prev, city: e.target.value }))}
//             className="mt-2 border-2 focus:border-blue-500 transition-colors"
//           />
//         ) : (
//           <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.city}</p>
//         )}
//       </div>
      
//       <div>
//         <Label htmlFor="pincode" className="text-sm font-semibold text-gray-700">
//           Pincode
//         </Label>
//         {isEditing ? (
//           <Input
//             id="pincode"
//             value={profileData.pincode}
//             onChange={e => setProfileData(prev => ({ ...prev, pincode: e.target.value }))}
//             className="mt-2 border-2 focus:border-blue-500 transition-colors"
//           />
//         ) : (
//           <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.pincode}</p>
//         )}
//       </div>
//     </div>
//   </CardContent>
// </Card>

//       {/* Professional Information */}
//       <Card className="border-0 shadow-lg">
//         <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
//           <CardTitle className="flex items-center text-xl">
//             <User className="h-5 w-5 mr-2" />
//             Professional Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <Label htmlFor="medicalSpeciality" className="text-sm font-semibold text-gray-700">
//                 Medical Speciality
//               </Label>
//               {isEditing ? (
//                 <Input
//                   id="medicalSpeciality"
//                   value={profileData.medicalSpeciality}
//                   onChange={e => setProfileData(prev => ({ ...prev, medicalSpeciality: e.target.value }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.medicalSpeciality}</p>
//               )}
//             </div>
//             <div>
//               <Label htmlFor="licenseNumber" className="text-sm font-semibold text-gray-700">
//                 License Number
//               </Label>
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.licenseNumber}</p>
//             </div>

//             <div>
//               <Label htmlFor="graduationYear" className="text-sm font-semibold text-gray-700">
//                 Graduation Year
//               </Label>
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.graduationYear}</p>
//             </div>

//             <div>
//               <Label htmlFor="medicalSchool" className="text-sm font-semibold text-gray-700">
//                 Medical School
//               </Label>
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.medicalSchool}</p>
//             </div>

//             <div>
//               <Label htmlFor="yearsOfExperience" className="text-sm font-semibold text-gray-700">
//                 Years of Experience
//               </Label>
//               {isEditing ? (
//                 <Input
//                   id="yearsOfExperience"
//                   type="number"
//                   value={profileData.yearsOfExperience}
//                   onChange={e => setProfileData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value, 10) || 0 }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.yearsOfExperience}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="consultationFees" className="text-sm font-semibold text-gray-700">
//                 Consultation Fees
//               </Label>
//               {isEditing ? (
//                 <Input
//                   id="consultationFees"
//                   type="number"
//                   value={profileData.consultationFees}
//                   onChange={e => setProfileData(prev => ({ ...prev, consultationFees: parseFloat(e.target.value) || 0 }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">${profileData.consultationFees}</p>
//               )}
//             </div>

//             <div className="md:col-span-2">
//               <Label htmlFor="additionalQualifications" className="text-sm font-semibold text-gray-700">
//                 Additional Qualifications
//               </Label>
//               {isEditing ? (
//                 <Input
//                   id="additionalQualifications"
//                   value={profileData.additionalQualifications || ''}
//                   onChange={e => setProfileData(prev => ({ ...prev, additionalQualifications: e.target.value }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.additionalQualifications || 'N/A'}</p>
//               )}
//             </div>

//             <div className="md:col-span-2">
//               <Label htmlFor="aboutYourself" className="text-sm font-semibold text-gray-700">
//                 About Yourself
//               </Label>
//               {isEditing ? (
//                 <textarea
//                   id="aboutYourself"
//                   value={profileData.aboutYourself || ''}
//                   onChange={e => setProfileData(prev => ({ ...prev, aboutYourself: e.target.value }))}
//                   className="mt-2 w-full p-3 border-2 rounded-lg focus:border-blue-500 transition-colors"
//                   rows={4}
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium whitespace-pre-wrap">{profileData.aboutYourself || 'N/A'}</p>
//               )}
//             </div>

//             <div className="md:col-span-2">
//               <Label htmlFor="languagesKnown" className="text-sm font-semibold text-gray-700">
//                 Languages Known
//               </Label>
//               {isEditing ? (
//                 <Input
//                   id="languagesKnown"
//                   value={profileData.languagesKnown}
//                   onChange={e => setProfileData(prev => ({ ...prev, languagesKnown: e.target.value }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                   placeholder="e.g. English, Spanish, French"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.languagesKnown}</p>
//               )}
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default DoctorProfile;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Edit, Save, X, Camera, Shield, Home, Loader2, Trash2, Download, Eye, FileText, Upload, File } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { isValidPhoneNumber } from "@/utils/phoneValidation";
import { useParams, useNavigate } from "react-router-dom";
import { mixpanelInstance } from '@/utils/mixpanel';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

export type UserRole = 'medicalProfessional';

export interface MedicalProfessional {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  medicalSpeciality: string;
  licenseNumber: string;
  graduationYear: number;
  medicalSchool: string;
  yearsOfExperience: number;
  consultationFees: number;
  additionalQualifications?: string;
  aboutYourself?: string;
  kycVerified: boolean;
  languagesKnown: string;
  avatarUrl?: string;
  userType: UserRole;
  country_code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  
  documentUrl?: string; // Add this for PDF documents
  documentName?: string; // Store the original filename
}

interface UploadedDocument {
  name: string;
  type: 'patient' | 'doctor' | 'facility';
  userId?: string;
  url?: string;
  path?: string;
  uploadedAt?: Date;
}

interface DoctorProfileProps {
  onBack?: () => void;
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ onBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profileData, setProfileData] = useState<MedicalProfessional>({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    medicalSpeciality: '',
    licenseNumber: '',
    graduationYear: new Date().getFullYear(),
    medicalSchool: '',
    yearsOfExperience: 0,
    consultationFees: 0,
    additionalQualifications: '',
    aboutYourself: '',
    kycVerified: false,
    languagesKnown: '',
    avatarUrl: '',
    userType: 'medicalProfessional',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country_code: '',
    documentUrl: '',
    documentName: '',
  });
  const [showOutdatedWarning, setShowOutdatedWarning] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
 const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<{ url: string; name: string } | null>(null);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState<string | null>(null);
 const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !currentUser) {
          console.error('Auth error:', authError?.message || 'User not found');
          toast({
            title: 'Authentication Error',
            description: 'Please log in to view your profile.',
            variant: 'destructive',
          });
          return;
        }

        setUser(currentUser);

        // Fetch profiles table data
        const { data: profilesData, error: profilesDataError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

        if (profilesDataError) {
          console.error('Profile fetch error:', profilesDataError.message);
          toast({
            title: 'Error',
            description: 'Failed to load profile data.',
            variant: 'destructive',
          });
          return;
        }

        // Fetch medical_professionals table data
        const { data: medicalData, error: medicalDataError } = await supabase
          .from('medical_professionals')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

        if (medicalDataError && medicalDataError.code !== 'PGRST116') { // PGRST116 means no rows returned
          console.error('Medical profile fetch error:', medicalDataError.message);
        }

        // Set profile data
        setProfileData({
          firstName: profilesData.first_name || '',
          lastName: profilesData.last_name || '',
          emailAddress: profilesData.email || '',
          phoneNumber: profilesData.phone_number || '',
          avatarUrl: profilesData.avatar_url || '',
          userType: profilesData.user_type || 'medicalProfessional',
          
          // Medical professional fields
          medicalSpeciality: medicalData?.medical_speciality || '',
          licenseNumber: medicalData?.license_number || '',
          graduationYear: medicalData?.graduation_year || new Date().getFullYear(),
          medicalSchool: medicalData?.medical_school || '',
          yearsOfExperience: medicalData?.years_experience || 0,
          consultationFees: medicalData?.consultation_fee || 0,
          aboutYourself: medicalData?.about_yourself || '',
          kycVerified: medicalData?.kyc_verified || false,
          languagesKnown: medicalData?.languages_known || '',
          
          // Address fields
          city: medicalData?.city || '',
          state: medicalData?.state || '',
          pincode: medicalData?.pincode || '',
          country_code: medicalData?.country_code || '',
          address: medicalData?.address || '',
        });

        // Check for outdated profile
        if (profilesData?.updated_at) {
          const lastUpdated = new Date(profilesData.updated_at);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

          if (lastUpdated < sixMonthsAgo) {
            setShowOutdatedWarning(true);
          }
        }
          await fetchUserDocuments(currentUser.id);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);
  const fetchUserDocuments = async (userId: string) => {
    setLoadingDocs(true);
    try {
      const { data: files, error } = await supabase.storage
        .from('heal_med_app_files_bucket')
        .list(`medical_documents/${userId}`, {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });
  
      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }
  
      if (files && files.length > 0) {
        const docs: UploadedDocument[] = await Promise.all(
          files.map(async (file) => {
            // Get signed URL for each file
            const { data: signedUrlData } = await supabase.storage
              .from('heal_med_app_files_bucket')
              .createSignedUrl(`medical_documents/${userId}/${file.name}`, 3600); // 1 hour expiry
            
            return {
              name: file.name,
              type: 'doctor',
              userId: userId,
              url: signedUrlData?.signedUrl || '',
              path: `medical_documents/${userId}/${file.name}`,
              uploadedAt: new Date(file.created_at)
            };
          })
        );
        setUploadedDocs(docs);
      }
    } catch (error) {
      console.error('Error in fetchUserDocuments:', error);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Validation function customized for doctor profile
  const validateForm = (formData: MedicalProfessional) => {
    const errors: { [key: string]: string } = {};
    let valid = true;

    if (!formData.emailAddress) {
      errors.emailAddress = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      errors.emailAddress = 'Invalid email format';
      valid = false;
    }
    
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
      valid = false;
    } else if (!isValidPhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = 'Invalid phone number';
      valid = false;
    }
    
    if (!formData.medicalSpeciality) {
      errors.medicalSpeciality = 'Medical speciality is required';
      valid = false;
    }
    
    if (!formData.licenseNumber) {
      errors.licenseNumber = 'License number is required';
      valid = false;
    }
    
    // if (!formData.graduationYear || formData.graduationYear < 1900 || formData.graduationYear > new Date().getFullYear()) {
    //   errors.graduationYear = 'Invalid graduation year';
    //   valid = false;
    // }
    
    if (!formData.medicalSchool) {
      errors.medicalSchool = 'Medical school is required';
      valid = false;
    }
    
    if (formData.yearsOfExperience < 0) {
      errors.yearsOfExperience = 'Years of experience cannot be negative';
      valid = false;
    }
    
    if (formData.consultationFees < 0) {
      errors.consultationFees = 'Consultation fees cannot be negative';
      valid = false;
    }
    
    if (!formData.languagesKnown) {
      errors.languagesKnown = 'Please specify languages known';
      valid = false;
    }

    setErrors(errors);

    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      toast({
        title: 'Validation Error',
        description: errors[firstErrorKey],
        variant: 'destructive',
        className: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0',
      });
    }
    return valid;
  };

  const handleSave = async () => {
    if (!validateForm(profileData)) return;
    if (!user) return;

    try {
      mixpanelInstance.track("Doctor Profile Update", {
        userId: user.id,
        email: profileData.emailAddress,
        specialty: profileData.medicalSpeciality,
        license: profileData.licenseNumber,
        kycVerified: profileData.kycVerified
      });

      const profilesUpdate = {
        user_id: user.id,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.emailAddress,
        phone_number: profileData.phoneNumber,
        avatar_url: profileData.avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const medicalProfessionalsUpdate = {
        user_id: user.id,
        medical_speciality: profileData.medicalSpeciality,
        license_number: profileData.licenseNumber,
        graduation_year: profileData.graduationYear,
        medical_school: profileData.medicalSchool,
        years_experience: profileData.yearsOfExperience,
        consultation_fee: profileData.consultationFees,
        about_yourself: profileData.aboutYourself,
        // kyc_verified: profileData.kycVerified || false,
        languages_known: profileData.languagesKnown,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        pincode: profileData.pincode,
        country_code: profileData.country_code,
      };

      const { error: profilesUpdateError } = await supabase
        .from('profiles')
        .upsert(profilesUpdate, { onConflict: 'user_id' });

      if (profilesUpdateError) {
        throw new Error(profilesUpdateError.message);
      }

      const { error: medicalUpdateError } = await supabase
        .from('medical_professionals')
        .upsert(medicalProfessionalsUpdate, { onConflict: 'user_id' });

      if (medicalUpdateError) {
        throw new Error(medicalUpdateError.message);
      }

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        className: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0',
      });
      
      setIsEditing(false);
      setErrors({});
      setShowOutdatedWarning(false);
      
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
        className: 'bg-red-500 text-white',
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const filePath = `profile_images/${user.id}/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('heal_med_app_images_bucket')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: urlData } = supabase.storage
        .from('heal_med_app_images_bucket')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setProfileData(prev => ({ ...prev, avatarUrl: publicUrl }));
      
      toast({
        title: 'Profile Picture Updated',
        description: 'Your profile picture has been updated.',
        className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0',
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload profile picture',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="animate-pulse">Loading profile...</div>
      </div>
    );
  }

   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;
      if (!user) {
        toast({
          title: "User not found",
          description: "Please login again",
          variant: "destructive"
        });
        return;
      }
  
      setUploading(true);
  
      for (let file of files) {
        const filePath = `medical_documents/${user.id}/${Date.now()}_${file.name}`;
  
        const { error } = await supabase
          .storage
          .from('heal_med_app_files_bucket')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
  
        if (error) {
          toast({
            title: "Upload Failed",
            description: error.message,
            variant: "destructive"
          });
          setUploading(false);
          return;
        } 
        else {
          const { data: urlData } = supabase.storage
            .from('heal_med_app_files_bucket')
            .getPublicUrl(filePath);
  
          setUploadedDocs(prev => [
            ...prev,
            {
              name: file.name,
              type: 'facility',
              userId: user.id,
              url: urlData.publicUrl,
              path: filePath,
              uploadedAt: new Date()
            }
          ]);
  
          toast({
            title: "Document Uploaded",
            description: `${file.name} uploaded successfully.`,
          });
        }
      }
  
      setUploading(false);
      event.target.value = '';
    };
  
  const handleDeleteDocument = async (doc: UploadedDocument) => {
      if (!doc.path) return;
      
      setDeletingDoc(doc.name);
      try {
        const { error } = await supabase.storage
          .from('heal_med_app_files_bucket')
          .remove([doc.path]);
  
        if (error) {
          throw error;
        }
  
        setUploadedDocs(prev => prev.filter(d => d.name !== doc.name));
        toast({
          title: "Document Deleted",
          description: `${doc.name} has been removed successfully.`,
        });
      } catch (error: any) {
        toast({
          title: "Delete Failed",
          description: error.message || "Failed to delete document",
          variant: "destructive"
        });
      } finally {
        setDeletingDoc(null);
      }
    };
  
    const viewPdf = (url: string, name: string) => {
      setSelectedPdf({ url, name });
    };
  
    const DocumentBadge = ({ doc }: { doc: UploadedDocument }) => {
      const isPDF = doc.name.toLowerCase().endsWith('.pdf');
    return (
        <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className={`p-2 rounded-lg ${isPDF ? 'bg-red-50' : 'bg-blue-50'}`}>
                <FileText className={`h-5 w-5 ${isPDF ? 'text-red-500' : 'text-blue-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">    {doc.name.length > 10 ? `${doc.name.slice(0, 10)}...` : doc.name}</p>
                <p className="text-xs text-gray-500">
                  {doc.uploadedAt?.toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {isPDF && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => viewPdf(doc.url!, doc.name)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(doc.url, '_blank')}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
              {isEditing && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteDocument(doc)}
                  disabled={deletingDoc === doc.name}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  {deletingDoc === doc.name ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>

          </div>
        </div>
      );
    };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Outdated Warning */}
      {showOutdatedWarning && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your profile information is over 6 months old. Please review and update your details.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
          >
            <X className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-muted-foreground">Manage your professional information</p>
          </div>
        </div>

        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`${
            isEditing
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
          } text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Rest of your JSX remains the same... */}
      {/* Profile Picture and Basic Info Card */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                <AvatarImage src={profileData.avatarUrl} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {(profileData.firstName?.[0] || profileData.lastName?.[0] || 'U').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer hover:bg-black/60 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Camera className="h-8 w-8 text-white" />
                </label>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-lg text-muted-foreground mb-4">{profileData.emailAddress}</p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge className={`${
                  profileData.kycVerified 
                    ? 'bg-gradient-to-r from-green-500 to-teal-500' 
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                } text-white border-0`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {profileData.kycVerified ? 'KYC Verified' : 'KYC Not Verified'}
                </Badge>
                {profileData.medicalSpeciality && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                    {profileData.medicalSpeciality}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-sm font-semibold text-gray-700">
                Doctor Documents
              </Label>
              {isEditing && (
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    disabled={uploading}
                  />
                  <Button variant="outline" size="sm" disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </Button>
                </div>
              )}
            </div>

            {loadingDocs ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : uploadedDocs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {uploadedDocs.map((doc, index) => (
                  <DocumentBadge key={index} doc={doc} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No documents uploaded yet</p>
                {isEditing && (
                  <p className="text-sm mt-1">Upload facility license, registration, or other official documents</p>
                )}
              </div>
            )}
            </div>
        </CardContent>
      </Card>
        <Dialog open={!!selectedPdf} onOpenChange={() => setSelectedPdf(null)}>
        <DialogContent className={cn(
          "p-0 overflow-hidden",
          "sm:max-w-5xl sm:w-[90vw] sm:h-[90vh]",
          "max-w-full w-full h-full sm:rounded-lg rounded-none"
        )}>
          {/* Simplified Header - removed description */}
          <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-2 border-b">
            <DialogTitle className="truncate text-sm sm:text-base md:text-lg font-semibold">
              {selectedPdf?.name}
            </DialogTitle>
            {/* <DialogClose asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose> */}
          </div>
          
          {/* PDF Viewer - Full height */}
          <div className="flex-1 min-h-0 overflow-auto">
            {selectedPdf && (
              <iframe
                src={`${selectedPdf.url}#navpanes=0&scrollbar=1&toolbar=1`}
                className="w-full h-full"
                title="PDF Viewer"
                style={{ 
                  border: 'none',
                  minHeight: 'calc(100vh - 120px)'
                }}
              />
            )}
          </div>
          
          {/* Action Buttons - Simplified */}
          <div className="flex justify-end gap-2 px-4 sm:px-6 pb-4 sm:pb-6 pt-3 border-t">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Close
              </Button>
            </DialogClose>
            <Button
              onClick={() => window.open(selectedPdf?.url, '_blank')}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            >
              <File className="h-4 w-4 mr-2" />
              View Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
<Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardTitle className="flex items-center text-xl">
            <User className="h-5 w-5 mr-2" />
            Personal details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstname" className="text-sm font-semibold text-gray-700">
                First Name
              </Label>
              {isEditing ? (
                <Input
                  id="firstname"
                  value={profileData.firstName}
                  onChange={e => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.firstName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastname" className="text-sm font-semibold text-gray-700">
                Last Name
              </Label>
              {isEditing ? (
                <Input
                  id="lastname"
                  value={profileData.lastName}
                  onChange={e => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.lastName}</p>
              )}
            </div>
          </div>
          <div>
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email
              </Label>
              <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.emailAddress}</p>
            </div>
            <div>
              <Label htmlFor="phonenumber" className="text-sm font-semibold text-gray-700">
                Phone Number
              </Label>
              {isEditing ? (
                <Input
                  id="phonenumber"
                  value={profileData.phoneNumber}
                  onChange={e => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.phoneNumber}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
  <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
    <CardTitle className="flex items-center text-xl">
      <Home className="h-5 w-5 mr-2" />
      Address Details
    </CardTitle>
  </CardHeader>
  <CardContent className="p-6 space-y-6">
    <div>
      <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
        Address
      </Label>
      {isEditing ? (
        <Textarea
          id="address"
          value={profileData.address}
          onChange={e => setProfileData(prev => ({ ...prev, address: e.target.value }))}
          className="mt-2 border-2 focus:border-blue-500 transition-colors"
          rows={3}
        />
      ) : (
        <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.address}</p>
      )}
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="country" className="text-sm font-semibold text-gray-700">
          Country
        </Label>
        {isEditing ? (
          <Input
            id="country"
            value={profileData.country_code}
            onChange={e => setProfileData(prev => ({ ...prev, country_code: e.target.value }))}
            className="mt-2 border-2 focus:border-blue-500 transition-colors"
          />
        ) : (
          <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.country_code}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="state" className="text-sm font-semibold text-gray-700">
          State
        </Label>
        {isEditing ? (
          <Input
            id="state"
            value={profileData.state}
            onChange={e => setProfileData(prev => ({ ...prev, state: e.target.value }))}
            className="mt-2 border-2 focus:border-blue-500 transition-colors"
          />
        ) : (
          <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.state}</p>
        )}
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
          City
        </Label>
        {isEditing ? (
          <Input
            id="city"
            value={profileData.city}
            onChange={e => setProfileData(prev => ({ ...prev, city: e.target.value }))}
            className="mt-2 border-2 focus:border-blue-500 transition-colors"
          />
        ) : (
          <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.city}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="pincode" className="text-sm font-semibold text-gray-700">
          Pincode
        </Label>
        {isEditing ? (
          <Input
            id="pincode"
            value={profileData.pincode}
            onChange={e => setProfileData(prev => ({ ...prev, pincode: e.target.value }))}
            className="mt-2 border-2 focus:border-blue-500 transition-colors"
          />
        ) : (
          <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.pincode}</p>
        )}
      </div>
    </div>
  </CardContent>
</Card>

      {/* Professional Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardTitle className="flex items-center text-xl">
            <User className="h-5 w-5 mr-2" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="medicalSpeciality" className="text-sm font-semibold text-gray-700">
                Medical Speciality
              </Label>
              {isEditing ? (
                <Input
                  id="medicalSpeciality"
                  value={profileData.medicalSpeciality}
                  onChange={e => setProfileData(prev => ({ ...prev, medicalSpeciality: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.medicalSpeciality}</p>
              )}
            </div>
            <div>
              <Label htmlFor="licenseNumber" className="text-sm font-semibold text-gray-700">
                License Number
              </Label>
              {isEditing ? (
                <Input
                  id="licenseNumber"
                  value={profileData.licenseNumber}
                  onChange={e => setProfileData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.licenseNumber}</p>
              )}
                {/* <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.licenseNumber}</p> */}
            </div>

            <div>
              <Label htmlFor="graduationYear" className="text-sm font-semibold text-gray-700">
                Graduation Year
              </Label>
              {isEditing ? (
              <Input
  id="graduationYear"
  type="number"
  value={profileData.graduationYear}
  onChange={e => setProfileData(prev => ({ 
    ...prev, 
    graduationYear: parseInt(e.target.value, 10) || 0
  }))}
  className="mt-2 border-2 focus:border-blue-500 transition-colors"
/>
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.graduationYear}</p>
              )}
                {/* <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.graduationYear}</p> */}
            </div>

            <div>
              <Label htmlFor="medicalSchool" className="text-sm font-semibold text-gray-700">
                Medical School
              </Label>
              {isEditing ? (
                <Input
                  id="medicalSchool"
                  value={profileData.medicalSchool}
                  onChange={e => setProfileData(prev => ({ ...prev, medicalSchool: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.medicalSchool}</p>
              )}
                {/* <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.medicalSchool}</p> */}
            </div>

            <div>
              <Label htmlFor="yearsOfExperience" className="text-sm font-semibold text-gray-700">
                Years of Experience
              </Label>
              {isEditing ? (
                <Input
                  id="yearsOfExperience"
                  type="number"
                  value={profileData.yearsOfExperience}
                  onChange={e => setProfileData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value, 10) || 0 }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.yearsOfExperience}</p>
              )}
            </div>

            <div>
              <Label htmlFor="consultationFees" className="text-sm font-semibold text-gray-700">
                Consultation Fees
              </Label>
              {isEditing ? (
                <Input
                  id="consultationFees"
                  type="number"
                  value={profileData.consultationFees}
                  onChange={e => setProfileData(prev => ({ ...prev, consultationFees: parseFloat(e.target.value) || 0 }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">${profileData.consultationFees}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="additionalQualifications" className="text-sm font-semibold text-gray-700">
                Additional Qualifications
              </Label>
              {isEditing ? (
                <Input
                  id="additionalQualifications"
                  value={profileData.additionalQualifications || ''}
                  onChange={e => setProfileData(prev => ({ ...prev, additionalQualifications: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.additionalQualifications || 'N/A'}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="aboutYourself" className="text-sm font-semibold text-gray-700">
                About Yourself
              </Label>
              {isEditing ? (
                <textarea
                  id="aboutYourself"
                  value={profileData.aboutYourself || ''}
                  onChange={e => setProfileData(prev => ({ ...prev, aboutYourself: e.target.value }))}
                  className="mt-2 w-full p-3 border-2 rounded-lg focus:border-blue-500 transition-colors"
                  rows={4}
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium whitespace-pre-wrap">{profileData.aboutYourself || 'N/A'}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="languagesKnown" className="text-sm font-semibold text-gray-700">
                Languages Known
              </Label>
              {isEditing ? (
                <Input
                  id="languagesKnown"
                  value={profileData.languagesKnown}
                  onChange={e => setProfileData(prev => ({ ...prev, languagesKnown: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                  placeholder="e.g. English, Spanish, French"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.languagesKnown}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Continue with the rest of your cards... */}
      {/* Personal details, Address details, Professional information cards remain the same */}
    </div>
  );
};

export default DoctorProfile;