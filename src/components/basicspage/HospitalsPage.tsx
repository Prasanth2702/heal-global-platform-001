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
import React from 'react';

// Hospital data interface
interface Hospital {
  id: number;
  name: string;
  type: string;
  image: string;
  rating: number;
  established: string;
  beds: number;
  departments: string[];
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website: string;
  emergencyServices: boolean;
  ambulanceService: boolean;
  insurancePartners: string[];
  about: string;
  doctorsCount: number;
  staffCount: number;
}

const HospitalsPage: React.FC = () => {
  // Sample hospital data
  const hospitals: Hospital[] = [
    {
      id: 1,
      name: "Memorial Medical Center",
      type: "Multi-Specialty Hospital",
      image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500&auto=format",
      rating: 4.8,
      established: "1985",
      beds: 350,
      departments: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Oncology"],
      address: "123 Healthcare Ave",
      city: "Medical District",
      state: "NY",
      phone: "+1 (555) 123-4567",
      email: "contact@memorialmedical.com",
      website: "www.memorialmedical.com",
      emergencyServices: true,
      ambulanceService: true,
      insurancePartners: ["Blue Cross", "Aetna", "Cigna", "UnitedHealth"],
      about: "Memorial Medical Center is a leading healthcare institution with state-of-the-art facilities and a team of world-class medical professionals dedicated to patient care.",
      doctorsCount: 150,
      staffCount: 850
    },
    {
      id: 2,
      name: "City General Hospital",
      type: "Teaching Hospital",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format",
      rating: 4.6,
      established: "1972",
      beds: 500,
      departments: ["Emergency Medicine", "Surgery", "Internal Medicine", "Radiology", "Pathology"],
      address: "456 Wellness Blvd",
      city: "Health Park",
      state: "CA",
      phone: "+1 (555) 234-5678",
      email: "info@citygeneral.com",
      website: "www.citygeneral.com",
      emergencyServices: true,
      ambulanceService: true,
      insurancePartners: ["Blue Shield", "Kaiser", "Medi-Cal", "Cigna"],
      about: "City General Hospital is a premier teaching hospital affiliated with State University Medical School, offering comprehensive healthcare services and medical education.",
      doctorsCount: 200,
      staffCount: 1200
    },
    {
      id: 3,
      name: "Children's Wellness Center",
      type: "Pediatric Specialty Hospital",
      image: "https://images.unsplash.com/photo-1632833232430-3c7b1c3f5d4a?w=500&auto=format",
      rating: 4.9,
      established: "1995",
      beds: 150,
      departments: ["Pediatric Cardiology", "Neonatology", "Pediatric Surgery", "Child Psychology", "Pediatric Oncology"],
      address: "789 Kids Lane",
      city: "Family Zone",
      state: "TX",
      phone: "+1 (555) 345-6789",
      email: "care@childrenswellness.org",
      website: "www.childrenswellness.org",
      emergencyServices: true,
      ambulanceService: true,
      insurancePartners: ["Children's Health Insurance", "Blue Cross", "Aetna"],
      about: "Dedicated exclusively to children's health, our center provides compassionate, family-centered care in a child-friendly environment.",
      doctorsCount: 80,
      staffCount: 400
    },
    {
      id: 4,
      name: "Orthopedic Specialty Hospital",
      type: "Orthopedic Center of Excellence",
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500&auto=format",
      rating: 4.7,
      established: "2000",
      beds: 120,
      departments: ["Joint Replacement", "Sports Medicine", "Spine Surgery", "Physical Therapy", "Rheumatology"],
      address: "321 Bone Street",
      city: "Medical Plaza",
      state: "FL",
      phone: "+1 (555) 456-7890",
      email: "info@orthopedicspecialty.com",
      website: "www.orthopedicspecialty.com",
      emergencyServices: true,
      ambulanceService: false,
      insurancePartners: ["Medicare", "Blue Cross", "UnitedHealth", "Cigna"],
      about: "Specializing in orthopedic care, our hospital offers advanced surgical and non-surgical treatments for musculoskeletal conditions.",
      doctorsCount: 60,
      staffCount: 300
    },
    {
      id: 5,
      name: "Heart & Vascular Institute",
      type: "Cardiac Specialty Hospital",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&auto=format",
      rating: 4.9,
      established: "2005",
      beds: 200,
      departments: ["Interventional Cardiology", "Cardiac Surgery", "Vascular Medicine", "Cardiac Rehabilitation", "Electrophysiology"],
      address: "567 Heart Drive",
      city: "Medical City",
      state: "IL",
      phone: "+1 (555) 567-8901",
      email: "care@heartvascular.org",
      website: "www.heartvascular.org",
      emergencyServices: true,
      ambulanceService: true,
      insurancePartners: ["Blue Cross", "Aetna", "Cigna", "Medicare"],
      about: "A center of excellence for cardiovascular care, offering cutting-edge treatments and comprehensive heart health programs.",
      doctorsCount: 90,
      staffCount: 450
    },
    {
      id: 6,
      name: "NeuroScience Institute",
      type: "Neurology & Neurosurgery",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=500&auto=format",
      rating: 4.8,
      established: "2010",
      beds: 180,
      departments: ["Neurosurgery", "Neurology", "Stroke Care", "Epilepsy Center", "Movement Disorders"],
      address: "789 Brain Avenue",
      city: "Health Park",
      state: "MA",
      phone: "+1 (555) 678-9012",
      email: "info@neuroscience.edu",
      website: "www.neuroscience.edu",
      emergencyServices: true,
      ambulanceService: true,
      insurancePartners: ["Blue Cross", "Harvard Pilgrim", "Tufts", "Medicare"],
      about: "A specialized institute dedicated to disorders of the brain and nervous system, combining research with clinical excellence.",
      doctorsCount: 75,
      staffCount: 350
    },
    {
      id: 7,
      name: "Women's Health Pavilion",
      type: "Women's Specialty Hospital",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=500&auto=format",
      rating: 4.7,
      established: "2008",
      beds: 130,
      departments: ["Obstetrics", "Gynecology", "Maternal-Fetal Medicine", "Breast Health", "Women's Wellness"],
      address: "432 Rose Lane",
      city: "Wellness City",
      state: "WA",
      phone: "+1 (555) 789-0123",
      email: "care@womenshealth.org",
      website: "www.womenshealth.org",
      emergencyServices: true,
      ambulanceService: true,
      insurancePartners: ["Blue Cross", "Kaiser", "Cigna", "Premera"],
      about: "Comprehensive healthcare for women at every stage of life, from adolescence to menopause and beyond.",
      doctorsCount: 70,
      staffCount: 320
    },
    {
      id: 8,
      name: "Cancer Care Center",
      type: "Oncology Specialty Hospital",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format",
      rating: 4.9,
      established: "2015",
      beds: 160,
      departments: ["Medical Oncology", "Radiation Oncology", "Surgical Oncology", "Palliative Care", "Oncology Research"],
      address: "987 Hope Street",
      city: "Medical District",
      state: "PA",
      phone: "+1 (555) 890-1234",
      email: "patient@cancercare.org",
      website: "www.cancercare.org",
      emergencyServices: false,
      ambulanceService: true,
      insurancePartners: ["Blue Cross", "Aetna", "Cigna", "Medicare", "Medicaid"],
      about: "A comprehensive cancer center providing personalized treatment plans and supportive care for patients and families.",
      doctorsCount: 65,
      staffCount: 280
    }
  ];

  // Stats data
  const stats = [
    { icon: Building2, label: "Partner Hospitals", value: "25+" },
    { icon: Award, label: "Years of Excellence", value: "100+" },
    { icon: Users, label: "Healthcare Staff", value: "5000+" },
    { icon: Bed, label: "Total Beds", value: "2000+" }
  ];

  return (
    <>
    <Header/>
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
                  placeholder="Search by hospital name, city, or specialty..."
                  className="w-full px-6 py-4 text-gray-900 bg-white rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-colors duration-300 font-semibold">
                  Search
                </button>
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
          <button className="px-6 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors duration-300 font-semibold">
            All Hospitals
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-md">
            Multi-Specialty
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-md">
            Cardiac Care
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-md">
            Children's Hospital
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-md">
            Teaching Hospitals
          </button>
        </div>
      </div>

      {/* Hospitals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600">
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Verified Badge */}
                <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Shield className="text-white" size={12} />
                  Verified
                </div>

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
                    <span className="font-semibold text-gray-700 text-sm">{hospital.rating}</span>
                  </div>
                  <span className="text-gray-600 text-sm">Est. {hospital.established}</span>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 mb-3">
                  <MapIcon className="text-red-500 mt-1 flex-shrink-0" size={14} />
                  <p className="text-gray-600 text-sm">
                    {hospital.address}, {hospital.city}, {hospital.state}
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
                    <span className="text-xs font-semibold text-gray-700">{hospital.doctorsCount} Doctors</span>
                  </div>
                  <div className="text-center">
                    <Stethoscope className="text-emerald-600 mx-auto mb-1" size={16} />
                    <span className="text-xs font-semibold text-gray-700">{hospital.departments.length} Depts</span>
                  </div>
                </div>

                {/* Departments */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {hospital.departments.slice(0, 3).map((dept, idx) => (
                      <span
                        key={idx}
                        className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold"
                      >
                        {dept}
                      </span>
                    ))}
                    {hospital.departments.length > 3 && (
                      <span className="text-xs text-gray-500 self-center">
                        +{hospital.departments.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Insurance Partners */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Insurance Partners:</p>
                  <div className="flex flex-wrap gap-1">
                    {hospital.insurancePartners.slice(0, 2).map((insurance, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        {insurance}
                      </span>
                    ))}
                    {hospital.insurancePartners.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{hospital.insurancePartners.length - 2}
                      </span>
                    )}
                  </div>
                </div>

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

                {/* Action Button */}
                <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors duration-300 font-semibold flex items-center justify-center gap-2 text-sm">
                  <Building2 size={14} />
                  View Hospital Details
                </button>
              </div>
            </div>
          ))}
        </div>
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
    <Footer/>
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