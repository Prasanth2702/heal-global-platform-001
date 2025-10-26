import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { X, Edit, Save, Phone, Mail, MapPin, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { dataTagSymbol } from '@tanstack/react-query';
import { isValidPhoneNumber } from "@/utils/phoneValidation";

export interface MedicalFacility {
  facilityName: string;
  emailAddress: string;
  facilityType: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
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
    avatarUrl: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [user, setUser] = useState<SupabaseUser>(null);

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

      console.log(user.id+"userOd_");

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
          avatarUrl: profilesData?.avatar_url || ''
        }));
      }

      console.log("pp"+profilesData);
      console.log("ff"+facilitiesData);
      if (facilitiesData) {
        setProfileData(prev => ({
          ...prev,
          facilityName : facilitiesData.facility_name,
          facilityType: facilitiesData.facility_type ,
          address: facilitiesData.address,
          city: facilitiesData.city ,
          state: facilitiesData.state,
          pincode: facilitiesData.pincode,
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

    }
    fetchFacilityProfile();
  }, [toast]);

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
    if (!validateForm(profileData)) return;

    const profilesUpdate = {
      user_id: user.id,
      first_name: profileData.facilityName,
      email: profileData.emailAddress,
      phone_number: profileData.phoneNumber,
      avatar_url: profileData.avatarUrl,
    };

    const medicalProfessionalsUpdate = {
      admin_user_id: user.id,
      facility_name : profileData.facilityName,
      facility_type: profileData.facilityType,
      address: profileData.address,
      city: profileData.city,
      state: profileData.state,
      pincode: profileData.pincode,
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

    console.log("before upating row: " + profileData);
    const { error: profilesUpdateError } = await supabase
      .from('profiles')
      .upsert(profilesUpdate, { onConflict: 'user_id' });

    const { error : facilitiesUpdateError } = await supabase
      .from('facilities')
      .upsert(medicalProfessionalsUpdate, { onConflict: 'admin_user_id' });

    if (profilesUpdateError || facilitiesUpdateError) {
      toast({
        title: 'Save failed',
        description: profilesUpdateError?.message || facilitiesUpdateError?.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Profile saved',
        description: 'Facility profile has been updated successfully',
        variant: 'default'
      });
      setIsEditing(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

      {/* Facility Image */}
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <CardContent className="p-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
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
                />
                <Camera className="h-8 w-8 text-white" />
              </div>
            )}
          </div>

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
        </CardContent>
      </Card>

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

            <div>
              <Label htmlFor="totalBeds" className="text-sm font-semibold text-gray-700">Total Beds</Label>
              {isEditing ? (
                <Input
                  id="totalBeds"
                  type="number"
                  min={0}
                  value={profileData.totalBeds}
                  onChange={(e) => setProfileData(prev => ({ ...prev, totalBeds: Number(e.target.value) }))}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
              ) : (
                <p className="mt-2 p-3 bg-gray-50 rounded-lg font-medium">{profileData.totalBeds}</p>
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
