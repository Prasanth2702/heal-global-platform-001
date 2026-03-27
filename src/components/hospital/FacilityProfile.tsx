// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { useToast } from '@/hooks/use-toast';
// import { X, Edit, Save, Phone, Mail, MapPin, Camera } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';
// import { User as SupabaseUser } from '@supabase/supabase-js';
// import { dataTagSymbol } from '@tanstack/react-query';
// import { isValidPhoneNumber } from "@/utils/phoneValidation";
// import mixpanelInstance from "@/utils/mixpanel";
// export interface MedicalFacility {
//   facilityName: string;
//   emailAddress: string;
//   facilityType: string;
//   phoneNumber: string;
//   address: string;
//   city: string;
//   state: string;
//   pincode: string;
//   latitude: number;
//   longitude: number;
//   licenseNumber: string;
//   establishedYear: number;
//   totalBeds: number;
//   departments: string[];
//   emergencyServices: boolean;
//   ambulanceService: boolean;
//   onlineConsultation: boolean;
//   homeVisit: boolean;
//   insurancePartners: string;
//   operatingHours: string;
//   website: string;
//   aboutFacility: string;
//   avatarUrl?: string;
// }



// const FacilityProfile: React.FC = () => {
//   const { toast } = useToast();
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState<MedicalFacility>({
//     facilityName: '',
//     emailAddress: '',
//     facilityType: '',
//     phoneNumber: '',
//     address: '',
//     city: '',
//     state: '',
//     pincode: '',
//     latitude: 0,
//     longitude: 0,
//     licenseNumber: '',
//     establishedYear: new Date().getFullYear(),
//     totalBeds: 0,
//     departments: [],
//     emergencyServices: false,
//     ambulanceService: false,
//     onlineConsultation: false,
//     homeVisit: false,
//     insurancePartners: '',
//     operatingHours: '',
//     website: '',
//     aboutFacility: '',
//     avatarUrl: ''
//   });
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [user, setUser] = useState<SupabaseUser>(null);

//   useEffect(() => {

//     async function fetchFacilityProfile() {

//       const {
//         data: { user },
//         error: authError,
//       } = await supabase.auth.getUser();

//       if (authError || !user) {
//         console.error('Auth error:', authError?.message || 'User not found');
//         return;
//       }

//       setUser(user);

//       console.log(user.id+"userOd_");

//       const { data: profilesData, error: profilesDataError } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('user_id', user.id)
//         .single();

//       if (profilesDataError) {
//         console.error('Profile fetch error:', profilesDataError.message);
//         return;
//       }

//       const facilityId = user.id;

//       const { data: facilitiesData, error: facilitiesDataError } = await supabase
//         .from('facilities')
//         .select('*')
//         .eq('admin_user_id', facilityId)
//         .single();

//       if (facilitiesDataError) {
//         toast({
//           title: 'Error loading facility data',
//           description: facilitiesDataError.message,
//           variant: 'destructive'
//         });
//         return;
//       }
//       if (profilesData) {
//         setProfileData(prev => ({
//           ...prev,
//           facilityName: profilesData.first_name || '',
//           emailAddress: profilesData.email || '',
//           phoneNumber: profilesData.phone_number || '',
//           avatarUrl: profilesData?.avatar_url || ''
//         }));
//       }

//       console.log("pp"+profilesData);
//       console.log("ff"+facilitiesData);
//       if (facilitiesData) {
//         setProfileData(prev => ({
//           ...prev,
//           facilityName : facilitiesData.facility_name,
//           facilityType: facilitiesData.facility_type ,
//           address: facilitiesData.address,
//           city: facilitiesData.city ,
//           state: facilitiesData.state,
//           pincode: facilitiesData.pincode,
//           latitude: facilitiesData.latitude,
//           longitude: facilitiesData.longitude,
//           licenseNumber: facilitiesData.license_number,
//           establishedYear: facilitiesData.established_year,
//           totalBeds: facilitiesData.total_beds,
//           departments: facilitiesData.departments,
//           insurancePartners: facilitiesData.insurance_partners,
//           operatingHours: facilitiesData.operating_hours,
//           website: facilitiesData.website,
//           aboutFacility: facilitiesData.about_facility 
//         }));
//       }

//     }
//     fetchFacilityProfile();
//   }, [toast]);

//   const validateForm = (data: MedicalFacility) => {
//     const newErrors: { [key: string]: string } = {};
//     let valid = true;

//     if (!data.facilityName.trim()) {
//       newErrors.facilityName = 'Facility name is required';
//       valid = false;
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailAddress)) {
//       newErrors.emailAddress = 'Invalid email address';
//       valid = false;
//     }
//     if (!data.phoneNumber || !isValidPhoneNumber(data.phoneNumber)) {
//       newErrors.phoneNumber = 'Invalid phone number';
//       valid = false;
//     }
//     if (!data.facilityType.trim()) {
//       newErrors.facilityType = 'Facility type is required';
//       valid = false;
//     }
//     if (!data.address.trim()) {
//       newErrors.address = 'Address is required';
//       valid = false;
//     }

//     if (!valid) {
//       setErrors(newErrors);
//       const firstError = Object.values(newErrors)[0];
//       toast({
//         title: 'Validation Error',
//         description: firstError,
//         variant: 'destructive'
//       });
//     } else {
//       setErrors({});
//     }
//     return valid;
//   };

//   const handleSave = async () => {
//     mixpanelInstance.track('Facility Profile Save Attempt', {
//     facilityName: profileData.facilityName,
//     facilityType: profileData.facilityType,
//     isEditing
//   });
//     if (!validateForm(profileData))  {
//     mixpanelInstance.track('Facility Profile Validation Failed', {
//       errors: Object.keys(errors)
//     });
//     return;}

//     const profilesUpdate = {
//       user_id: user.id,
//       first_name: profileData.facilityName,
//       email: profileData.emailAddress,
//       phone_number: profileData.phoneNumber,
//       avatar_url: profileData.avatarUrl,
//     };

//     const medicalProfessionalsUpdate = {
//       admin_user_id: user.id,
//       facility_name : profileData.facilityName,
//       facility_type: profileData.facilityType,
//       address: profileData.address,
//       city: profileData.city,
//       state: profileData.state,
//       pincode: profileData.pincode,
//       latitude: profileData.latitude,
//       longitude: profileData.longitude,
//       license_number: profileData.licenseNumber,
//       established_year: profileData.establishedYear,
//       total_beds: profileData.totalBeds,
//       departments: profileData.departments,
//       insurance_partners: profileData.insurancePartners,
//       operating_hours: profileData.operatingHours,
//       website: profileData.website,
//       about_facility: profileData.aboutFacility
//     };

//     console.log("before upating row: " + profileData);
//     const { error: profilesUpdateError } = await supabase
//       .from('profiles')
//       .upsert(profilesUpdate, { onConflict: 'user_id' });

//     const { error : facilitiesUpdateError } = await supabase
//       .from('facilities')
//       .upsert(medicalProfessionalsUpdate, { onConflict: 'admin_user_id' });

//     if (profilesUpdateError || facilitiesUpdateError) {
//       toast({
//         title: 'Save failed',
//         description: profilesUpdateError?.message || facilitiesUpdateError?.message,
//         variant: 'destructive'
//       });
//           mixpanelInstance.track('Facility Profile Save Success', {
//       facilityName: profileData.facilityName
//     });
//     } else {
//       toast({
//         title: 'Profile saved',
//         description: 'Facility profile has been updated successfully',
//         variant: 'default'
//       });
//         mixpanelInstance.track('Facility Profile Save Failed', {
//       error: profilesUpdateError?.message || facilitiesUpdateError?.message
//     });
//       setIsEditing(false);
//     }
//   };

//   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     mixpanelInstance.track('Facility Profile Image Upload Attempt');
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const filePath = `profile_images/${Date.now()}_${file.name}`;
//     const { error: uploadError } = await supabase.storage
//       .from('heal_med_app_images_bucket')
//       .upload(filePath, file);

//     if (uploadError) {
//       toast({
//         title: 'Upload Error',
//         description: 'Failed to upload image. Please try again.',
//         variant: 'destructive'
//       });
//         mixpanelInstance.track('Facility Image Upload Failed', {
//       error: uploadError.message
//     });
//       return;
//     }

//     const { data: urlData } = supabase.storage
//       .from('heal_med_app_images_bucket')
//       .getPublicUrl(filePath);

//     setProfileData(prev => ({ ...prev, avatarUrl: urlData.publicUrl }));

//     toast({
//       title: 'Image Uploaded',
//       description: 'Facility image updated successfully'
//     });
//         mixpanelInstance.track('Facility Image Upload Success', {
//       fileName: file.name,
//       fileSize: file.size
//     });
//   };

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               Facility Profile
//             </h1>
//             <p className="text-muted-foreground">Manage facility details and services</p>
//           </div>
//         </div>
//         <Button
//           onClick={() => {
//     mixpanelInstance.track('Facility Profile Edit Click', {
//       currentState: isEditing ? 'saving' : 'editing'
//     });
//     isEditing ? handleSave() : setIsEditing(true);
//   }}
//           className={`${isEditing
//             ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
//             : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
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

//       {/* Facility Image */}
//       <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
//         <CardContent className="p-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
//           <div className="relative">
//             <img
//               src={profileData.avatarUrl || '/default-facility.png'}
//               alt="Facility"
//               className="h-32 w-32 rounded-lg shadow-xl object-cover border-4 border-white"
//             />
//             {isEditing && (
//               <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg cursor-pointer">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="absolute inset-0 opacity-0 cursor-pointer"
//                 />
//                 <Camera className="h-8 w-8 text-white" />
//               </div>
//             )}
//           </div>

//           <div className="flex-1 text-center md:text-left">
//             <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               {profileData.facilityName}
//             </h2>
//             <p className="text-lg text-muted-foreground mb-4">{profileData.facilityType}</p>
//             <p className="text-muted-foreground">
//               <Mail className="inline h-4 w-4 mr-1" /> {profileData.emailAddress}
//             </p>
//             <p className="text-muted-foreground">
//               <Phone className="inline h-4 w-4 mr-1" /> {profileData.phoneNumber}
//             </p>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Facility Information */}
//       <Card className="border-0 shadow-lg">
//         <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
//           <CardTitle className="text-xl">Facility Details</CardTitle>
//         </CardHeader>
//         <CardContent className="p-6 space-y-6">

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <Label htmlFor="facilityName" className="text-sm font-semibold text-gray-700">Facility Name</Label>
//               {isEditing ? (
//                 <Input
//                   id="facilityName"
//                   value={profileData.facilityName}
//                   onChange={(e) => setProfileData(prev => ({ ...prev, facilityName: e.target.value }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                   autoFocus
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.facilityName}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="facilityType" className="text-sm font-semibold text-gray-700">Facility Type</Label>
//               {isEditing ? (
//                 <Input
//                   id="facilityType"
//                   value={profileData.facilityType}
//                   onChange={(e) => setProfileData(prev => ({ ...prev, facilityType: e.target.value }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.facilityType}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="emailAddress" className="text-sm font-semibold text-gray-700">Email Address</Label>
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.emailAddress}</p>
//             </div>

