import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {  
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
  Camera,
  Heart,
  Activity,
  Shield,
  ConeIcon,
  Home,
  FileText,
  Eye,
  Download,
  Loader2,
  Trash2,
  Upload,
  File
} from 'lucide-react';
import { Patient } from '@/Models/Patient';
import { supabase } from '@/integrations/supabase/client';
import { profile } from 'console'
import {User as SupabaseUser} from '@supabase/supabase-js'
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

interface PatientProfileProps {
  onBack: () => void;
}
interface UploadedDocument {
  name: string;
  type: 'patient' | 'doctor' | 'facility';
  userId?: string;
  url?: string;
  path?: string;
  uploadedAt?: Date;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ onBack }) => {
  
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [user,setUser] = useState<SupabaseUser>(null);
  const [profileData, setProfileData] = useState<Patient>({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    dateOfBirth: '',
    avatarUrl: '',
    gender: '',
    bloodGroup: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    knownAllergies: '',
    currentMedications: '',
    userType: 'patient',
     address: '',
    city: '',
    state: '',
    pincode: '',
    country_code: '',
  });
 const [profileInfo, setProfileInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOutdatedWarning, setShowOutdatedWarning] = useState(false);
const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<{ url: string; name: string } | null>(null);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState<string | null>(null);
 const [uploading, setUploading] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          console.error('Auth error:', authError?.message || 'User not found');
          setLoading(false);
          return;
        }

        setUser(user);

        // Fetch profiles data
        const { data: profilesData, error: profilesDataError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profilesDataError) {
          console.error('Profile fetch error:', profilesDataError.message);
        }

        // Fetch patients data
        const { data: patientData, error: patientDataError } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (patientDataError) {
          console.error('Patient data fetch error:', patientDataError.message);
        }
        
        // Set profile info from profiles table
        if (profilesData) {
          setProfileInfo(profilesData);
        }
        
        // Set profile data from both tables
        setProfileData({
          firstName: profilesData?.first_name || '',
          lastName: profilesData?.last_name || '',
          emailAddress: profilesData?.email || user.email || '',
          phoneNumber: profilesData?.phone_number || '',
          avatarUrl: profilesData?.avatar_url || '',
          userType: profilesData?.user_type || 'patient',
          dateOfBirth: patientData?.date_of_birth || '',
          gender: patientData?.gender || '',
          bloodGroup: patientData?.blood_group || '',
          emergencyContactName: patientData?.emergency_contact_name || '',
          emergencyContactPhone: patientData?.emergency_contact_number || '',
          knownAllergies: patientData?.known_allergies || '',
          currentMedications: patientData?.current_medications || '',
          city: patientData?.city || '',
          state: patientData?.state || '',
          pincode: patientData?.pincode || '',
          country_code: patientData?.country_code || '',
          address: patientData?.address || '',
        });

        // Check if profile is outdated (older than 6 months)
        if (profilesData && profilesData.updated_at) {
          const lastUpdated = new Date(profilesData.updated_at);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          
          if (lastUpdated < sixMonthsAgo) {
            setShowOutdatedWarning(true);
          }
        }
        await fetchUserDocuments(user.id);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
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
                type: 'patient',
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
//   useEffect(() => {
//     const fetchProfile = async () => {
//       const {
//         data: { user },
//         error: authError,
//       } = await supabase.auth.getUser();

//       if (authError || !user) {
//         console.error('Auth error:', authError?.message || 'User not found');
//         return;
//       }

//       setUser(user);

//       const { data: profilesData, error: profilesDataError } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('user_id', user.id)
//         .single();

//       if (profilesDataError) {
//         console.error('Profile fetch error:', profilesDataError.message);
//         return;
//       }


//       const { data: patientData, error: patientDataError } = await supabase
//         .from('patients')
//         .select('*')
//         .eq('user_id', user.id)
//         .single();

