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
  const [date, setDate] = useState<Date>();
  const [showManualDate, setShowManualDate] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    dateOfBirth: '',
    manualYear: '',
    manualMonth: '',
    manualDay: '',
    gender: '',
    emergencyContact: '',
    emergencyCountryCode: '+1',
    emergencyPhone: '',
    bloodGroup: '',
    allergies: '',
    currentMedications: '',
    termsAccepted: false,
    privacyAccepted: false
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted || !formData.privacyAccepted) {
      toast({
        title: 'Agreement Required',
        description: 'Please accept the terms and privacy policy to continue.',
        variant: 'destructive',
        className: 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0'
      });
      return;
    }

    // Mock registration - will connect to Supabase later
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
    setDate(selectedDate);
    if (selectedDate) {
      setFormData({
        ...formData,
        dateOfBirth: format(selectedDate, 'yyyy-MM-dd')
      });
    }
  };

  const handleManualDateChange = () => {
    if (formData.manualYear && formData.manualMonth && formData.manualDay) {
      const monthIndex = months.indexOf(formData.manualMonth);
      const dateString = `${formData.manualYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(formData.manualDay).padStart(2, '0')}`;
      setFormData({ ...formData, dateOfBirth: dateString });
      setDate(new Date(dateString));
    }
  };

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
              <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="mt-2 border-2 focus:border-blue-500 transition-colors bg-white/80"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="mt-2 border-2 focus:border-blue-500 transition-colors bg-white/80"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="mt-2 border-2 focus:border-blue-500 transition-colors bg-white/80"
              placeholder="your.email@example.com"
              required
            />
          </div>

          {/* Phone with Country Code */}
          <div>
            <Label className="text-sm font-semibold text-gray-700">Phone Number</Label>
            <div className="flex mt-2 space-x-2">
              <Select value={formData.countryCode} onValueChange={(value) => setFormData({...formData, countryCode: value})}>
                <SelectTrigger className="w-24 border-2 focus:border-blue-500 bg-white/80">
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
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="flex-1 border-2 focus:border-blue-500 transition-colors bg-white/80"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Enhanced Date of Birth */}
          <div>
            <Label className="text-sm font-semibold text-gray-700">Date of Birth</Label>
            <div className="mt-2 space-y-3">
              <div className="flex items-center space-x-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal border-2 hover:border-blue-500 bg-white/80",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowManualDate(!showManualDate)}
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
                      value={formData.manualYear} 
                      onValueChange={(value) => {
                        setFormData({...formData, manualYear: value});
                        setTimeout(handleManualDateChange, 100);
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
                  </div>
                  
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Month</Label>
                    <Select 
                      value={formData.manualMonth} 
                      onValueChange={(value) => {
                        setFormData({...formData, manualMonth: value});
                        setTimeout(handleManualDateChange, 100);
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
                  </div>
                  
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Day</Label>
                    <Select 
                      value={formData.manualDay} 
                      onValueChange={(value) => {
                        setFormData({...formData, manualDay: value});
                        setTimeout(handleManualDateChange, 100);
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
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
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
            </div>
            
            <div>
              <Label htmlFor="bloodGroup" className="text-sm font-semibold text-gray-700">Blood Group</Label>
              <Select value={formData.bloodGroup} onValueChange={(value) => setFormData({...formData, bloodGroup: value})}>
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
            </div>
          </div>

          {/* Emergency Contact with Country Code */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Emergency Contact Information</h3>
            
            <div>
              <Label htmlFor="emergencyContact" className="text-sm font-semibold text-gray-700">Emergency Contact Name</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                className="mt-2 border-2 focus:border-orange-500 transition-colors bg-white/80"
                placeholder="Full name of emergency contact"
                required
              />
            </div>
            
            <div>
              <Label className="text-sm font-semibold text-gray-700">Emergency Contact Phone</Label>
              <div className="flex mt-2 space-x-2">
                <Select value={formData.emergencyCountryCode} onValueChange={(value) => setFormData({...formData, emergencyCountryCode: value})}>
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
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                  className="flex-1 border-2 focus:border-orange-500 transition-colors bg-white/80"
                  placeholder="Emergency contact phone"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="allergies" className="text-sm font-semibold text-gray-700">Known Allergies</Label>
            <Input
              id="allergies"
              value={formData.allergies}
              onChange={(e) => setFormData({...formData, allergies: e.target.value})}
              className="mt-2 border-2 focus:border-yellow-500 transition-colors bg-white/80"
              placeholder="Enter any known allergies (e.g., Penicillin, Shellfish)"
            />
          </div>

          <div>
            <Label htmlFor="currentMedications" className="text-sm font-semibold text-gray-700">Current Medications</Label>
            <Input
              id="currentMedications"
              value={formData.currentMedications}
              onChange={(e) => setFormData({...formData, currentMedications: e.target.value})}
              className="mt-2 border-2 focus:border-green-500 transition-colors bg-white/80"
              placeholder="List current medications with dosage"
            />
          </div>

          <div className="space-y-3 p-4 bg-white/60 rounded-lg border-2 border-dashed border-gray-300">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => setFormData({...formData, termsAccepted: checked as boolean})}
                className="border-2 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
              />
              <Label htmlFor="terms" className="text-sm font-medium">
                I accept the <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Terms and Conditions</span>
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="privacy"
                checked={formData.privacyAccepted}
                onCheckedChange={(checked) => setFormData({...formData, privacyAccepted: checked as boolean})}
                className="border-2 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
              />
              <Label htmlFor="privacy" className="text-sm font-medium">
                I accept the <span className="text-blue-600 font-semibold cursor-pointer hover:underline">Privacy Policy</span> and consent to data processing
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