//             <div>
//               <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">Phone Number</Label>
//               {isEditing ? (
//                 <Input
//                   id="phoneNumber"
//                   value={profileData.phoneNumber}
//                   onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.phoneNumber}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="address" className="text-sm font-semibold text-gray-700">Address</Label>
//               {isEditing ? (
//                 <Textarea
//                   id="address"
//                   value={profileData.address}
//                   onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                   rows={3}
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium whitespace-pre-wrap">{profileData.address}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="city" className="text-sm font-semibold text-gray-700">City</Label>
//               {isEditing ? (
//                 <Input
//                   id="city"
//                   value={profileData.city}
//                   onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.city}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="state" className="text-sm font-semibold text-gray-700">State</Label>
//               {isEditing ? (
//                 <Input
//                   id="state"
//                   value={profileData.state}
//                   onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.state}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="pincode" className="text-sm font-semibold text-gray-700">Pincode</Label>
//               {isEditing ? (
//                 <Input
//                   id="pincode"
//                   value={profileData.pincode}
//                   onChange={(e) => setProfileData(prev => ({ ...prev, pincode: e.target.value }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.pincode}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="licenseNumber" className="text-sm font-semibold text-gray-700">License Number</Label>
//               {isEditing ? (
//                 <Input
//                   id="licenseNumber"
//                   value={profileData.licenseNumber}
//                   onChange={(e) => setProfileData(prev => ({ ...prev, licenseNumber: e.target.value }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.licenseNumber}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="establishedYear" className="text-sm font-semibold text-gray-700">Established Year</Label>
//               {isEditing ? (
//                 <Input
//                   id="establishedYear"
//                   type="number"
//                   min={1800}
//                   max={new Date().getFullYear()}
//                   value={profileData.establishedYear}
//                   onChange={(e) => setProfileData(prev => ({ ...prev, establishedYear: Number(e.target.value) }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.establishedYear}</p>
//               )}
//             </div>

