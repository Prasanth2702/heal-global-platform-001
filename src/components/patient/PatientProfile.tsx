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
  ConeIcon
} from 'lucide-react';
import { Patient } from '@/Models/Patient';
import { supabase } from '@/integrations/supabase/client';
import { profile } from 'console';

interface PatientProfileProps {
  onBack: () => void;
}

const PatientProfile: React.FC<PatientProfileProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
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
    userType: 'patient'
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

      const { data: profilesData, error: profilesDataError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profilesDataError) {
        console.error('Profile fetch error:', profilesDataError.message);
        return;
      }


      const { data: patientData, error: patientDataError } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (patientDataError) {
        console.error('Profile fetch error:', patientDataError.message);
        return;
      }
      if (patientData) {
        setProfileData({
          firstName: profilesData.first_name || '',
          lastName: profilesData.last_name || '',
          emailAddress: profilesData.email || '',
          phoneNumber: profilesData.phone_number || '',
          avatarUrl: profilesData.avatar_url || '',
          userType: profilesData.user_type || 'patient',
          dateOfBirth: patientData.date_of_birth || '',
          gender: patientData.gender || '',
          bloodGroup: patientData.blood_group || '',
          emergencyContactName: patientData.emergency_contact_name || '',
          emergencyContactPhone: patientData.emergency_contact_number || '',
          knownAllergies: patientData.known_allergies || '',
          currentMedications: patientData.current_medications || ''
        });
      }
    };
    fetchProfile();
  }, []);


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

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      toast({
        title: 'Authentication Error',
        description: authError?.message || 'User not found.',
        className: 'bg-red-500 text-white',
      });
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


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, avatarUrl: imageUrl }));
      toast({
        title: 'Profile Picture Updated',
        description: 'Your profile picture has been updated.',
        className: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0'
      });
    }
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
        </CardContent>
      </Card>

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