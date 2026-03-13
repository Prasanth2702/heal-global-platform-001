import Footer from '@/pages/alldetails/Footer';
import Header from '@/pages/alldetails/Header';
import { 
  Award, 
  Building2, 
  CalendarCheck, 
  Clock, 
  Phone, 
  Star, 
  Stethoscope, 
  MapIcon, 
  Mail, 
  Globe, 
  Users, 
  Bed, 
  Ambulance,
  Heart,
  Shield,
  MessageCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

// Updated Hospital interface to match facilities table
interface Hospital {
  id: string;
  admin_user_id: string;
  facility_name: string;
  facility_type: string;
  license_number: string;
  // address: any; // jsonb
  additional_services: any; // jsonb
  operating_hours: any; // jsonb
  rating: number;
  total_reviews: number;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  latitude: number;
  longitude: number;
  established_year: number;
  website: string;
  insurance_partners: string[];
  departments: any; // jsonb
  total_beds: number;
  about_facility: string;
  city: string;
  state: string;
  pincode: number;
  
  // Derived fields for display
  image?: string;
  doctorsCount?: number;
  staffCount?: number;
  name?: string;
  type?: string;
  established?: string;
  beds?: number;
  address?: string;
  phone?: string;
  email?: string;
  emergencyServices?: boolean;
  ambulanceService?: boolean;
  about?: string;
}

const HospitalsPage: React.FC = () => {
  const { toast } = useToast();
  // const [hospitals, setHospitals] = useState<Hospital[]>([]);
   const [facilities, setFacilities] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Hospitals');
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
 const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
  // Get unique facility types for filter buttons
  const facilityTypes = ['All Hospitals', ...new Set(facilities.map(h => h.facility_type))];

  // Stats data - calculated from real data
  const stats = [
    { icon: Building2, label: "Partner Hospitals", value: facilities.length.toString() + "+" },
    { icon: Award, label: "Years of Excellence", value: "100+" }, // Calculate from established_year
    { icon: Users, label: "Healthcare Staff", value: "5000+" }, // Need from staff table
    { icon: Bed, label: "Total Beds", value: facilities.reduce((acc, h) => acc + (h.total_beds || 0), 0).toString() + "+" }
  ];

  useEffect(() => {
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };
  checkUser();
}, []);

const handleLogin = (id: string, type: 'hospital') => {
  let redirectPath = '';
  
  if (type === 'hospital') {
    redirectPath = `/dashboard/patient/facility/${createSlug(facilities.find(f => f.id === id)?.facility_name || "")}/${id}`;
  } 
  
  navigate(`/login/patient`, { 
    state: { from: redirectPath } 
  });
};

const handleViewHospitalDetails = (facilityId: string) => {
  const facility = facilities.find(f => f.id === facilityId);
  navigate(`/dashboard/patient/facility/${createSlug(facility?.facility_name || "")}/${facilityId}`, {
    state: { activeTab: 'overview', from: 'search' }
  });
};

  // Fetch hospitals from facilities table
  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      
      // ============================
      // STEP 1: Fetch facilities
      // ============================
      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from('facilities')
        .select('*');

      if (facilitiesError) throw facilitiesError;
      
      if (!facilitiesData || facilitiesData.length === 0) {
        setFacilities([]);
        setLoading(false);
        return;
      }

      // ============================
      // STEP 2: Extract admin user IDs
      // ============================
      const adminUserIds = facilitiesData.map(fac => fac.admin_user_id).filter(id => id);

      // ============================
      // STEP 3: Fetch admin profiles (optional - for contact info)
      // ============================
      let adminProfiles = [];
      if (adminUserIds.length > 0) {
        const { data, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, email, phone_number')
          .in('user_id', adminUserIds);

        if (profilesError) throw profilesError;
        adminProfiles = data || [];
      }

      // ============================
      // STEP 4: Create lookup dictionary for admin profiles
      // ============================
      const adminProfileLookup = adminProfiles.reduce((acc, profile) => {
        acc[profile.user_id] = profile;
        return acc;
      }, {});

      // ============================
      // STEP 5: Transform and merge data
      // ============================
      const transformedHospitals: Hospital[] = facilitiesData.map(facility => {
        const adminProfile = adminProfileLookup[facility.admin_user_id] || {};
        
        // Parse address if it's JSON
        let addressString = '';
        if (facility.address) {
          if (typeof facility.address === 'object') {
            addressString = Object.values(facility.address).join(', ');
          } else {
            addressString = String(facility.address);
          }
        }

        return {
          // Include ALL original fields
          ...facility,
          
          // Add derived fields for display
          id: facility.id,
          name: facility.facility_name,
          type: facility.facility_type,
          image: `https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&auto=format`, // Default image
          rating: facility.rating || 4.5,
          established: facility.established_year?.toString() || 'N/A',
          beds: facility.total_beds || 0,
          address: addressString,
          city: facility.city || '',
          state: facility.state || '',
          phone: adminProfile.phone_number || 'Contact hospital',
          email: adminProfile.email || 'info@hospital.com',
          website: facility.website || '#',
          emergencyServices: facility.additional_services?.emergency || true,
          ambulanceService: facility.additional_services?.ambulance || false,
          insurancePartners: facility.insurance_partners ? 
            (typeof facility.insurance_partners === 'string' ? 
              facility.insurance_partners.split(',') : 
              facility.insurance_partners) : 
            [],
          departments: facility.departments ? 
            (typeof facility.departments === 'object' ? 
              Object.values(facility.departments) : 
              []) : 
            [],
          about: facility.about_facility || 'No description available',
          doctorsCount: 0, // Need to fetch from staff/medical_professionals table
          staffCount: 0, // Need to fetch from staff table
        };
      });

      setFacilities(transformedHospitals);
      
    } catch (error: any) {
      console.error('Error fetching hospitals:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load hospital data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  

  // Filter hospitals based on search and type
  const filteredHospitals = facilities.filter(hospital => {
    const matchesSearch = searchTerm === '' || 
      hospital.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.facility_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'All Hospitals' || 
      hospital.facility_type === selectedType;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading hospitals...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Rest of your JSX remains the same, but update these parts:

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                Leading Healthcare Facilities
              </h1>
              <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto">
                Discover world-class hospitals and medical centers committed to excellence in patient care
              </p>
              
              {/* Search Bar */}
              <div className="mt-10 max-w-2xl mx-auto">
                <div className="relative group">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by hospital name, city, or specialty..."
                    className="w-full px-6 py-4 text-gray-900 bg-white rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-transform duration-300"
              >
                <stat.icon className="text-4xl text-emerald-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {facilityTypes.slice(0, 5).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 rounded-full transition-colors duration-300 font-semibold ${
                  selectedType === type
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Hospitals Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {filteredHospitals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No hospitals found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="group bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl"
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600">
                    {/* <img
                      src={hospital.image}
                      alt={hospital.name}
                      className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                    /> */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Verified Badge */}
                    {hospital.is_verified && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Shield className="text-white" size={12} />
                        Verified
                      </div>
                    )}

                    {/* Emergency Services Badge */}
                    {hospital.emergencyServices && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Heart className="text-white" size={12} />
                        24/7 Emergency
                      </div>
                    )}

                    {/* Hospital Name Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg truncate">{hospital.name}</h3>
                      <p className="text-white/90 text-sm truncate">{hospital.type}</p>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="p-5">
                    {/* Rating & Established */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-lg">
                        <Star className="text-yellow-500 mr-1" size={14} />
                        <span className="font-semibold text-gray-700 text-sm">{hospital.rating?.toFixed(1) || '4.5'}</span>
                      </div>
                      <span className="text-gray-600 text-sm">Est. {hospital.established}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2 mb-3">
                      <MapIcon className="text-red-500 mt-1 flex-shrink-0" size={14} />
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {hospital.address}, {hospital.city}, {hospital.state} {hospital.pincode}
                      </p>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center">
                        <Bed className="text-blue-600 mx-auto mb-1" size={16} />
                        <span className="text-xs font-semibold text-gray-700">{hospital.beds} Beds</span>
                      </div>
                      <div className="text-center">
                        <Users className="text-purple-600 mx-auto mb-1" size={16} />
                        <span className="text-xs font-semibold text-gray-700">{hospital.doctorsCount || 'N/A'} Doctors</span>
                      </div>
                      <div className="text-center">
                        <Stethoscope className="text-emerald-600 mx-auto mb-1" size={16} />
                        <span className="text-xs font-semibold text-gray-700">{hospital.departments?.length || 0} Depts</span>
                      </div>
                    </div>

                    {/* Departments */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {(hospital.departments || []).slice(0, 3).map((dept: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold"
                          >
                            {dept}
                          </span>
                        ))}
                        {(hospital.departments?.length || 0) > 3 && (
                          <span className="text-xs text-gray-500 self-center">
                            +{(hospital.departments?.length || 0) - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Insurance Partners */}
                    {/* <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Insurance Partners:</p>
                      <div className="flex flex-wrap gap-1">
                        {(hospital.insurancePartners || []).slice(0, 2).map((insurance: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                          >
                            {insurance}
                          </span>
                        ))}
                        {(hospital.insurancePartners?.length || 0) > 2 && (
                          <span className="text-xs text-gray-500">
                            +{(hospital.insurancePartners?.length || 0) - 2}
                          </span>
                        )}
                      </div>
                    </div> */}

                    {/* Contact Buttons */}
                    <div className="flex gap-2 mb-3">
                      <a href={`tel:${hospital.phone}`} className="flex-1 border border-emerald-600 text-emerald-600 px-2 py-2 rounded-xl hover:bg-emerald-50 transition-colors duration-300 font-semibold flex items-center justify-center gap-1 text-xs">
                        <Phone size={12} />
                        Call
                      </a>
                      <a href={`mailto:${hospital.email}`} className="flex-1 border border-emerald-600 text-emerald-600 px-2 py-2 rounded-xl hover:bg-emerald-50 transition-colors duration-300 font-semibold flex items-center justify-center gap-1 text-xs">
                        <Mail size={12} />
                        Email
                      </a>
                    </div>
   <div className="flex items-center gap-2">
  {!user ? (
    <Button
      variant="default"
      size="sm"
      onClick={() => handleLogin(hospital.id, 'hospital')}
      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
    >
      <Building2 size={14} className="mr-1" />
      Login to View Details
    </Button>
  ) : (
    <Button
      variant="outline"
      size="sm"
      onClick={() => handleViewHospitalDetails(hospital.id)}
      className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
    >
      <Building2 size={14} className="mr-1" />
      View Hospital Details
    </Button>
  )}
</div>

                    {/* Action Button */}
                    {/* <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors duration-300 font-semibold flex items-center justify-center gap-2 text-sm">
                      <Building2 size={14} />
                      View Hospital Details
                    </button> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 mt-8">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Partner with Leading Healthcare Facilities
            </h2>
            <p className="text-xl mb-8 text-emerald-100">
              Join our network of top-tier hospitals and medical centers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2">
                <Building2 />
                Register Your Facility
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-emerald-600 transition-colors duration-300 flex items-center justify-center gap-2">
                <MessageCircle />
                Contact Partnership Team
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Add these styles to your global CSS file
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 1s ease-out;
  }

  .bg-grid-white {
    background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 30px 30px;
  }
`;

export default HospitalsPage;