//             {/* <div>
//               <Label htmlFor="totalBeds" className="text-sm font-semibold text-gray-700">Total Beds</Label>
//               {isEditing ? (
//                 <Input
//                   id="totalBeds"
//                   type="number"
//                   min={0}
//                   value={profileData.totalBeds}
//                   onChange={(e) => setProfileData(prev => ({ ...prev, totalBeds: Number(e.target.value) }))}
//                   className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 />
//               ) : (
//                 <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.totalBeds}</p>
//               )}
//             </div> */}

//           </div>

//           <div>
//             <Label htmlFor="aboutFacility" className="text-sm font-semibold text-gray-700">About Facility</Label>
//             {isEditing ? (
//               <Textarea
//                 id="aboutFacility"
//                 value={profileData.aboutFacility}
//                 onChange={(e) => setProfileData(prev => ({ ...prev, aboutFacility: e.target.value }))}
//                 className="mt-2 border-2 focus:border-blue-500 transition-colors"
//                 rows={4}
//               />
//             ) : (
//               <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium whitespace-pre-wrap">{profileData.aboutFacility}</p>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default FacilityProfile;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { X, Edit, Save, Phone, Mail, MapPin, Camera, FileText, Download, Eye, Upload, Check, Loader2, Trash2, File } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { isValidPhoneNumber } from "@/utils/phoneValidation";
import mixpanelInstance from "@/utils/mixpanel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

