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

const FacilityRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    facilityName: "",
    facilityType: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    licenseNumber: "",
    establishedYear: "",
    totalBeds: "",
    departments: [] as string[],
    emergencyServices: false,
    ambulanceService: false,
    onlineConsultation: false,
    homeVisit: false,
    insuranceAccepted: "",
    operatingHours: "",
    website: "",
    description: "",
    termsAccepted: false,
    kycAccepted: false
  });

  const facilityTypes = [
    "Hospital", "Clinic", "Diagnostic Center", "Pharmacy", "Ayurveda Center",
    "Homeopathy Clinic", "Physiotherapy Center", "Dental Clinic", 
    "Eye Care Center", "Maternity Home", "Nursing Home", "Rehabilitation Center"
  ];

  const departments = [
    "General Medicine", "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
    "Gynecology", "Surgery", "Emergency", "ICU", "Radiology", "Pathology",
    "Dermatology", "ENT", "Ophthalmology", "Psychiatry", "Physiotherapy",
    "Dental", "Ayurveda", "Homeopathy", "Dietetics"
  ];

  const detectLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setFormData(prev => ({
              ...prev,
              latitude: latitude.toString(),
              longitude: longitude.toString()
            }));

            // Mock reverse geocoding - in real app, use a geocoding service
            toast({
              title: "Location Detected",
              description: `GPS coordinates captured: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
            toast({
              title: "Location Detection Failed",
              description: "Unable to detect your location. Please enter manually.",
              variant: "destructive"
            });
          }
        );
      } else {
        toast({
          title: "Geolocation Not Supported",
          description: "Your browser doesn't support location detection.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Location detection error:", error);
    }
  };

  const handleDepartmentToggle = (department: string) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.includes(department)
        ? prev.departments.filter(d => d !== department)
        : [...prev.departments, department]
    }));
  };

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

    if (formData.departments.length === 0) {
      toast({
        title: "Departments Required",
        description: "Please select at least one department/service.",
        variant: "destructive"
      });
      return;
    }

    // Mock registration - will connect to Supabase later
    toast({
      title: "Registration Submitted!",
      description: "Your facility registration is under review. Redirecting to onboarding...",
    });
    
    setTimeout(() => {
      navigate("/onboarding/facility");
    }, 2000);
  };

  return (
    <AuthLayout
      title="Medical Facility Registration"
      description="Register your healthcare facility on our platform"
      userType="facility"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="facilityName">Facility Name</Label>
          <Input
            id="facilityName"
            value={formData.facilityName}
            onChange={(e) => setFormData({...formData, facilityName: e.target.value})}
            placeholder="Enter facility name"
            required
          />
        </div>

        <div>
          <Label htmlFor="facilityType">Facility Type</Label>
          <Select value={formData.facilityType} onValueChange={(value) => setFormData({...formData, facilityType: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select facility type" />
            </SelectTrigger>
            <SelectContent>
              {facilityTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            placeholder="Enter complete address"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => setFormData({...formData, pincode: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button type="button" variant="outline" onClick={detectLocation}>
            📍 Auto-Detect Location
          </Button>
          {formData.latitude && (
            <span className="text-sm text-muted-foreground">
              Location captured ✓
            </span>
          )}
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
            <Label htmlFor="establishedYear">Established Year</Label>
            <Input
              id="establishedYear"
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.establishedYear}
              onChange={(e) => setFormData({...formData, establishedYear: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="totalBeds">Total Beds (if applicable)</Label>
          <Input
            id="totalBeds"
            type="number"
            min="0"
            value={formData.totalBeds}
            onChange={(e) => setFormData({...formData, totalBeds: e.target.value})}
            placeholder="Enter 0 if not applicable"
          />
        </div>

        <div>
          <Label>Departments/Services Available</Label>
          <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-3">
            {departments.map((department) => (
              <div key={department} className="flex items-center space-x-2">
                <Checkbox
                  id={department}
                  checked={formData.departments.includes(department)}
                  onCheckedChange={() => handleDepartmentToggle(department)}
                />
                <Label htmlFor={department} className="text-sm">{department}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Additional Services</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emergency"
                checked={formData.emergencyServices}
                onCheckedChange={(checked) => setFormData({...formData, emergencyServices: checked as boolean})}
              />
              <Label htmlFor="emergency" className="text-sm">24/7 Emergency Services</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ambulance"
                checked={formData.ambulanceService}
                onCheckedChange={(checked) => setFormData({...formData, ambulanceService: checked as boolean})}
              />
              <Label htmlFor="ambulance" className="text-sm">Ambulance Service</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="teleconsult"
                checked={formData.onlineConsultation}
                onCheckedChange={(checked) => setFormData({...formData, onlineConsultation: checked as boolean})}
              />
              <Label htmlFor="teleconsult" className="text-sm">Online Consultation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="homevisit"
                checked={formData.homeVisit}
                onCheckedChange={(checked) => setFormData({...formData, homeVisit: checked as boolean})}
              />
              <Label htmlFor="homevisit" className="text-sm">Home Visit Service</Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="insuranceAccepted">Insurance Partners</Label>
          <Input
            id="insuranceAccepted"
            value={formData.insuranceAccepted}
            onChange={(e) => setFormData({...formData, insuranceAccepted: e.target.value})}
            placeholder="e.g., ICICI Lombard, Star Health, Cashless accepted"
          />
        </div>

        <div>
          <Label htmlFor="operatingHours">Operating Hours</Label>
          <Input
            id="operatingHours"
            value={formData.operatingHours}
            onChange={(e) => setFormData({...formData, operatingHours: e.target.value})}
            placeholder="e.g., Mon-Sat: 9AM-9PM, Sun: 9AM-6PM"
            required
          />
        </div>

        <div>
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({...formData, website: e.target.value})}
            placeholder="https://www.yourfacility.com"
          />
        </div>

        <div>
          <Label htmlFor="description">About Your Facility</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Brief description of your facility, specialties, achievements..."
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
              I accept the Terms and Conditions for Medical Facilities
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

        <Button type="submit" variant="facility" className="w-full" size="lg">
          Submit Facility Registration
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/login/facility")}>
            Sign in here
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default FacilityRegistration;