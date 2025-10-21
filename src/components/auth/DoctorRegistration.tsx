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
import '../../styles/form-input-styles.css';
import { isValidPhoneNumber } from '../../utils/phoneValidation';

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

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [kycAccepted, setKycAccepted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');

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

    if (password !== repeatPassword) {
      errors.repeatPassword = "Passwords do not match";
      valid = false;
    }
    console.log('Passwords match.');

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
    } else if (!isValidPhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number";
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
      ...formData,
      phoneNumber: countryCode + phoneNumber
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
            <Label className="label-required" htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              minLength={1} maxLength={50}
              required
            />
          </div>
          <div>
            <Label className="label-required" htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              minLength={1} maxLength={50}
              required
            />
          </div>
        </div>

        <div>
          <Label className="label-required" htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.emailAddress}
            onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
            required
          />
          {errors.emailAddress && (
            <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="label-required text-sm font-semibold text-gray-700">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 border-2 focus:border-blue-500 transition-colors bg-white/80"
            placeholder="enter your password" minLength={6}
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="label-required text-sm font-semibold text-gray-700">Repeat Password</Label>
          <Input
            id="repeatpassword"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="mt-2 border-2 focus:border-blue-500 transition-colors bg-white/80"
            placeholder="enter your password again" minLength={6}
            required
          />
          {errors.repeatPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.repeatPassword}</p>
          )}
        </div>

        <div>
          <Label className="label-required text-sm font-semibold text-gray-700">Phone Number</Label>
          <div className="flex mt-2 space-x-2">
            <Select value={countryCode} onValueChange={(value) => setCountryCode(value)}>
              <SelectTrigger className="label-required w-24 border-2 focus:border-blue-500 bg-white/80">
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
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 border-2 focus:border-blue-500 transition-colors bg-white/80"
              placeholder="Enter phone number"
              required
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>
        </div>

        <div>
          <Label className="label-required" htmlFor="specialty">Medical Specialty</Label>
          <Select value={formData.medicalSpeciality} onValueChange={(value) => setFormData({ ...formData, medicalSpeciality: value })}>
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
            <Label className="label-required" htmlFor="licenseNumber">Medical License Number</Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              minLength={1} maxLength={50}
              required
            />
          </div>
          <div>
            <Label className="label-required" htmlFor="graduationYear">Graduation Year</Label>
            <Input
              id="graduationYear"
              type="number"
              min="1950"
              max={new Date().getFullYear()}
              value={formData.graduationYear}
              onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
              required
            />
          </div>
        </div>

        <div>
          <Label className="label-required" htmlFor="medicalSchool">Medical School/University</Label>
          <Input
            id="medicalSchool"
            value={formData.medicalSchool}
            onChange={(e) => setFormData({ ...formData, medicalSchool: e.target.value })}
            minLength={1} maxLength={100}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="label-required" htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              max="50"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
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
              onChange={(e) => setFormData({ ...formData, consultationFees: Number(e.target.value) })}
              placeholder="e.g., 500"
            />
          </div>
        </div>

        <div>
          <Label className="label-required" htmlFor="languages">Languages Spoken</Label>
          <Input
            id="languages"
            value={formData.languagesKnown}
            onChange={(e) => setFormData({ ...formData, languagesKnown: e.target.value })}
            placeholder="e.g., English, Hindi, Regional languages"
            minLength={1} maxLength={100}
            required
          />
        </div>

        <div>
          <Label htmlFor="qualifications">Additional Qualifications</Label>
          <Textarea
            id="qualifications"
            value={formData.additionalQualifications}
            onChange={(e) => setFormData({ ...formData, additionalQualifications: e.target.value })}
            placeholder="List your degrees, certifications, specializations..."
            rows={3}
            maxLength={100}
          />
        </div>

        <div>
          <Label htmlFor="about">About Yourself</Label>
          <Textarea
            id="about"
            value={formData.aboutYourself}
            onChange={(e) => setFormData({ ...formData, aboutYourself: e.target.value })}
            placeholder="Brief introduction about your practice, approach, achievements..."
            rows={4}
            maxLength={200}
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