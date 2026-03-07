import Footer from '@/pages/alldetails/Footer';
import Header from '@/pages/alldetails/Header';
import { Award, CalendarCheck, Clock, GraduationCap, Hospital, MapIcon, MessageCircle, Phone, Star, Stethoscope, Verified } from 'lucide-react';
import React from 'react';

// Doctor data interface
interface Doctor {
  id: number;
  name: string;
  role: string;
  specialization: string;
  hospital: string;
  hospitalAddress: string;
  image: string;
  rating: number;
  experience: string;
  patients: string;
  availability: string;
  education: string;
  about: string;
  languages: string[];
}

const DoctorPage: React.FC = () => {
  // Sample doctor data (expanded to show more doctors)
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Senior Cardiologist",
      specialization: "Interventional Cardiology",
      hospital: "Memorial Medical Center",
      hospitalAddress: "123 Healthcare Ave, Medical District",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.9,
      experience: "15+ years",
      patients: "5000+",
      availability: "Mon-Fri, 9:00 AM - 5:00 PM",
      education: "Harvard Medical School",
      about: "Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in interventional cardiology...",
      languages: ["English", "Spanish", "French"]
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      role: "Neurology Specialist",
      specialization: "Neurological Surgery",
      hospital: "City General Hospital",
      hospitalAddress: "456 Wellness Blvd, Health Park",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
      experience: "12+ years",
      patients: "3500+",
      availability: "Tue-Sat, 10:00 AM - 6:00 PM",
      education: "Johns Hopkins University",
      about: "Dr. Michael Chen specializes in complex neurological conditions and minimally invasive surgical procedures...",
      languages: ["English", "Mandarin", "Cantonese"]
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      role: "Pediatrician",
      specialization: "Child Health Specialist",
      hospital: "Children's Wellness Center",
      hospitalAddress: "789 Kids Lane, Family Zone",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5.0,
      experience: "10+ years",
      patients: "4000+",
      availability: "Mon-Thu, 8:00 AM - 4:00 PM",
      education: "Stanford University",
      about: "Dr. Emily Rodriguez is passionate about providing comprehensive healthcare for children from infancy to adolescence...",
      languages: ["English", "Spanish"]
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      role: "Orthopedic Surgeon",
      specialization: "Sports Medicine",
      hospital: "Orthopedic Specialty Hospital",
      hospitalAddress: "321 Bone Street, Medical Plaza",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      rating: 4.7,
      experience: "20+ years",
      patients: "8000+",
      availability: "Mon-Wed-Fri, 7:00 AM - 3:00 PM",
      education: "Mayo Medical School",
      about: "Dr. James Wilson specializes in sports-related injuries and joint replacement surgeries with a focus on quick recovery...",
      languages: ["English", "German"]
    },
    {
      id: 5,
      name: "Dr. Lisa Patel",
      role: "Dermatologist",
      specialization: "Cosmetic Dermatology",
      hospital: "Skin Care Institute",
      hospitalAddress: "567 Beauty Blvd, Wellness City",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      rating: 4.8,
      experience: "8+ years",
      patients: "3000+",
      availability: "Mon-Wed-Fri, 10:00 AM - 6:00 PM",
      education: "Yale School of Medicine",
      about: "Dr. Lisa Patel specializes in medical and cosmetic dermatology...",
      languages: ["English", "Hindi", "Gujarati"]
    },
    {
      id: 6,
      name: "Dr. Robert Brown",
      role: "Pulmonologist",
      specialization: "Respiratory Medicine",
      hospital: "Lung Care Center",
      hospitalAddress: "789 Breath Lane, Health Park",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      rating: 4.9,
      experience: "18+ years",
      patients: "6000+",
      availability: "Tue-Thu-Sat, 8:00 AM - 4:00 PM",
      education: "University of California",
      about: "Dr. Robert Brown specializes in respiratory and sleep disorders...",
      languages: ["English", "Spanish"]
    },
    {
      id: 7,
      name: "Dr. Maria Garcia",
      role: "Endocrinologist",
      specialization: "Diabetes & Hormones",
      hospital: "Metabolic Health Center",
      hospitalAddress: "321 Hormone Drive, Medical City",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      rating: 4.8,
      experience: "14+ years",
      patients: "4500+",
      availability: "Mon-Fri, 9:00 AM - 5:00 PM",
      education: "Johns Hopkins University",
      about: "Dr. Maria Garcia specializes in diabetes management and hormonal disorders...",
      languages: ["English", "Spanish", "Portuguese"]
    },
    {
      id: 8,
      name: "Dr. David Kim",
      role: "Gastroenterologist",
      specialization: "Digestive Health",
      hospital: "Digestive Wellness Center",
      hospitalAddress: "456 Gut Health Ave, Medical District",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4.7,
      experience: "16+ years",
      patients: "5500+",
      availability: "Mon-Wed-Fri, 8:00 AM - 4:00 PM",
      education: "Stanford University",
      about: "Dr. David Kim specializes in digestive disorders and endoscopic procedures...",
      languages: ["English", "Korean"]
    }
  ];

  // Stats data
  const stats = [
    { icon: Stethoscope, label: "Specialists", value: "50+" },
    { icon: Award, label: "Years Experience", value: "100+" },
    { icon: CalendarCheck, label: "Happy Patients", value: "20K+" },
    { icon: Hospital, label: "Partner Hospitals", value: "15+" }
  ];

  return (
    <>
    <Header/>
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
                  placeholder="Search by doctor name, specialty, or hospital..."
                  className="w-full px-6 py-4 text-gray-900 bg-white rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors duration-300 font-semibold">
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
          <button className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 font-semibold">
            All Specialists
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-md">
            Cardiologists
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-md">
            Neurologists
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-md">
            Pediatricians
          </button>
          <button className="px-6 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-md">
            Orthopedics
          </button>
        </div>
      </div>

      {/* Doctors Grid - Updated with responsive layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl"
            >
              {/* Image Section - Circular design */}
              <div className="relative pt-8 pb-4 flex justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl transform group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Verified className="text-white" size={12} />
                  Verified
                </div>
              </div>

              {/* Info Section */}
              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-lg">
                    <Star className="text-yellow-500 mr-1" size={14} />
                    <span className="font-semibold text-gray-700 text-sm">{doctor.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 text-sm">{doctor.patients} patients</span>
                </div>

                {/* Name & Role */}
                <h2 className="text-xl font-bold text-gray-800 mb-1 text-center">{doctor.name}</h2>
                <p className="text-blue-600 font-semibold mb-1 text-center text-sm">{doctor.role}</p>
                <p className="text-gray-500 text-xs mb-3 text-center">{doctor.specialization}</p>

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
                    <span className="text-xs text-gray-700">{doctor.education}</span>
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {doctor.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-semibold"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-300 font-semibold flex items-center justify-center gap-1 text-sm">
                    <CalendarCheck size={14} />
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
    <Footer/>
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