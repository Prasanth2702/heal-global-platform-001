import Footer from '@/pages/alldetails/Footer';
import Header from '@/pages/alldetails/Header';
import { Award, CalendarCheck, Clock, GraduationCap, Hospital, MapIcon, MessageCircle, Phone, Star, Stethoscope, Verified } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

// Updated Doctor interface to match medical_professionals table
interface Doctor {
  id: string;
  user_id: string;
  medical_speciality: string;
  license_number: string;
  years_experience: number;
  consultation_fee: number;
  rating: number;
  total_reviews: number;
  education: any; // jsonb
  certifications: any; // jsonb
  languages_known: string[];
  availability: any; // jsonb
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  graduation_year: number;
  medical_school: string;
  about_yourself: string;
  facility_id: string;
  // Joined fields from profiles table
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  avatar_url?: string;
  // Derived fields
  name?: string;
  role?: string;
  specialization?: string;
  hospital?: string;
  hospitalAddress?: string;
  image?: string;
  experience?: string;
  patients?: string;
}

const DoctorPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialists');
 const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
  // Get unique specialties for filter buttons
  const specialties = ['All Specialists', ...new Set(doctors.map(d => d.medical_speciality))];

  // Stats data - you can calculate these from real data
  const stats = [
    { icon: Stethoscope, label: "Specialists", value: doctors.length.toString() + "+" },
    { icon: Award, label: "Years Experience", value: doctors.reduce((acc, d) => acc + (d.years_experience || 0), 0).toString() + "+" },
    { icon: CalendarCheck, label: "Happy Patients", value: doctors.reduce((acc, d) => acc + (d.total_reviews || 0), 0).toString() + "+" },
    { icon: Hospital, label: "Partner Hospitals", value: "15+" } // You can calculate this from facility_id
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    checkUser();
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
  
    return () => subscription.unsubscribe();
  }, []);
  const handleLogin = (id: string, type: 'doctor' ) => {
  let redirectPath = '';
  
  if (type === 'doctor') {
    redirectPath = `/dashboard/patient/doctor/${createSlug(doctors.find(d => d.id === id)?.name || "")}/${id}`;
  } 
  
  navigate(`/login/patient`, { 
    state: { from: redirectPath } 
  });
};
 const handleViewDoctorProfile = (doctorId: string) => {
    const user = supabase.auth.getUser();
    if (!user) {
      const doctor = doctors.find(d => d.id === doctorId);
      navigate(`/dashboard/patient/doctor/${createSlug(doctor?.name || "")}/${doctorId}`);
    }
  };
  // Fetch doctors from medical_professionals table
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
  try {
    setLoading(true);
    
    // ============================
    // STEP 1: Fetch medical professionals
    // ============================
    const { data: medicalData, error: medicalError } = await supabase
      .from('medical_professionals')
      .select('*');

    if (medicalError) throw medicalError;
    
    if (!medicalData || medicalData.length === 0) {
      setDoctors([]);
      setLoading(false);
      return;
    }

    // ============================
    // STEP 2: Extract IDs for related data
    // ============================
    const userIds = medicalData.map(doc => doc.user_id).filter(id => id);
    const facilityIds = medicalData.map(doc => doc.facility_id).filter(id => id);

    // ============================
    // STEP 3: Fetch profiles in parallel
    // ============================
    let profiles = [];
    if (userIds.length > 0) {
      const profilePromise = supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email, phone_number, avatar_url')
        .in('user_id', userIds);
      
      const { data, error } = await profilePromise;
      if (error) throw error;
      profiles = data || [];
    }

    // ============================
    // STEP 4: Fetch facilities in parallel
    // ============================
    let facilities = [];
    if (facilityIds.length > 0) {
      const facilityPromise = supabase
        .from('facilities')
        .select('id, facility_name, city, state, address')
        .in('id', facilityIds);
      
      const { data, error } = await facilityPromise;
      if (error) throw error;
      facilities = data || [];
    }

    // ============================
    // STEP 5: Create lookup dictionaries
    // ============================
    const profileLookup = profiles.reduce((acc, profile) => {
      acc[profile.user_id] = profile;
      return acc;
    }, {});

    const facilityLookup = facilities.reduce((acc, facility) => {
      acc[facility.id] = facility;
      return acc;
    }, {});

        // ============================
    // STEP 6: Transform and merge data
    // ============================
    const transformedDoctors = medicalData.map(doc => {
      const profile = profileLookup[doc.user_id] || {};
      const facility = facilityLookup[doc.facility_id] || {};
      
      // Build doctor name
      const firstName = profile.first_name || '';
      const lastName = profile.last_name || '';
      const doctorName = `Dr. ${firstName} ${lastName}`.trim();
      
      // Build hospital address
      const hospitalAddress = facility.address || 
        [facility.city, facility.state].filter(Boolean).join(', ') || 
        'Address not available';

      return {
        // Include ALL original fields from doc
        ...doc,  // This is the key fix - spread all original fields first
        
        // Then override/add derived fields
        id: doc.id,
        user_id: doc.user_id,
        facility_id: doc.facility_id,
        
        // Personal info (override/add)
        name: doctorName,
        first_name: firstName,
        last_name: lastName,
        email: profile.email,
        phone_number: profile.phone_number,
        image: profile.avatar_url || `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
        
        // Professional info (override)
        role: doc.medical_speciality ? `${doc.medical_speciality} Specialist` : 'Medical Professional',
        specialization: doc.medical_speciality || 'General Medicine',
        experience: doc.years_experience ? `${doc.years_experience}+ years` : 'N/A',
        patients: `${doc.total_reviews || Math.floor(Math.random() * 1000) + 100}+`,
        
        // Education (override)
        medical_school: doc.medical_school || 'Medical School',
        about: doc.about_yourself || 'No description available',
        
        // Languages & Availability (preserve original)
        languages_known: doc.languages_known || ['English'],
        about_yourself: doc.about_yourself || 'No description available',
        languages: doc.languages_known || ['English'],
        
        // Hospital info (add)
        hospital: facility.facility_name || 'Not Assigned',
        hospitalAddress: hospitalAddress,
      };
    });

    setDoctors(transformedDoctors);
    
  } catch (error) {
    console.error('Error in fetchDoctors:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to load doctor information',
      variant: 'destructive'
    });
  } finally {
    setLoading(false);
  }
};

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchTerm === '' || 
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.medical_speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.hospital?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === 'All Specialists' || 
      doctor.medical_speciality === selectedSpecialty;
    
    return matchesSearch && matchesSpecialty;
  });

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading doctors...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                Meet Our Expert Doctors
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                World-class healthcare professionals dedicated to your well-being
              </p>
              
              {/* Search Bar */}
              <div className="mt-10 max-w-2xl mx-auto">
                <div className="relative group">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by doctor name, specialty, or hospital..."
                    className="w-full px-6 py-4 text-gray-900 bg-white rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
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
                <stat.icon className="text-4xl text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {specialties.slice(0, 5).map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedSpecialty(specialty)}
                className={`px-6 py-2 rounded-full transition-colors duration-300 font-semibold ${
                  selectedSpecialty === specialty
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No doctors found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="group bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl"
                >
                  {/* Image Section */}
                  <div className="relative pt-8 pb-4 flex justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl transform group-hover:scale-105 transition-transform duration-500">
                      <img
                        src={doctor.image || `https://ui-avatars.com/api/?name=${doctor.name}&background=random`}
                        alt={doctor.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    {doctor.is_verified && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Verified className="text-white" size={12} />
                        Verified
                      </div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="p-5">
                    {/* Rating */}
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-lg">
                        <Star className="text-yellow-500 mr-1" size={14} />
                        <span className="font-semibold text-gray-700 text-sm">
                          {doctor.rating?.toFixed(1) || '4.0'}
                        </span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 text-sm">{doctor.patients}</span>
                    </div>

                    {/* Name & Role */}
                    <h2 className="text-xl font-bold text-gray-800 mb-1 text-center">{doctor.name}</h2>
                    <p className="text-blue-600 font-semibold mb-1 text-center text-sm">{doctor.role}</p>
                    <p className="text-gray-500 text-xs mb-3 text-center">{doctor.medical_speciality}</p>

                    {/* Experience Badge */}
                    <div className="flex justify-center mb-3">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                        ⚕️ {doctor.experience}
                      </span>
                    </div>

                    {/* Hospital Info */}
                    <div className="mb-3">
                      <div className="flex items-start gap-2 mb-2">
                        <Hospital className="text-blue-600 mt-1 flex-shrink-0" size={14} />
                        <div className="text-sm">
                          <p className="font-semibold text-gray-800">{doctor.hospital}</p>
                          <p className="text-gray-600 text-xs flex items-center gap-1">
                            <MapIcon className="text-red-500" size={10} />
                            {doctor.hospitalAddress}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="text-green-500" size={12} />
                        <span className="truncate">{doctor.availability}</span>
                      </div>
                    </div>

                    {/* Education */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="text-purple-600" size={14} />
                        <span className="text-xs text-gray-700">{doctor.medical_school || doctor.education}</span>
                      </div>
                    </div>

                    {/* Languages */}
                    {/* <div className="mb-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {(doctor.languages || ['English']).map((lang, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-semibold"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div> */}

                    {/* Consultation Fee */}
                    <div className="mb-4 text-center">
                      <span className="text-lg font-bold text-blue-600">
                        ₹{doctor.consultation_fee || 'N/A'}
                      </span>
                      <span className="text-xs text-gray-500"> / consultation</span>
                    </div>

                    {/* Action Buttons */}
                     <div className="flex items-center gap-2">
                        {!user ? (
    <>
      <Button
        variant="default"
        size="sm"
        onClick={() => handleLogin(doctor.id, 'doctor')}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
      >
        Login Doctor
      </Button>
      </>
  ) : (
    <>
                       <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDoctorProfile(doctor.id)}
                                                        className="flex-1 border-gray-600 text-gray-600 hover:bg-gray-50"
                          >
                            View Doctor Profile
                          </Button>
                          </>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 mt-8">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Help Finding the Right Doctor?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Our healthcare advisors are here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2">
                <Phone />
                Call Us Now
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-colors duration-300 flex items-center justify-center gap-2">
                <MessageCircle />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Add these styles to your global CSS file or create a new one
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

export default DoctorPage;