export interface MedicalFacility {
  facilityName: string;
  emailAddress: string;
  facilityType: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country_code:string;
  latitude: number;
  longitude: number;
  licenseNumber: string;
  establishedYear: number;
  totalBeds: number;
  departments: string[];
  emergencyServices: boolean;
  ambulanceService: boolean;
  onlineConsultation: boolean;
  homeVisit: boolean;
  insurancePartners: string;
  operatingHours: string;
  website: string;
  aboutFacility: string;
  avatarUrl?: string;
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

const FacilityProfile: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<MedicalFacility>({
    facilityName: '',
    emailAddress: '',
    facilityType: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: 0,
    longitude: 0,
    licenseNumber: '',
    establishedYear: new Date().getFullYear(),
    totalBeds: 0,
    departments: [],
    emergencyServices: false,
    ambulanceService: false,
    onlineConsultation: false,
    homeVisit: false,
    insurancePartners: '',
    operatingHours: '',
    website: '',
    aboutFacility: '',
    avatarUrl: '',
    documentUrl: '',
    documentName: '',
    country_code:'',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<SupabaseUser>(null);
  const [uploading, setUploading] = useState(false);
   const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<{ url: string; name: string } | null>(null);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState<string | null>(null);


  useEffect(() => {
    async function fetchFacilityProfile() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('Auth error:', authError?.message || 'User not found');
        return;
      }

      setUser(user);

      const { data: profilesData, error: profilesDataError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profilesDataError) {
        console.error('Profile fetch error:', profilesDataError.message);
        return;
      }

      const facilityId = user.id;

      const { data: facilitiesData, error: facilitiesDataError } = await supabase
        .from('facilities')
        .select('*')
        .eq('admin_user_id', facilityId)
        .single();

      if (facilitiesDataError) {
        toast({
          title: 'Error loading facility data',
          description: facilitiesDataError.message,
          variant: 'destructive'
        });
        return;
      }

      if (profilesData) {
        setProfileData(prev => ({
          ...prev,
          facilityName: profilesData.first_name || '',
          emailAddress: profilesData.email || '',
          phoneNumber: profilesData.phone_number || '',
          avatarUrl: profilesData?.avatar_url || '',
          // documentUrl: profilesData?.document_url || '',
          // documentName: profilesData?.document_name || ''
        }));
      }

      if (facilitiesData) {
        setProfileData(prev => ({
          ...prev,
          facilityName: facilitiesData.facility_name,
          facilityType: facilitiesData.facility_type,
          address: facilitiesData.address,
          city: facilitiesData.city,
          state: facilitiesData.state,
          pincode: facilitiesData.pincode,
          country_code: facilitiesData.country_code,
          latitude: facilitiesData.latitude,
          longitude: facilitiesData.longitude,
          licenseNumber: facilitiesData.license_number,
          establishedYear: facilitiesData.established_year,
          totalBeds: facilitiesData.total_beds,
          departments: facilitiesData.departments,
          insurancePartners: facilitiesData.insurance_partners,
          operatingHours: facilitiesData.operating_hours,
          website: facilitiesData.website,
          aboutFacility: facilitiesData.about_facility
        }));
      }
       await fetchUserDocuments(user.id);
    }
    fetchFacilityProfile();
  }, [toast]);

