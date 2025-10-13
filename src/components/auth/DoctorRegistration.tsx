import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import AuthLayout from "./AuthLayout";
import { MedicalProfessional } from "@/Models/MedicalProfessional";
import { supabase } from "@/integrations/supabase/client";

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [termsAccepted,setTermsAccepted] = useState(false);
  const [kycAccepted,setKycAccepted] = useState(false);  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState<MedicalProfessional>({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    medicalSpeciality: "",
    licenseNumber: "",
    graduationYear: new Date().getFullYear(),
    medicalSchool: "",
    yearsOfExperience: 0,
    languagesKnown: "",
    consultationFees: 0,
    additionalQualifications: "",
    aboutYourself: "",
    kycVerified: false
  });

  const specialties = [
    "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
    "Orthopedic", "Pediatrician", "Gynecologist", "Psychiatrist",
    "Dentist", "Physiotherapist", "Dietician", "Ayurveda Practitioner",
    "Homeopath", "Psychologist", "ENT Specialist", "Ophthalmologist"
  ];

  


  const validateForm = (formData: MedicalProfessional) => {
    const errors: { [key: string]: string } = {};
    let valid = true;

    if (!formData.emailAddress) {
      errors.emailAddress = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
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


    setErrors(errors);

    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      toast({
        title: "Error in registering Medical Professional",
        description: errors[firstErrorKey],
        variant: "destructive",
        className: "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0",
      });
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted || !kycAccepted) {
      toast({
        title: "Agreement Required",
        description: "Please accept all terms and KYC verification to continue.",
        variant: "destructive"
      });
      return;
    }

    const doctorFullData = {
          ...formData
    };
    
    setFormData(doctorFullData);
    
    console.log(doctorFullData);

     if (!validateForm(doctorFullData)) {
      console.log(errors);     
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: doctorFullData.emailAddress,
          password: password,
          options: {
            data: {
              firstName: doctorFullData.firstName,
              lastName: doctorFullData.lastName,
            },
          },
    });

     if (signUpError) {
    toast({
      title: 'Registration Failed',
      description: signUpError.message, 
      variant: 'destructive',
      className: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0',
    });
    return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        first_name: doctorFullData.firstName,
        last_name: doctorFullData.lastName,
        phone_number: doctorFullData.phoneNumber,
        role: 'doctor',
        email: doctorFullData.emailAddress
      })
      .eq('email', doctorFullData.emailAddress);

    if (error) {
      console.error('Update error:', error.message);
    } else {
      console.log('Row updated:', data);
    }

    const { data: medProfData, error: medProfError } = await supabase
      .from('medical_professionals')
      .insert({
        user_id: signUpData.user?.id,
        medical_speciality: doctorFullData.medicalSpeciality,
        license_number: doctorFullData.licenseNumber,
        graduation_year: doctorFullData.graduationYear,
        medical_school: doctorFullData.medicalSchool,
        years_experience: doctorFullData.yearsOfExperience,
        languages_known: doctorFullData.languagesKnown,
        consultation_fee: doctorFullData.consultationFees,
        education: doctorFullData.additionalQualifications,
        about_yourself: doctorFullData.aboutYourself
      });


    if (medProfError) {
      console.error('Update error for medical_professionals:', medProfError.message);
    } else {
      console.log('Medical professionals row updated:', medProfData);
    }

    toast({
      title: "Registration Submitted!",
      description: "Your application is under review. You'll receive verification status within 24-48 hours.",
    });
    
    setTimeout(() => {
      navigate("/onboarding/doctor");
    }, 2000);
  };

  return (
    <AuthLayout
      title="Medical Professional Registration"
      description="Join our network of verified healthcare professionals"
      userType="doctor"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.emailAddress}
            onChange={(e) => setFormData({...formData, emailAddress: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 border-2 focus:border-blue-500 transition-colors bg-white/80"
            placeholder="enter your password"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="specialty">Medical Specialty</Label>
          <Select value={formData.medicalSpeciality} onValueChange={(value) => setFormData({...formData, medicalSpeciality: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select your specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((medicalSpeciality) => (
                <SelectItem key={medicalSpeciality} value={medicalSpeciality.toLowerCase().replace(/\s+/g, '-')}>
                  {medicalSpeciality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="licenseNumber">Medical License Number</Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="graduationYear">Graduation Year</Label>
            <Input
              id="graduationYear"
              type="number"
              min="1950"
              max={new Date().getFullYear()}
              value={formData.graduationYear}
              onChange={(e) => setFormData({...formData, graduationYear: Number(e.target.value) })}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="medicalSchool">Medical School/University</Label>
          <Input
            id="medicalSchool"
            value={formData.medicalSchool}
            onChange={(e) => setFormData({...formData, medicalSchool: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              max="50"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({...formData, yearsOfExperience: Number(e.target.value)})}
              required
            />
          </div>
          <div>
            <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
            <Input
              id="consultationFee"
              type="number"
              min="0"
              value={formData.consultationFees}
              onChange={(e) => setFormData({...formData, consultationFees: Number(e.target.value)})}
              placeholder="e.g., 500"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="languages">Languages Spoken</Label>
          <Input
            id="languages"
            value={formData.languagesKnown}
            onChange={(e) => setFormData({...formData, languagesKnown: e.target.value})}
            placeholder="e.g., English, Hindi, Regional languages"
            required
          />
        </div>

        <div>
          <Label htmlFor="qualifications">Additional Qualifications</Label>
          <Textarea
            id="qualifications"
            value={formData.additionalQualifications}
            onChange={(e) => setFormData({...formData, additionalQualifications: e.target.value})}
            placeholder="List your degrees, certifications, specializations..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="about">About Yourself</Label>
          <Textarea
            id="about"
            value={formData.aboutYourself}
            onChange={(e) => setFormData({...formData, aboutYourself: e.target.value})}
            placeholder="Brief introduction about your practice, approach, achievements..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm">
              I accept the Terms and Conditions for Medical Professionals
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="kyc"
              checked={kycAccepted}
              onCheckedChange={(checked) => setKycAccepted(checked as boolean)}
            />
            <Label htmlFor="kyc" className="text-sm">
              I consent to KYC verification and license validation
            </Label>
          </div>
        </div>

        <Button type="submit" variant="doctor" className="w-full" size="lg">
          Submit Application for Review
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/login/doctor")}>
            Sign in here
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default DoctorRegistration;