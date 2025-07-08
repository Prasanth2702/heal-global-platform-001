import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "./AuthLayout";

const PatientRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    emergencyContact: "",
    emergencyPhone: "",
    bloodGroup: "",
    allergies: "",
    currentMedications: "",
    termsAccepted: false,
    privacyAccepted: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted || !formData.privacyAccepted) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms and privacy policy to continue.",
        variant: "destructive"
      });
      return;
    }

    // Mock registration - will connect to Supabase later
    toast({
      title: "Registration Successful!",
      description: "Welcome to NextGen Medical Platform. Redirecting to your dashboard...",
    });
    
    setTimeout(() => {
      navigate("/dashboard/patient");
    }, 2000);
  };

  return (
    <AuthLayout
      title="Patient Registration"
      description="Join thousands of patients managing their health digitally"
      userType="patient"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
              <SelectTrigger>
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
            <Input
              id="emergencyPhone"
              type="tel"
              value={formData.emergencyPhone}
              onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bloodGroup">Blood Group</Label>
          <Select value={formData.bloodGroup} onValueChange={(value) => setFormData({...formData, bloodGroup: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A-">A-</SelectItem>
              <SelectItem value="B+">B+</SelectItem>
              <SelectItem value="B-">B-</SelectItem>
              <SelectItem value="AB+">AB+</SelectItem>
              <SelectItem value="AB-">AB-</SelectItem>
              <SelectItem value="O+">O+</SelectItem>
              <SelectItem value="O-">O-</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="allergies">Known Allergies</Label>
          <Input
            id="allergies"
            value={formData.allergies}
            onChange={(e) => setFormData({...formData, allergies: e.target.value})}
            placeholder="Enter any known allergies"
          />
        </div>

        <div>
          <Label htmlFor="currentMedications">Current Medications</Label>
          <Input
            id="currentMedications"
            value={formData.currentMedications}
            onChange={(e) => setFormData({...formData, currentMedications: e.target.value})}
            placeholder="List current medications"
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
              I accept the Terms and Conditions
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="privacy"
              checked={formData.privacyAccepted}
              onCheckedChange={(checked) => setFormData({...formData, privacyAccepted: checked as boolean})}
            />
            <Label htmlFor="privacy" className="text-sm">
              I accept the Privacy Policy and consent to data processing
            </Label>
          </div>
        </div>

        <Button type="submit" variant="patient" className="w-full" size="lg">
          Register as Patient
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/login/patient")}>
            Sign in here
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default PatientRegistration;