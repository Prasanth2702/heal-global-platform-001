import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Phone, Calendar, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  location: string;
  distance: string;
  consultationFee: number;
  availability: string;
  hospital: string;
  image: string;
}

const DoctorSearch = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const specialties = [
    "General Physician", "Cardiologist", "Dermatologist", "Neurologist",
    "Orthopedic", "Pediatrician", "Gynecologist", "Psychiatrist",
    "Dentist", "Physiotherapist", "Dietician", "Ophthalmologist"
  ];

  // Mock data - will be replaced with real data from Supabase
  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.8,
      experience: "15 years",
      location: "Apollo Hospital, Sector 26",
      distance: "2.3 km",
      consultationFee: 800,
      availability: "Available Today",
      hospital: "Apollo Hospital",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "2", 
      name: "Dr. Michael Chen",
      specialty: "Dermatologist",
      rating: 4.6,
      experience: "12 years",
      location: "Fortis Hospital, Sector 62",
      distance: "3.1 km",
      consultationFee: 600,
      availability: "Next Available: Tomorrow 10 AM",
      hospital: "Fortis Hospital",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "3",
      name: "Dr. Priya Sharma",
      specialty: "Pediatrician",
      rating: 4.9,
      experience: "18 years",
      location: "Max Hospital, Sector 19",
      distance: "1.8 km",
      consultationFee: 700,
      availability: "Available Today",
      hospital: "Max Hospital",
      image: "https://images.unsplash.com/photo-1594824275948-b1ad70b45c6b?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    const matchesLocation = !locationFilter || doctor.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast({
            title: "Location Detected",
            description: "Searching for doctors near your location...",
          });
          // In real app, use coordinates to filter nearby doctors
        },
        () => {
          toast({
            title: "Location Access Denied",
            description: "Please allow location access or enter your area manually.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleBookAppointment = (doctor: Doctor) => {
    toast({
      title: "Booking Appointment",
      description: `Redirecting to book appointment with ${doctor.name}...`,
    });
    // Navigate to appointment booking page
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search">Search Doctors, Hospitals, or Specialties</Label>
            <Input
              id="search"
              placeholder="Enter doctor name, specialty, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={detectLocation} variant="outline">
              <MapPin className="mr-2 h-4 w-4" />
              Near Me
            </Button>
            <Button 
              onClick={() => setShowFilters(!showFilters)} 
              variant="outline"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialty">Specialty</Label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Specialties</SelectItem>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location/Area</Label>
                  <Input
                    id="location"
                    placeholder="Enter area, hospital, or landmark"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {filteredDoctors.length} Doctor{filteredDoctors.length !== 1 ? 's' : ''} Found
          </h3>
          <Select defaultValue="distance">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Sort by Distance</SelectItem>
              <SelectItem value="rating">Sort by Rating</SelectItem>
              <SelectItem value="fee">Sort by Fee</SelectItem>
              <SelectItem value="availability">Sort by Availability</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Doctor Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="text-lg font-semibold">{doctor.name}</h4>
                        <p className="text-muted-foreground">{doctor.specialty}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{doctor.rating}</span>
                        <span className="text-muted-foreground">• {doctor.experience}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {doctor.location} • {doctor.distance}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {doctor.availability}
                        </Badge>
                        <span className="font-medium text-green-600">
                          ₹{doctor.consultationFee} Consultation
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Button>
                        <Button 
                          variant="patient" 
                          size="sm"
                          onClick={() => handleBookAppointment(doctor)}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Appointment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No doctors found</h3>
                <p>Try adjusting your search criteria or location filters.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;