//       if (patientDataError) {
//         console.error('Profile fetch error:', patientDataError.message);
//         return;
//       }
//       if (patientData) {
//         setProfileData({
//           firstName: profilesData.first_name || '',
//           lastName: profilesData.last_name || '',
//           emailAddress: profilesData.email || '',
//           phoneNumber: profilesData.phone_number || '',
//           avatarUrl: profilesData.avatar_url || '',
//           userType: profilesData.user_type || 'patient',
//           dateOfBirth: patientData.date_of_birth || '',
//           gender: patientData.gender || '',
//           bloodGroup: patientData.blood_group || '',
//           emergencyContactName: patientData.emergency_contact_name || '',
//           emergencyContactPhone: patientData.emergency_contact_number || '',
//           knownAllergies: patientData.known_allergies || '',
//           currentMedications: patientData.current_medications || '',
//  city: patientData.city || '',
//           state: patientData.state || '',
//           pincode: patientData.pincode || '',
//           country_code: patientData.country_code || '',
//               address: patientData.address|| '',

//         });
//       }
//     };
//     fetchProfile();
//   }, []);


  // Validation function
  const validateForm = (formData: Patient) => {
    const errors: { [key: string]: string } = {};
    let valid = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      errors.emailAddress = "Invalid email format";
      valid = false;
    }
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
      valid = false;
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      errors.phoneNumber = "Invalid phone number format";
      valid = false;
    }
    if (!formData.emergencyContactPhone) {
      errors.emergencyContactPhone = "Emergency contact phone is required";
      valid = false;
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.emergencyContactPhone.replace(/\s/g, ""))) {
      errors.emergencyContactPhone = "Invalid phone number format";
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
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      toast({
        title: "Validation Error",
        description: errors[firstErrorKey],
        variant: "destructive",
        className: "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0",
      });
    }
    return valid;
  };



  const handleSave = async () => {

    if (!validateForm(profileData)) return;

    if(!user){
      return;
    }
    const profilesUpdate = {
      user_id: user.id,
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      email: profileData.emailAddress,
      phone_number: profileData.phoneNumber,
      avatar_url: profileData.avatarUrl
    };

    const patientsUpdate = {
      user_id: user.id,
      date_of_birth: profileData.dateOfBirth,
      gender: profileData.gender,
      blood_group: profileData.bloodGroup,
      emergency_contact_name: profileData.emergencyContactName,
      emergency_contact_number: profileData.emergencyContactPhone,
      known_allergies: profileData.knownAllergies,
      current_medications: profileData.currentMedications,
      address: profileData.address,
      city: profileData.city,
      state: profileData.state,
      pincode: profileData.pincode,
    }

    const { error: profilesUpdateError } = await supabase
      .from('profiles')
      .upsert(profilesUpdate, { onConflict: 'user_id' });

    const { error: patientsUpdateError } = await supabase
      .from('patients')
      .upsert(patientsUpdate, { onConflict: 'user_id' });

    if (profilesUpdateError || patientsUpdateError) {
      toast({
        title: 'Update Failed',
        description: profilesUpdateError.message,
        className: 'bg-red-500 text-white',
      });
    } else {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        className: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0',
      });
      setIsEditing(false);
      setErrors({});
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const filePath = `profile_images/${Date.now()}_${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('heal_med_app_images_bucket')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload profile picture. Please try again.',
      });
      return;
    }

    const { data: urlData} =  supabase.storage
      .from('heal_med_app_images_bucket')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    console.log("publicUrl"+publicUrl);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl }) 
      .eq('user_id', user?.id);

    if (updateError) {
      toast({
        title: 'Profile Update Failed',
        description: 'Failed to update profile picture URL. Please try again.',
      });
      return;
    }

    console.log("public url:"+publicUrl);

    setProfileData(prev => ({ ...prev, avatarUrl: publicUrl }));
    toast({
      title: 'Profile Picture Updated',
      description: 'Your profile picture has been updated.',
      className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0'
    });
  };

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
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
          >
            <X className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-muted-foreground">Manage your personal information and health data</p>
          </div>
        </div>

        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={`${isEditing
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

      {/* Profile Picture and Basic Info */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                <AvatarImage src={profileData.avatarUrl} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {(profileData.firstName?.[0] || profileData.lastName?.[0] || '')}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Camera className="h-8 w-8 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-lg text-muted-foreground mb-4">{profileData.emailAddress}</p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                  <Heart className="h-3 w-3 mr-1" />
                  Blood Group: {profileData.bloodGroup}
                </Badge>
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                  <Activity className="h-3 w-3 mr-1" />
                  Active Patient
                </Badge>
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-sm font-semibold text-gray-700">
                          Patient Documents
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

      {/* Personal Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardTitle className="flex items-center text-xl">
            <User className="h-5 w-5 mr-2" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name</Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.firstName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name</Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.lastName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={profileData.emailAddress}
                  onChange={(e) => setProfileData(prev => ({ ...prev, emailAddress: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors" disabled
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-500" />
                  {profileData.emailAddress}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-green-500" />
                  {profileData.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-700">Date of Birth</Label>
              {isEditing ? (
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                  {new Date(profileData.dateOfBirth).toLocaleDateString()}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">Gender</Label>
              {isEditing ? (
                <select
                  id="gender"
                  value={profileData.gender}
                  onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value }))}
                  className="mt-2 w-full p-3 border-2 rounded-lg focus:border-blue-500 transition-colors"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.gender}</p>
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

      {/* Medical Information */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <CardTitle className="flex items-center text-xl">
            <Heart className="h-5 w-5 mr-2" />
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="emergencyContact" className="text-sm font-semibold text-gray-700">Emergency Contact</Label>
              {isEditing ? (
                <Input
                  id="emergencyContact"
                  value={profileData.emergencyContactName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContactName: e.target.value }))}
                  className="mt-2 border-2 focus:border-emerald-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.emergencyContactName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="emergencyContactPhone" className="text-sm font-semibold text-gray-700">Emergency Contact Phone</Label>
              {isEditing ? (
                <Input
                  id="emergencyContact"
                  value={profileData.emergencyContactPhone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContactPhone: e.target.value }))}
                  className="mt-2 border-2 focus:border-emerald-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.emergencyContactPhone}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="bloodGroup" className="text-sm font-semibold text-gray-700">Blood Group</Label>
            {isEditing ? (
              <select
                id="bloodGroup"
                value={profileData.bloodGroup}
                onChange={(e) => setProfileData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                className="mt-2 w-full p-3 border-2 rounded-lg focus:border-emerald-500 transition-colors"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            ) : (
              <p className="mt-2 p-3 bg-red-50 rounded-lg font-medium text-red-700">{profileData.bloodGroup}</p>
            )}
          </div>


          <div>
            <Label htmlFor="allergies" className="text-sm font-semibold text-gray-700">Known Allergies</Label>
            {isEditing ? (
              <Input
                id="allergies"
                value={profileData.knownAllergies}
                onChange={(e) => setProfileData(prev => ({ ...prev, knownAllergies: e.target.value }))}
                className="mt-2 border-2 focus:border-emerald-500 transition-colors"
                placeholder="List any known allergies"
              />
            ) : (
              <p className="mt-2 p-3 bg-orange-50 rounded-lg font-medium text-orange-700">{profileData.knownAllergies}</p>
            )}
          </div>

          <div>
            <Label htmlFor="currentMedications" className="text-sm font-semibold text-gray-700">Current Medications</Label>
            {isEditing ? (
              <Input
                id="currentMedications"
                value={profileData.currentMedications}
                onChange={(e) => setProfileData(prev => ({ ...prev, currentMedications: e.target.value }))}
                className="mt-2 border-2 focus:border-emerald-500 transition-colors"
                placeholder="List current medications"
              />
            ) : (
              <p className="mt-2 p-3 bg-blue-50 rounded-lg font-medium text-blue-700">{profileData.currentMedications}</p>
            )}
          </div>

          <div>
            <Label htmlFor="medicalHistory" className="text-sm font-semibold text-gray-700">Medical History</Label>
            {isEditing ? (
              <Input
                id="medicalHistory"
                value={profileData.currentMedications}
                onChange={(e) => setProfileData(prev => ({ ...prev, medicalHistory: e.target.value }))}
                className="mt-2 border-2 focus:border-emerald-500 transition-colors"
                placeholder="Brief medical history"
              />
            ) : (
              <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.currentMedications}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientProfile;