import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  X, Edit, Save, Phone, Mail, MapPin, Camera, 
  FileText, Download, Eye, Upload, Check, Building2, 
  Users, Calendar, DollarSign, Clock, Briefcase, 
  BadgeCheck, Plus, Trash2, ChevronRight, UserCog,
  Hospital, Activity, UserPlus, Settings, Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { isValidPhoneNumber } from "@/utils/phoneValidation";
import mixpanelInstance from "@/utils/mixpanel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface StaffProfileData {
  // Staff Info
  id?: string;
  employeeId: string;
  position: string;
  hireDate: string;
  salary: number;
  shiftSchedule: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  permissions: string[];
  isActive: boolean;
  
  // User Info (from profiles)
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
  
  // Department Info
  departmentId?: string;
  departmentName?: string;
  departmentRole?: string;
  
  // Facility Info
  facilityId?: string;
  facilityName?: string;
  facilityType?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  headDoctorId?: string;
  services: any;
  equipment: any;
  bedCapacity: number;
  availableBeds: number;
  isActive: boolean;
  staffCount?: number;
}

export interface Facility {
  id: string;
  facilityName: string;
  facilityType: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber?: string;
  emailAddress?: string;
  totalBeds: number;
  departments?: Department[];
}

const StaffProfile: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [uploading, setUploading] = useState(false);
  const [staffProfile, setStaffProfile] = useState<StaffProfileData>({
    employeeId: '',
    position: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: 0,
    shiftSchedule: {},
    permissions: [],
    isActive: true,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    avatarUrl: '',
  });
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({
    name: '',
    description: '',
    bedCapacity: 0,
    availableBeds: 0,
    isActive: true,
  });
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState<any>(null);
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);

  useEffect(() => {
    fetchStaffProfile();
  }, []);

  const fetchStaffProfile = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('Auth error:', authError?.message || 'User not found');
        return;
      }

      setUser(user);

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError.message);
        return;
      }

      // Fetch staff data
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select(`
          *,
          departments (
            id,
            name,
            description,
            head_doctor_id,
            services,
            equipment,
            bed_capacity,
            available_beds,
            is_active
          ),
          facilities (
            id,
            facility_name,
            facility_type,
            address,
            city,
            state,
            pincode,
            total_beds
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (staffError && staffError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Staff fetch error:', staffError.message);
      }

      if (profileData) {
        setStaffProfile(prev => ({
          ...prev,
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          email: profileData.email || '',
          phoneNumber: profileData.phone_number || '',
          avatarUrl: profileData.avatar_url || '',
        }));
      }

      if (staffData) {
        setStaffProfile(prev => ({
          ...prev,
          id: staffData.id,
          employeeId: staffData.employee_id || '',
          position: staffData.position || '',
          hireDate: staffData.hire_date || new Date().toISOString().split('T')[0],
          salary: staffData.salary || 0,
          shiftSchedule: staffData.shift_schedule || {},
          permissions: staffData.permissions || [],
          isActive: staffData.is_active ?? true,
          departmentId: staffData.department_id,
          departmentName: staffData.departments?.name,
          facilityId: staffData.facility_id,
        }));

        if (staffData.facilities) {
          setFacility({
            id: staffData.facilities.id,
            facilityName: staffData.facilities.facility_name,
            facilityType: staffData.facilities.facility_type,
            address: staffData.facilities.address,
            city: staffData.facilities.city,
            state: staffData.facilities.state,
            pincode: staffData.facilities.pincode,
            totalBeds: staffData.facilities.total_beds,
          });
        }

        if (staffData.facility_id) {
          fetchDepartments(staffData.facility_id);
          fetchStaffMembers(staffData.facility_id);
        }
      }
    } catch (error) {
      console.error('Error fetching staff profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async (facilityId: string) => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('facility_id', facilityId)
        .eq('is_active', true);

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchStaffMembers = async (facilityId: string) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email,
            phone_number,
            avatar_url
          ),
          departments (
            name
          )
        `)
        .eq('facility_id', facilityId)
        .eq('is_active', true);

      if (error) throw error;
      setStaffMembers(data || []);
    } catch (error) {
      console.error('Error fetching staff members:', error);
    }
  };

  const validateForm = (data: StaffProfileData) => {
    const newErrors: { [key: string]: string } = {};
    let valid = true;

    if (!data.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }
    if (!data.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Invalid email address';
      valid = false;
    }
    if (!data.phoneNumber || !isValidPhoneNumber(data.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
      valid = false;
    }
    if (!data.position.trim()) {
      newErrors.position = 'Position is required';
      valid = false;
    }
    if (!data.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
      valid = false;
    }

    if (!valid) {
      const firstError = Object.values(newErrors)[0];
      toast({
        title: 'Validation Error',
        description: firstError,
        variant: 'destructive'
      });
    }
    return valid;
  };

  const handleSave = async () => {
    mixpanelInstance.track('Staff Profile Save Attempt', {
      position: staffProfile.position,
      isEditing
    });

    if (!validateForm(staffProfile)) {
      mixpanelInstance.track('Staff Profile Validation Failed');
      return;
    }

    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          first_name: staffProfile.firstName,
          last_name: staffProfile.lastName,
          email: staffProfile.email,
          phone_number: staffProfile.phoneNumber,
          avatar_url: staffProfile.avatarUrl,
        }, { onConflict: 'user_id' });

      if (profileError) throw profileError;

      // Update staff table
      if (staffProfile.id) {
        const { error: staffError } = await supabase
          .from('staff')
          .update({
            position: staffProfile.position,
            employee_id: staffProfile.employeeId,
            hire_date: staffProfile.hireDate,
            salary: staffProfile.salary,
            shift_schedule: staffProfile.shiftSchedule,
            permissions: staffProfile.permissions,
            is_active: staffProfile.isActive,
            updated_at: new Date().toISOString(),
          })
          .eq('id', staffProfile.id);

        if (staffError) throw staffError;
      }

      toast({
        title: 'Profile saved',
        description: 'Staff profile has been updated successfully',
        variant: 'default'
      });
      
      mixpanelInstance.track('Staff Profile Save Success');
      setIsEditing(false);
      fetchStaffProfile(); // Refresh data
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: 'Save failed',
        description: error.message,
        variant: 'destructive'
      });
      mixpanelInstance.track('Staff Profile Save Failed', { error: error.message });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    mixpanelInstance.track('Staff Profile Image Upload Attempt');
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an image file',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    try {
      const filePath = `profile_images/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('heal_med_app_images_bucket')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('heal_med_app_images_bucket')
        .getPublicUrl(filePath);

      setStaffProfile(prev => ({ ...prev, avatarUrl: urlData.publicUrl }));

      toast({
        title: 'Image Uploaded',
        description: 'Profile image updated successfully'
      });
      mixpanelInstance.track('Staff Image Upload Success');
    } catch (error: any) {
      toast({
        title: 'Upload Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateDepartment = async () => {
    if (!facility?.id) return;

    try {
      const { data, error } = await supabase
        .from('departments')
        .insert({
          facility_id: facility.id,
          name: newDepartment.name,
          description: newDepartment.description,
          bed_capacity: newDepartment.bedCapacity,
          available_beds: newDepartment.availableBeds,
          is_active: true,
          services: {},
          equipment: {},
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Department Created',
        description: 'New department has been added successfully'
      });

      setIsAddDepartmentOpen(false);
      setNewDepartment({
        name: '',
        description: '',
        bedCapacity: 0,
        availableBeds: 0,
        isActive: true,
      });
      fetchDepartments(facility.id);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteDepartment = async (departmentId: string) => {
    try {
      const { error } = await supabase
        .from('departments')
        .update({ is_active: false })
        .eq('id', departmentId);

      if (error) throw error;

      toast({
        title: 'Department Deactivated',
        description: 'Department has been removed'
      });

      fetchDepartments(facility?.id || '');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleCreateStaff = async (staffData: any) => {
    try {
      // First create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          email: staffData.email,
          first_name: staffData.firstName,
          last_name: staffData.lastName,
          phone_number: staffData.phoneNumber,
          role: 'staff',
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Then create staff record
      const { error: staffError } = await supabase
        .from('staff')
        .insert({
          facility_id: facility?.id,
          user_id: profileData.user_id,
          department_id: staffData.departmentId,
          position: staffData.position,
          employee_id: staffData.employeeId,
          hire_date: staffData.hireDate,
          salary: staffData.salary,
          shift_schedule: staffData.shiftSchedule || {},
          permissions: staffData.permissions || [],
          is_active: true,
        });

      if (staffError) throw staffError;

      toast({
        title: 'Staff Added',
        description: 'New staff member has been added successfully'
      });

      setIsStaffDialogOpen(false);
      fetchStaffMembers(facility?.id || '');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleUpdateStaff = async (staffData: any) => {
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: staffData.firstName,
          last_name: staffData.lastName,
          phone_number: staffData.phoneNumber,
        })
        .eq('user_id', staffData.userId);

      if (profileError) throw profileError;

      // Update staff
      const { error: staffError } = await supabase
        .from('staff')
        .update({
          department_id: staffData.departmentId,
          position: staffData.position,
          employee_id: staffData.employeeId,
          salary: staffData.salary,
          shift_schedule: staffData.shiftSchedule,
          permissions: staffData.permissions,
          is_active: staffData.isActive,
        })
        .eq('id', staffData.id);

      if (staffError) throw staffError;

      toast({
        title: 'Staff Updated',
        description: 'Staff information has been updated'
      });

      setIsStaffDialogOpen(false);
      setSelectedStaffForEdit(null);
      fetchStaffMembers(facility?.id || '');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      const { error } = await supabase
        .from('staff')
        .update({ is_active: false })
        .eq('id', staffId);

      if (error) throw error;

      toast({
        title: 'Staff Removed',
        description: 'Staff member has been deactivated'
      });

      fetchStaffMembers(facility?.id || '');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
            <AvatarImage src={staffProfile.avatarUrl} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
              {staffProfile.firstName?.[0]}{staffProfile.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {staffProfile.firstName} {staffProfile.lastName}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {staffProfile.position} • {staffProfile.employeeId}
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            mixpanelInstance.track('Staff Profile Edit Click');
            isEditing ? handleSave() : setIsEditing(true);
          }}
          className={`${isEditing
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
            : 'bg-gradient-to-r from-blue-500 to-purple-500'
            } text-white shadow-lg hover:shadow-xl transition-all duration-300`}
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

      {/* Main Content Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="department">Department</TabsTrigger>
          <TabsTrigger value="facility">Facility</TabsTrigger>
          <TabsTrigger value="staff">Staff Management</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CardTitle className="text-xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-semibold">First Name</Label>
                  {isEditing ? (
                    <Input
                      value={staffProfile.firstName}
                      onChange={(e) => setStaffProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 p-3 bg-gray-50 rounded-lg">{staffProfile.firstName}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold">Last Name</Label>
                  {isEditing ? (
                    <Input
                      value={staffProfile.lastName}
                      onChange={(e) => setStaffProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 p-3 bg-gray-50 rounded-lg">{staffProfile.lastName}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold">Email</Label>
                  <p className="mt-2 p-3 bg-gray-50 rounded-lg">{staffProfile.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      value={staffProfile.phoneNumber}
                      onChange={(e) => setStaffProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 p-3 bg-gray-50 rounded-lg">{staffProfile.phoneNumber}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold">Employee ID</Label>
                  {isEditing ? (
                    <Input
                      value={staffProfile.employeeId}
                      onChange={(e) => setStaffProfile(prev => ({ ...prev, employeeId: e.target.value }))}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 p-3 bg-gray-50 rounded-lg">{staffProfile.employeeId}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold">Position</Label>
                  {isEditing ? (
                    <Input
                      value={staffProfile.position}
                      onChange={(e) => setStaffProfile(prev => ({ ...prev, position: e.target.value }))}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 p-3 bg-gray-50 rounded-lg">{staffProfile.position}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold">Hire Date</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={staffProfile.hireDate}
                      onChange={(e) => setStaffProfile(prev => ({ ...prev, hireDate: e.target.value }))}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 p-3 bg-gray-50 rounded-lg">
                      {new Date(staffProfile.hireDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-semibold">Salary</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={staffProfile.salary}
                      onChange={(e) => setStaffProfile(prev => ({ ...prev, salary: Number(e.target.value) }))}
                      className="mt-2"
                    />
                  ) : (
                    <p className="mt-2 p-3 bg-gray-50 rounded-lg">
                      ${staffProfile.salary?.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Shift Schedule */}
              <div className="mt-6">
                <Label className="text-sm font-semibold">Shift Schedule</Label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <span className="w-24 capitalize">{day}:</span>
                      {isEditing ? (
                        <Input
                          placeholder="e.g., 9AM-5PM"
                          value={staffProfile.shiftSchedule[day as keyof typeof staffProfile.shiftSchedule] || ''}
                          onChange={(e) => setStaffProfile(prev => ({
                            ...prev,
                            shiftSchedule: { ...prev.shiftSchedule, [day]: e.target.value }
                          }))}
                          className="flex-1"
                        />
                      ) : (
                        <span className="flex-1 p-2 bg-gray-50 rounded-lg">
                          {staffProfile.shiftSchedule[day as keyof typeof staffProfile.shiftSchedule] || 'Off'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Department Tab */}
        <TabsContent value="department">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Department Information</CardTitle>
                {facility && (
                  <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Department
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Department</DialogTitle>
                        <DialogDescription>
                          Add a new department to the facility
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Department Name</Label>
                          <Input
                            value={newDepartment.name}
                            onChange={(e) => setNewDepartment(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Cardiology"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={newDepartment.description}
                            onChange={(e) => setNewDepartment(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Department description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Bed Capacity</Label>
                            <Input
                              type="number"
                              value={newDepartment.bedCapacity}
                              onChange={(e) => setNewDepartment(prev => ({ ...prev, bedCapacity: Number(e.target.value) }))}
                            />
                          </div>
                          <div>
                            <Label>Available Beds</Label>
                            <Input
                              type="number"
                              value={newDepartment.availableBeds}
                              onChange={(e) => setNewDepartment(prev => ({ ...prev, availableBeds: Number(e.target.value) }))}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddDepartmentOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateDepartment}>
                          Create Department
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {staffProfile.departmentName ? (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg">Your Department</h3>
                  <p className="text-gray-700">{staffProfile.departmentName}</p>
                  <p className="text-sm text-gray-500 mt-1">Role: {staffProfile.departmentRole || 'Staff'}</p>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-700">You are not assigned to any department</p>
                </div>
              )}

              <h3 className="font-semibold text-lg mb-4">All Departments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <Card key={dept.id} className="relative overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{dept.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{dept.description}</p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              Beds: {dept.availableBeds}/{dept.bedCapacity}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDepartment(dept.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facility Tab */}
        <TabsContent value="facility">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <CardTitle className="text-xl">Facility Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {facility ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-semibold">Facility Name</Label>
                      <p className="mt-2 p-3 bg-gray-50 rounded-lg">{facility.facilityName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Facility Type</Label>
                      <p className="mt-2 p-3 bg-gray-50 rounded-lg">{facility.facilityType}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-semibold">Address</Label>
                      <p className="mt-2 p-3 bg-gray-50 rounded-lg">
                        {facility.address}, {facility.city}, {facility.state} - {facility.pincode}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Total Beds</Label>
                      <p className="mt-2 p-3 bg-gray-50 rounded-lg">{facility.totalBeds}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Total Departments</Label>
                      <p className="mt-2 p-3 bg-gray-50 rounded-lg">{departments.length}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No facility information available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Management Tab */}
        <TabsContent value="staff">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Staff Management</CardTitle>
                <Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm" onClick={() => setSelectedStaffForEdit(null)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Staff
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedStaffForEdit ? 'Edit Staff' : 'Add New Staff'}
                      </DialogTitle>
                      <DialogDescription>
                        {selectedStaffForEdit ? 'Update staff information' : 'Enter new staff member details'}
                      </DialogDescription>
                    </DialogHeader>
                    <StaffForm
                      staff={selectedStaffForEdit}
                      departments={departments}
                      onSubmit={selectedStaffForEdit ? handleUpdateStaff : handleCreateStaff}
                      onCancel={() => {
                        setIsStaffDialogOpen(false);
                        setSelectedStaffForEdit(null);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.employee_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={staff.profiles?.avatar_url} />
                            <AvatarFallback>
                              {staff.profiles?.first_name?.[0]}{staff.profiles?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{staff.profiles?.first_name} {staff.profiles?.last_name}</div>
                            <div className="text-xs text-gray-500">{staff.profiles?.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{staff.departments?.name || 'Not Assigned'}</TableCell>
                      <TableCell>{staff.position}</TableCell>
                      <TableCell>{staff.profiles?.phone_number}</TableCell>
                      <TableCell>
                        <Badge variant={staff.is_active ? 'default' : 'secondary'}>
                          {staff.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedStaffForEdit({
                                id: staff.id,
                                userId: staff.user_id,
                                employeeId: staff.employee_id,
                                firstName: staff.profiles?.first_name,
                                lastName: staff.profiles?.last_name,
                                email: staff.profiles?.email,
                                phoneNumber: staff.profiles?.phone_number,
                                position: staff.position,
                                departmentId: staff.department_id,
                                salary: staff.salary,
                                hireDate: staff.hire_date,
                                shiftSchedule: staff.shift_schedule,
                                permissions: staff.permissions,
                                isActive: staff.is_active,
                              });
                              setIsStaffDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteStaff(staff.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Staff Form Component for Add/Edit
const StaffForm: React.FC<{
  staff?: any;
  departments: Department[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ staff, departments, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: staff?.id || '',
    userId: staff?.userId || '',
    employeeId: staff?.employeeId || '',
    firstName: staff?.firstName || '',
    lastName: staff?.lastName || '',
    email: staff?.email || '',
    phoneNumber: staff?.phoneNumber || '',
    position: staff?.position || '',
    departmentId: staff?.departmentId || '',
    salary: staff?.salary || 0,
    hireDate: staff?.hireDate || new Date().toISOString().split('T')[0],
    shiftSchedule: staff?.shiftSchedule || {},
    permissions: staff?.permissions || [],
    isActive: staff?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input
            required
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
          />
        </div>
        <div>
          <Label>Last Name</Label>
          <Input
            required
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
          />
        </div>
      </div>

      {!staff && (
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>
      )}

      <div>
        <Label>Phone Number</Label>
        <Input
          required
          value={formData.phoneNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Employee ID</Label>
          <Input
            required
            value={formData.employeeId}
            onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
          />
        </div>
        <div>
          <Label>Position</Label>
          <Input
            required
            value={formData.position}
            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Department</Label>
          <Select
            value={formData.departmentId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, departmentId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Salary</Label>
          <Input
            type="number"
            value={formData.salary}
            onChange={(e) => setFormData(prev => ({ ...prev, salary: Number(e.target.value) }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Hire Date</Label>
          <Input
            type="date"
            value={formData.hireDate}
            onChange={(e) => setFormData(prev => ({ ...prev, hireDate: e.target.value }))}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select
            value={formData.isActive ? 'active' : 'inactive'}
            onValueChange={(value) => setFormData(prev => ({ ...prev, isActive: value === 'active' }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {staff ? 'Update' : 'Create'} Staff
        </Button>
      </DialogFooter>
    </form>
  );
};

export default StaffProfile;