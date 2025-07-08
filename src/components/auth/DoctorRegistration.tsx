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

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialty: "",
    licenseNumber: "",
    graduationYear: "",
    medicalSchool: "",
    experience: "",
    languages: "",
    consultationFee: "",
    qualifications: "",
    about: "",
    termsAccepted: false,
    kycAccepted: false
  });

  const specialties = [
    "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
    "Orthopedic", "Pediatrician", "Gynecologist", "Psychiatrist",
    "Dentist", "Physiotherapist", "Dietician", "Ayurveda Practitioner",
    "Homeopath", "Psychologist", "ENT Specialist", "Ophthalmologist"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted || !formData.kycAccepted) {
      toast({
        title: "Agreement Required",
        description: "Please accept all terms and KYC verification to continue.",
        variant: "destructive"
      });
      return;
    }

    // Mock registration - will connect to Supabase later
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
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>

        <div>
          <Label htmlFor="specialty">Medical Specialty</Label>
          <Select value={formData.specialty} onValueChange={(value) => setFormData({...formData, specialty: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select your specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty.toLowerCase().replace(/\s+/g, '-')}>
                  {specialty}
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
              onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
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
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
            <Input
              id="consultationFee"
              type="number"
              min="0"
              value={formData.consultationFee}
              onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
              placeholder="e.g., 500"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="languages">Languages Spoken</Label>
          <Input
            id="languages"
            value={formData.languages}
            onChange={(e) => setFormData({...formData, languages: e.target.value})}
            placeholder="e.g., English, Hindi, Regional languages"
            required
          />
        </div>

        <div>
          <Label htmlFor="qualifications">Additional Qualifications</Label>
          <Textarea
            id="qualifications"
            value={formData.qualifications}
            onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
            placeholder="List your degrees, certifications, specializations..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="about">About Yourself</Label>
          <Textarea
            id="about"
            value={formData.about}
            onChange={(e) => setFormData({...formData, about: e.target.value})}
            placeholder="Brief introduction about your practice, approach, achievements..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) => setFormData({...formData, termsAccepted: checked as boolean})}
            />
            <Label htmlFor="terms" className="text-sm">
              I accept the Terms and Conditions for Medical Professionals
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="kyc"
              checked={formData.kycAccepted}
              onCheckedChange={(checked) => setFormData({...formData, kycAccepted: checked as boolean})}
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