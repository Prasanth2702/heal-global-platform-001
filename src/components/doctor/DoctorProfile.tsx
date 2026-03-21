import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Edit, Save, X, Camera, Shield, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { profile } from 'console';
import { isValidPhoneNumber } from "@/utils/phoneValidation";
import { useParams, useNavigate } from "react-router-dom";  // 🟢 ADDED
import { mixpanelInstance } from '@/utils/mixpanel';
import { Textarea } from '../ui/textarea';

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
}

interface DoctorProfileProps {
  onBack?: () => void;  
  // 🟢 It remains optional
}

const DoctorProfile: React.FC<DoctorProfileProps> = ({ onBack }) => {
 const { id } = useParams();  
 const navigate = useNavigate();
  // 🟢 ADDED — so the system knows which doctor to load when a patient opens /doctor/:id
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<SupabaseUser>(null);
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
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('Auth error:', authError?.message || 'User not found');
        return;
      }

      setUser(user);

      // Fetch profiles table data
      const { data: profilesData, error: profilesDataError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profilesDataError) {
        console.error('Profile fetch error:', profilesDataError.message);
        return;
      }

      // Fetch medical_professionals table data
      const { data: medicalData, error: medicalDataError } = await supabase
        .from('medical_professionals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (medicalDataError) {
        console.error('Medical profile fetch error:', medicalDataError.message);
        return;
      }

      if (medicalData) {
        setProfileData({
          firstName: profilesData.first_name || '',
          lastName: profilesData.last_name || '',
          emailAddress: profilesData.email || '',
          phoneNumber: profilesData.phone_number || '',
          avatarUrl: profilesData.avatar_url || '',
          userType: profilesData.user_type || 'medicalProfessional',
          medicalSpeciality: medicalData.medical_speciality || '',
          licenseNumber: medicalData.license_number || '',
          graduationYear: medicalData.graduation_year || new Date().getFullYear(),
          medicalSchool: medicalData.medical_school || '',
          yearsOfExperience: medicalData.years_of_experience || 0,
          consultationFees: medicalData.consultation_fees || 0,
          aboutYourself: medicalData.about_yourself || '',
          kycVerified: medicalData.kyc_verified || false,
          languagesKnown: medicalData.languages_known || '',
          city: medicalData.city || '',
          state: medicalData.state || '',
          pincode: medicalData.pincode || '',
          country_code: medicalData.country_code || '',
              address: medicalData.address|| '',

        });
      }
    };
    fetchProfile();
  }, []);
  // -----------------------------
  //  🔙 BACK BUTTON BEHAVIOR FIX
  // -----------------------------
  const handleBack = () => {
    if (onBack) {
      onBack(); // 🟡 Use existing parent behavior (doctor side)
    } else {
      navigate(-1);  
      // 🟢 ADDED fallback for patient navigation
      // So when patient opens /doctor/46 → Back will return to the search list
    }
  };
  // Validation function customized for doctor profile
  const validateForm = (formData: MedicalProfessional) => {
    const errors: { [key: string]: string } = {};
    let valid = true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
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
    if (!formData.graduationYear || formData.graduationYear < 1900 || formData.graduationYear > new Date().getFullYear()) {
      errors.graduationYear = 'Invalid graduation year';
      valid = false;
    }
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
      is_verified: profileData.kycVerified,
      languages_known: profileData.languagesKnown,
      address: profileData.address,
      city: profileData.city,
      state: profileData.state,
      pincode: profileData.pincode,
    };

    console.log("before upating row: " + profileData);
    const { error: profilesUpdateError } = await supabase
      .from('profiles')
      .upsert(profilesUpdate, { onConflict: 'user_id' });

    const { error: medicalUpdateError } = await supabase
      .from('medical_professionals')
      .upsert(medicalProfessionalsUpdate, { onConflict: 'user_id' });

    if (profilesUpdateError || medicalUpdateError) {
      toast({
        title: 'Update Failed',
        description: profilesUpdateError?.message || medicalUpdateError?.message,
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

    const { data: urlData } = supabase.storage
      .from('heal_med_app_images_bucket')
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

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

    setProfileData(prev => ({ ...prev, avatarUrl: publicUrl }));
    toast({
      title: 'Profile Picture Updated',
      description: 'Your profile picture has been updated.',
      className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
           onClick={handleBack}   // 🟡 CHANGED — now uses new function
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
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                  <Shield className="h-3 w-3 mr-1" />
                  {profileData.kycVerified ? 'KYC Verified' : 'KYC Not Verified'}
                </Badge>
                <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0">
                  {profileData.medicalSpeciality}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.licenseNumber}</p>
            </div>

            <div>
              <Label htmlFor="graduationYear" className="text-sm font-semibold text-gray-700">
                Graduation Year
              </Label>
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.graduationYear}</p>
            </div>

            <div>
              <Label htmlFor="medicalSchool" className="text-sm font-semibold text-gray-700">
                Medical School
              </Label>
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.medicalSchool}</p>
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
    </div>
  );
};

export default DoctorProfile;