  // const fetchUserDocuments = async (userId: string) => {
  //   setLoadingDocs(true);
  //   try {
  //     const { data: files, error } = await supabase.storage
  //       .from('heal_med_app_files_bucket')
  //       .list(`medical_documents/${userId}`, {
  //         limit: 100,
  //         sortBy: { column: 'created_at', order: 'desc' }
  //       });

  //     if (error) {
  //       console.error('Error fetching documents:', error);
  //       return;
  //     }

  //     if (files && files.length > 0) {
  //       const docs: UploadedDocument[] = await Promise.all(
  //         files.map(async (file) => {
  //           const { data: urlData } = supabase.storage
  //             .from('heal_med_app_files_bucket')
  //             .getPublicUrl(`medical_documents/${userId}/${file.name}`);
            
  //           return {
  //             name: file.name,
  //             type: 'facility',
  //             userId: userId,
  //             url: urlData.publicUrl,
  //             path: `medical_documents/${userId}/${file.name}`,
  //             uploadedAt: new Date(file.created_at)
  //           };
  //         })
  //       );
  //       setUploadedDocs(docs);
  //     }
  //   } catch (error) {
  //     console.error('Error in fetchUserDocuments:', error);
  //   } finally {
  //     setLoadingDocs(false);
  //   }
  // };
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
            type: 'facility',
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
  const validateForm = (data: MedicalFacility) => {
    const newErrors: { [key: string]: string } = {};
    let valid = true;

    if (!data.facilityName.trim()) {
      newErrors.facilityName = 'Facility name is required';
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emailAddress)) {
      newErrors.emailAddress = 'Invalid email address';
      valid = false;
    }
    if (!data.phoneNumber || !isValidPhoneNumber(data.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
      valid = false;
    }
    if (!data.facilityType.trim()) {
      newErrors.facilityType = 'Facility type is required';
      valid = false;
    }
    if (!data.address.trim()) {
      newErrors.address = 'Address is required';
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      toast({
        title: 'Validation Error',
        description: firstError,
        variant: 'destructive'
      });
    } else {
      setErrors({});
    }
    return valid;
  };

