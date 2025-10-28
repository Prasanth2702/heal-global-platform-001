import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Phone, Globe, Heart, Shield, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import AuthLayout from './AuthLayout';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/Models/Patient';
import '../../styles/form-input-styles.css';
import { isValidPhoneNumber } from '../../utils/phoneValidation';
import { usePopup } from '@/contexts/popup-context';
import TermsConditionsPolicyContent from '../commons/policies/TermsConditionsPolicyContent';
import PrivacyPolicyContent from '../commons/policies/PrivacyPolicyContent';

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

const PatientRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { openPopup } = usePopup();
  const [date, setDate] = useState<Date>();
  const [showManualDate, setShowManualDate] = useState(false);
  const [isTermsAccepted, setTermsAccepted] = useState(false);
  const [isPrivacyAccepted, setPrivacyAccepted] = useState(false);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emergencyContactCountryCode, setEmergencyContactCountryCode] = useState('+91');
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [manualDate, setManualDate] = useState({
    manualYear: '',
    manualMonth: '',
    manualDay: ''
  });



  const [formData, setformData] = useState<Patient>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    avatarUrl: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    userType: 'patient',
    knownAllergies: '',
    currentMedications: '',
    emailAddress: '',
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const validateForm = (formData: Patient) => {
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

    if (!formData.emergencyContactPhone) {
      errors.emergencyContactPhone = "Phone number is required";
      valid = false;
    } else if (!isValidPhoneNumber(formData.emergencyContactPhone)) {
      errors.emergencyContactPhone = "Invalid phone number for Emergency contact";
      valid = false;
    }

    if (!formData.gender) {
      errors.gender = "gender is required";
      valid = false;
    }

    if (!formData.bloodGroup) {
      errors.bloodGroup = "Blood group is required";
      valid = false;
    }

    if (showManualDate) {
      if (!manualDate.manualYear) {
        errors.manualYear = "Year is required";
        valid = false;
      }
      if (!manualDate.manualMonth) {
        errors.manualMonth = "Month is required";
        valid = false;
      }
      if (!manualDate.manualDay) {
        errors.manualDay = "Day is required";
        valid = false;
      }
    } else if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
      valid = false;
    }


    setErrors(errors);

    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      toast({
        title: "Error in registering patient",
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

    if (!isTermsAccepted || !isPrivacyAccepted) {
      toast({
        title: 'Agreement Required',
        description: 'Please accept the terms and privacy policy to continue.',
        variant: 'destructive',
        className: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0'
      });
      return;
    }



    const patientFullData = {
      ...formData,
      phoneNumber: countryCode + phoneNumber,
      emergencyContactPhone: emergencyContactCountryCode + emergencyPhoneNumber,
      dateOfBirth: formData.dateOfBirth
    };

    setformData(patientFullData);

    console.log(patientFullData);

    if (!validateForm(patientFullData)) {
      console.log(errors);
      console.log("validated with errors");
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: patientFullData.emailAddress.toLowerCase(),
      password: password,
      options: {
        data: {
          firstName: patientFullData.firstName,
          lastName: patientFullData.lastName,
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
        first_name: patientFullData.firstName,
        last_name: patientFullData.lastName,
        phone_number: patientFullData.phoneNumber,
        role: 'patient',
        email: patientFullData.emailAddress.toLowerCase()
      })
      .eq('email', patientFullData.emailAddress.toLowerCase());

    if (error) {
      console.error('Update error:', error.message);
    } else {
      console.log('Row updated:', data);
    }

    console.log("date of birth" + patientFullData.dateOfBirth);
    console.log("date of birth from date" + date);

    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .upsert({
        user_id: signUpData.user?.id,
        gender: patientFullData.gender,
        emergency_contact_name: patientFullData.emergencyContactName,
        date_of_birth: date,
        blood_group: patientFullData.bloodGroup,
        emergency_contact_number: patientFullData.emergencyContactPhone,
        known_allergies: patientFullData.knownAllergies,
        current_medications: patientFullData.currentMedications,
      });


    if (patientError) {
      console.error('Update error for patients:', patientError.message);
    } else {
      console.log('Patients row updated:', patientData);
    }

    toast({
      title: '🎉 Registration Successful!',
      description: 'Welcome to NextGen Medical Platform. Redirecting to your dashboard...',
      className: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0'
    });

    setTimeout(() => {
      navigate('/onboarding/patient');
    }, 2000);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && !showManualDate) {
      setDate(selectedDate);
      setformData({
        ...formData,
        dateOfBirth: format(selectedDate, 'yyyy-MM-dd')
      });
    }
  };


  const handleManualDateChange = (updatedManualDate: { manualYear: string; manualMonth: string; manualDay: string }) => {
    if (
      updatedManualDate.manualYear &&
      updatedManualDate.manualMonth &&
      updatedManualDate.manualDay
    ) {
      const monthIndex = months.indexOf(updatedManualDate.manualMonth);
      const dateString = `${updatedManualDate.manualYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(updatedManualDate.manualDay).padStart(2, '0')}`;
      setDate(new Date(dateString));
      setformData(formData => ({
        ...formData,
        dateOfBirth: dateString
      }));
    }
  };

  const termsContent = (
    <>
      <h2 className="font-bold text-lg mb-3">Terms and Conditions</h2>
      <div className="text-gray-700 text-sm space-y-2">
        <p>Your terms and conditions details here...</p>
      </div>
    </>
  );

  const privacyContent = (
    <>
      <h2 className="font-bold text-lg mb-3">Privacy Policy</h2>
      <div className="text-gray-700 text-sm space-y-2">
        <p>Your privacy policy details here...</p>
      </div>
    </>
  );



  return (
    <AuthLayout
      title="Join as Patient"
      description="🌟 Join thousands of patients managing their health digitally with AI-powered insights"
      userType="patient"
    >
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 rounded-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header with icons */}
          <div className="text-center space-y-2">
            <div className="flex justify-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-pink-500" />
              <Shield className="h-6 w-6 text-blue-500" />
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Health Journey Starts Here
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="label-required text-sm font-semibold text-gray-700">First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setformData({ ...formData, firstName: e.target.value })}
                className="mt-2 border-2 focus:border-blue-500 transition-colors bg-white/80"
                placeholder="Enter your first name" minLength={1} maxLength={50}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="label-required text-sm font-semibold text-gray-700">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setformData({ ...formData, lastName: e.target.value })}
                className="mt-2 border-2 focus:border-blue-500 transition-colors bg-white/80"
                placeholder="Enter your last name" minLength={1} maxLength={50}
                required
              />
            </div>
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
            <Label htmlFor="email" className="label-required text-sm font-semibold text-gray-700">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.emailAddress}
              onChange={(e) => setformData({ ...formData, emailAddress: e.target.value })}
              className="mt-2 border-2 focus:border-blue-500 transition-colors bg-white/80"
              placeholder="your.email@example.com"
              required
            />
            {errors.emailAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>
            )}
          </div>

          {/* Phone with Country Code */}
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

          {/* Enhanced Date of Birth */}
          <div>
            <Label className="label-required text-sm font-semibold text-gray-700">Date of Birth</Label>
            <div className="mt-2 space-y-3">
              <div className="flex items-center space-x-4">
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    handleDateSelect(selectedDate);
                    setformData(formData => ({ ...formData, dateOfBirth: e.target.value }));
                  }}
                  disabled={showManualDate}
                  className="mt-2 border-2 focus:border-blue-500 transition-colors"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowManualDate(!showManualDate)}
                  disabled={showManualDate}
                  className="border-2 hover:border-purple-500 bg-white/80"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Manual Entry
                </Button>
              </div>


              {showManualDate && (
                <div className="grid grid-cols-3 gap-3 p-4 bg-white/60 rounded-lg border-2 border-dashed border-purple-300">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Year</Label>
                    <Select
                      value={manualDate.manualYear}
                      onValueChange={(value) => {
                        const updatedManualDate = { ...manualDate, manualYear: value };
                        setManualDate(updatedManualDate);
                        handleManualDateChange(updatedManualDate);
                      }}
                    >
                      <SelectTrigger className="border-2 focus:border-purple-500 bg-white">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.manualYear && (
                      <p className="text-red-500 text-xs mt-1">{errors.manualYear}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Month</Label>
                    <Select
                      value={manualDate.manualMonth}
                      onValueChange={(value) => {
                        const updatedManualDate = { ...manualDate, manualMonth: value };
                        setManualDate(updatedManualDate);
                        handleManualDateChange(updatedManualDate);
                      }}
                    >
                      <SelectTrigger className="border-2 focus:border-purple-500 bg-white">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.manualMonth && (
                      <p className="text-red-500 text-xs mt-1">{errors.manualMonth}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Day</Label>
                    <Select
                      value={manualDate.manualDay}
                      onValueChange={(value) => {
                        const updatedManualDate = { ...manualDate, manualDay: value };
                        setManualDate(updatedManualDate);
                        handleManualDateChange(updatedManualDate);
                      }}
                    >
                      <SelectTrigger className="border-2 focus:border-purple-500 bg-white">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.manualDay && (
                      <p className="text-red-500 text-xs mt-1">{errors.manualDay}</p>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender" className="label-required text-sm font-semibold text-gray-700">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => setformData({ ...formData, gender: value })}>
                <SelectTrigger className="mt-2 border-2 focus:border-blue-500 bg-white/80">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            <div>
              <Label htmlFor="bloodGroup" className="label-required text-sm font-semibold text-gray-700">Blood Group</Label>
              <Select value={formData.bloodGroup} onValueChange={(value) => setformData({ ...formData, bloodGroup: value })}>
                <SelectTrigger className="mt-2 border-2 focus:border-red-500 bg-white/80">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+ 🩸</SelectItem>
                  <SelectItem value="A-">A- 🩸</SelectItem>
                  <SelectItem value="B+">B+ 🩸</SelectItem>
                  <SelectItem value="B-">B- 🩸</SelectItem>
                  <SelectItem value="AB+">AB+ 🩸</SelectItem>
                  <SelectItem value="AB-">AB- 🩸</SelectItem>
                  <SelectItem value="O+">O+ 🩸</SelectItem>
                  <SelectItem value="O-">O- 🩸</SelectItem>
                </SelectContent>
              </Select>
              {errors.bloodGroup && (
                <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>
              )}
            </div>
          </div>

          {/* Emergency Contact with Country Code */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Emergency Contact Information</h3>

            <div>
              <Label htmlFor="emergencyContact" className="label-required text-sm font-semibold text-gray-700">Emergency Contact Name</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContactName}
                onChange={(e) => setformData({ ...formData, emergencyContactName: e.target.value })}
                className="mt-2 border-2 focus:border-orange-500 transition-colors bg-white/80"
                placeholder="Full name of emergency contact" minLength={1} maxLength={50}
                required
              />
            </div>

            <div>
              <Label className="label-required text-sm font-semibold text-gray-700">Emergency Contact Phone</Label>
              <div className="flex mt-2 space-x-2">
                <Select value={emergencyContactCountryCode} onValueChange={(value) => setEmergencyContactCountryCode(value)}>
                  <SelectTrigger className="w-24 border-2 focus:border-orange-500 bg-white/80">
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
                  value={emergencyPhoneNumber}
                  onChange={(e) => setEmergencyPhoneNumber(e.target.value)}
                  className="flex-1 border-2 focus:border-orange-500 transition-colors bg-white/80"
                  placeholder="Emergency contact phone"
                  required
                />
                {errors.emergencyPhoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.emergencyPhoneNumber}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="allergies" className="text-sm font-semibold text-gray-700">Known Allergies</Label>
            <Input
              id="allergies"
              value={formData.knownAllergies}
              onChange={(e) => setformData({ ...formData, knownAllergies: e.target.value })}
              className="mt-2 border-2 focus:border-yellow-500 transition-colors bg-white/80"
              placeholder="Enter any known allergies (e.g., Penicillin, Shellfish)" maxLength={200}
            />
          </div>

          <div>
            <Label htmlFor="currentMedications" className="text-sm font-semibold text-gray-700">Current Medications</Label>
            <Input
              id="currentMedications"
              value={formData.currentMedications}
              onChange={(e) => setformData({ ...formData, currentMedications: e.target.value })}
              className="mt-2 border-2 focus:border-green-500 transition-colors bg-white/80"
              placeholder="List current medications with dosage" maxLength={200}
            />
          </div>

          <div className="space-y-3 p-4 bg-white/60 rounded-lg border-2 border-dashed border-gray-300">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="terms"
                checked={isTermsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="border-2 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
              />
              <Label htmlFor="terms" className="text-sm font-medium">
                I accept the <span className="text-blue-600 font-semibold cursor-pointer hover:underline"
                 onClick={(e) => {
                  e.stopPropagation();
                  openPopup(<TermsConditionsPolicyContent />);
                   }}>
                  Terms and Conditions</span>
              </Label>
            </div>
          
            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacy"
                checked={isPrivacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                className="border-2 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
              />
              <Label htmlFor="privacy" className="text-sm font-medium whitespace-nowrap cursor-pointer">
                I accept the
              </Label>
              <span
                className="text-sm text-blue-600 whitespace-nowrap  font-semibold cursor-pointer hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  openPopup(<PrivacyPolicyContent />);
                }}
              >
                Privacy Policy
              </span>
              <Label htmlFor="privacy" className="text-sm font-medium  cursor-pointer">
                and consent to data processing
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Heart className="mr-2 h-5 w-5" />
            Join NextGen Medical 🚀
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-semibold text-blue-600 hover:text-purple-600 transition-colors"
              onClick={() => navigate("/login/patient")}
            >
              Sign in here →
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default PatientRegistration;