  const handleSave = async () => {
    mixpanelInstance.track('Facility Profile Save Attempt', {
      facilityName: profileData.facilityName,
      facilityType: profileData.facilityType,
      isEditing
    });
    
    if (!validateForm(profileData)) {
      mixpanelInstance.track('Facility Profile Validation Failed', {
        errors: Object.keys(errors)
      });
      return;
    }

    const profilesUpdate = {
      user_id: user.id,
      first_name: profileData.facilityName,
      email: profileData.emailAddress,
      phone_number: profileData.phoneNumber,
      avatar_url: profileData.avatarUrl,
      // document_url: profileData.documentUrl,
      // document_name: profileData.documentName
    };

    const medicalProfessionalsUpdate = {
      admin_user_id: user.id,
      facility_name: profileData.facilityName,
      facility_type: profileData.facilityType,
      address: profileData.address,
      city: profileData.city,
      state: profileData.state,
      pincode: profileData.pincode,
      country_code: profileData.country_code,
      latitude: profileData.latitude,
      longitude: profileData.longitude,
      license_number: profileData.licenseNumber,
      established_year: profileData.establishedYear,
      total_beds: profileData.totalBeds,
      departments: profileData.departments,
      insurance_partners: profileData.insurancePartners,
      operating_hours: profileData.operatingHours,
      website: profileData.website,
      about_facility: profileData.aboutFacility
    };

    const { error: profilesUpdateError } = await supabase
      .from('profiles')
      .upsert(profilesUpdate, { onConflict: 'user_id' });

    const { error: facilitiesUpdateError } = await supabase
      .from('facilities')
      .upsert(medicalProfessionalsUpdate, { onConflict: 'admin_user_id' });

    if (profilesUpdateError || facilitiesUpdateError) {
      toast({
        title: 'Save failed',
        description: profilesUpdateError?.message || facilitiesUpdateError?.message,
        variant: 'destructive'
      });
      mixpanelInstance.track('Facility Profile Save Failed', {
        error: profilesUpdateError?.message || facilitiesUpdateError?.message
      });
    } else {
      toast({
        title: 'Profile saved',
        description: 'Facility profile has been updated successfully',
        variant: 'default'
      });
      mixpanelInstance.track('Facility Profile Save Success', {
        facilityName: profileData.facilityName
      });
      setIsEditing(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    mixpanelInstance.track('Facility Profile Image Upload Attempt');
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an image file (JPEG, PNG, etc.)',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    const filePath = `profile_images/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('heal_med_app_images_bucket')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: 'Upload Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive'
      });
      mixpanelInstance.track('Facility Image Upload Failed', {
        error: uploadError.message
      });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('heal_med_app_images_bucket')
      .getPublicUrl(filePath);

    setProfileData(prev => ({ ...prev, avatarUrl: urlData.publicUrl }));

    toast({
      title: 'Image Uploaded',
      description: 'Facility image updated successfully'
    });
    mixpanelInstance.track('Facility Image Upload Success', {
      fileName: file.name,
      fileSize: file.size
    });
    setUploading(false);
  };

//  const [uploadedDocs, setUploadedDocs] = useState<Array<{name: string, type: 'patient' | 'doctor' | 'facility'}>>([]);

// Then update your handleFileUpload function
// const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//   const files = event.target.files;
//   if (!files) return;
//   setUploading(true);
  
//   for (let file of files) {
//     // Show PDF loader for PDF files
//     if (file.type === 'application/pdf') {
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
//      setUploading(true);
//       return;
//     }
//     else {
//       // Store the document with its type based on userType
//       setUploadedDocs(prev => [...prev, { 
//         name: file.name, 
//         type: 'facility' 
//       }]);
//       toast({
//         title: "Files Uploaded",
//         description: `file(s) uploaded successfully.`,
//       });
//     }
//   }
  
//  setUploading(false);
// };
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Facility Profile
            </h1>
            <p className="text-muted-foreground">Manage facility details and services</p>
          </div>
        </div>
        <Button
          onClick={() => {
            mixpanelInstance.track('Facility Profile Edit Click', {
              currentState: isEditing ? 'saving' : 'editing'
            });
            isEditing ? handleSave() : setIsEditing(true);
          }}
          className={`${isEditing
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
            : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            } text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
          disabled={uploading}
        >
          {uploading ? (
            <span>Uploading...</span>
          ) : isEditing ? (
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

      {/* Facility Image and Documents */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={profileData.avatarUrl || '/default-facility.png'}
                alt="Facility"
                className="h-32 w-32 rounded-lg shadow-xl object-cover border-4 border-white"
              />
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <Camera className="h-8 w-8 text-white" />
                </div>
              )}
            </div>

            {/* Facility Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {profileData.facilityName}
              </h2>
              <p className="text-lg text-muted-foreground mb-4">{profileData.facilityType}</p>
              <p className="text-muted-foreground">
                <Mail className="inline h-4 w-4 mr-1" /> {profileData.emailAddress}
              </p>
              <p className="text-muted-foreground">
                <Phone className="inline h-4 w-4 mr-1" /> {profileData.phoneNumber}
              </p>
            </div>

            {/* Document Section */}
            {profileData.documentUrl && !isEditing && (
              <div className="flex flex-col items-center md:items-end space-y-2">
                <div className="flex items-center space-x-2 p-3 bg-white rounded-lg shadow">
                  <FileText className="h-6 w-6 text-red-500" />
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {profileData.documentName || 'Facility Document'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {/* <Button
                    size="sm"
                    variant="outline"
                    onClick={openDocument}
                    className="flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View PDF
                  </Button> */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(profileData.documentUrl, '_blank')}
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>

           <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-sm font-semibold text-gray-700">
                Facility Documents
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
      {/* <Dialog open={!!selectedPdf} onOpenChange={() => setSelectedPdf(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedPdf?.name}</DialogTitle>
            <DialogDescription>
              View your document - You can zoom, download, or print this document.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 h-full min-h-0">
            {selectedPdf && (
              <iframe
                src={`${selectedPdf.url}#toolbar=1&navpanes=1&scrollbar=1`}
                className="w-full h-full rounded-lg border"
                title="PDF Viewer"
              />
            )}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button
              onClick={() => window.open(selectedPdf?.url, '_blank')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog> */}
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

      {/* Facility Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardTitle className="text-xl">Facility Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="facilityName" className="text-sm font-semibold text-gray-700">Facility Name</Label>
              {isEditing ? (
                <Input
                  id="facilityName"
                  value={profileData.facilityName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, facilityName: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                  autoFocus
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.facilityName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="facilityType" className="text-sm font-semibold text-gray-700">Facility Type</Label>
              {isEditing ? (
                <Input
                  id="facilityType"
                  value={profileData.facilityType}
                  onChange={(e) => setProfileData(prev => ({ ...prev, facilityType: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.facilityType}</p>
              )}
            </div>

            <div>
              <Label htmlFor="emailAddress" className="text-sm font-semibold text-gray-700">Email Address</Label>
              <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.emailAddress}</p>
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-semibold text-gray-700">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.phoneNumber}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-semibold text-gray-700">Address</Label>
              {isEditing ? (
                <Textarea
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                  rows={3}
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium whitespace-pre-wrap">{profileData.address}</p>
              )}
            </div>

            <div>
              <Label htmlFor="city" className="text-sm font-semibold text-gray-700">City</Label>
              {isEditing ? (
                <Input
                  id="city"
                  value={profileData.city}
                  onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.city}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state" className="text-sm font-semibold text-gray-700">State</Label>
              {isEditing ? (
                <Input
                  id="state"
                  value={profileData.state}
                  onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.state}</p>
              )}
            </div>
            <div>
              <Label htmlFor="country" className="text-sm font-semibold text-gray-700">Country</Label>
              {isEditing ? (
                <Input
                  id="country"
                  value={profileData.country_code}
                  onChange={(e) => setProfileData(prev => ({ ...prev, country_code: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.country_code}</p>
              )}
            </div>

            <div>
              <Label htmlFor="pincode" className="text-sm font-semibold text-gray-700">Pincode</Label>
              {isEditing ? (
                <Input
                  id="pincode"
                  value={profileData.pincode}
                  onChange={(e) => setProfileData(prev => ({ ...prev, pincode: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.pincode}</p>
              )}
            </div>

            <div>
              <Label htmlFor="licenseNumber" className="text-sm font-semibold text-gray-700">License Number</Label>
              {isEditing ? (
                <Input
                  id="licenseNumber"
                  value={profileData.licenseNumber}
                  onChange={(e) => setProfileData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.licenseNumber}</p>
              )}
            </div>

            <div>
              <Label htmlFor="establishedYear" className="text-sm font-semibold text-gray-700">Established Year</Label>
              {isEditing ? (
                <Input
                  id="establishedYear"
                  type="number"
                  min={1800}
                  max={new Date().getFullYear()}
                  value={profileData.establishedYear}
                  onChange={(e) => setProfileData(prev => ({ ...prev, establishedYear: Number(e.target.value) }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.establishedYear}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="aboutFacility" className="text-sm font-semibold text-gray-700">About Facility</Label>
            {isEditing ? (
              <Textarea
                id="aboutFacility"
                value={profileData.aboutFacility}
                onChange={(e) => setProfileData(prev => ({ ...prev, aboutFacility: e.target.value }))}
                className="mt-2 border-2 focus:border-blue-500 transition-colors"
                rows={4}
              />
            ) : (
              <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium whitespace-pre-wrap">{profileData.aboutFacility}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityProfile;