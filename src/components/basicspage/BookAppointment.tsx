import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '@/pages/alldetails/Footer';
import Header from '@/pages/alldetails/Header';
import { 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Hospital,
  Stethoscope,
  FileText,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Star,
  Video,
  Building2,
  Scissors,
  Pill,
  HeartPulse,
  Shield,
  MessageCircle,
  X
} from 'lucide-react';

// Types
interface Doctor {
  id: number;
  name: string;
  specialization: string;
  hospital: string;
  image: string;
  rating: number;
  experience: string;
  fee: number;
  availableDays: string[];
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface AppointmentDetails {
  doctorId: number | null;
  date: string | null;
  timeSlot: string | null;
  appointmentType: 'in-person' | 'video' | 'home-visit';
  patientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  reason: string;
  insuranceProvider: string;
  insuranceId: string;
  isNewPatient: boolean;
}

const BookAppointment: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Mock doctors data
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      hospital: "Memorial Medical Center",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.9,
      experience: "15 years",
      fee: 150,
      availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"]
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Neurologist",
      hospital: "City General Hospital",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
      experience: "12 years",
      fee: 180,
      availableDays: ["Tue", "Wed", "Thu", "Fri", "Sat"]
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialization: "Pediatrician",
      hospital: "Children's Wellness Center",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5.0,
      experience: "10 years",
      fee: 130,
      availableDays: ["Mon", "Tue", "Wed", "Thu"]
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialization: "Orthopedic Surgeon",
      hospital: "Orthopedic Specialty Hospital",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      rating: 4.7,
      experience: "20 years",
      fee: 200,
      availableDays: ["Mon", "Wed", "Fri"]
    }
  ];

  // Mock time slots
  const generateTimeSlots = (date: string): TimeSlot[] => {
    const slots = [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
      "12:00 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
      "04:30 PM", "05:00 PM"
    ];
    
    return slots.map((time, index) => ({
      id: `slot-${index}`,
      time,
      available: Math.random() > 0.3 // Random availability for demo
    }));
  };

  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>({
    doctorId: null,
    date: null,
    timeSlot: null,
    appointmentType: 'in-person',
    patientInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    reason: '',
    insuranceProvider: '',
    insuranceId: '',
    isNewPatient: true
  });

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setTimeSlots(generateTimeSlots(date));
    setSelectedSlot(null);
  };

  // Generate next 7 days for date selection
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const fullDate = date.toISOString().split('T')[0];
      
      days.push({ dayName, dayNumber, month, fullDate });
    }
    
    return days;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppointmentDetails(prev => ({
      ...prev,
      patientInfo: {
        ...prev.patientInfo,
        [name]: value
      }
    }));
  };

  // Handle appointment type selection
  const handleAppointmentTypeSelect = (type: 'in-person' | 'video' | 'home-visit') => {
    setAppointmentDetails(prev => ({ ...prev, appointmentType: type }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
    
    // Simulate API call
    setTimeout(() => {
      navigate('/appointments/success');
    }, 3000);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const days = getNextDays();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-600">
              <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/doctors')}>Doctors</span>
              <ChevronRight size={16} className="mx-2" />
              <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/doctors')}>Select Doctor</span>
              <ChevronRight size={16} className="mx-2" />
              <span className="font-semibold text-blue-600">Book Appointment</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Steps */}
            <div className="lg:col-span-2">
              {/* Progress Steps */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <div className="flex justify-between items-center">
                  {['Select Doctor', 'Choose Time', 'Patient Info', 'Confirm'].map((step, index) => (
                    <div key={step} className="flex flex-col items-center relative flex-1">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                          ${currentStep > index + 1 ? 'bg-green-500 text-white' : 
                            currentStep === index + 1 ? 'bg-blue-600 text-white' : 
                            'bg-gray-200 text-gray-600'}`}
                      >
                        {currentStep > index + 1 ? <CheckCircle size={20} /> : index + 1}
                      </div>
                      <span className={`text-xs mt-2 font-medium
                        ${currentStep === index + 1 ? 'text-blue-600' : 'text-gray-600'}`}>
                        {step}
                      </span>
                      {index < 3 && (
                        <div className={`absolute top-5 left-[60%] w-[80%] h-[2px] 
                          ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Select Doctor */}
              {currentStep === 1 && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Select a Doctor</h2>
                  
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setAppointmentDetails(prev => ({ ...prev, doctorId: doctor.id }));
                        }}
                        className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                          ${selectedDoctor?.id === doctor.id 
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                      >
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
                        />
                        
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">{doctor.name}</h3>
                            <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-lg">
                              <Star size={14} className="text-yellow-500 mr-1" />
                              <span className="text-sm font-semibold">{doctor.rating}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-blue-600 font-semibold">{doctor.specialization}</p>
                          
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <Hospital size={14} />
                            <span>{doctor.hospital}</span>
                            <span className="text-gray-400">•</span>
                            <Stethoscope size={14} />
                            <span>Exp: {doctor.experience}</span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex gap-1">
                              {doctor.availableDays.map((day) => (
                                <span key={day} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                  {day}
                                </span>
                              ))}
                            </div>
                            <span className="font-bold text-blue-600">${doctor.fee}</span>
                          </div>
                        </div>
                        
                        {selectedDoctor?.id === doctor.id && (
                          <CheckCircle size={24} className="text-green-500 ml-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Choose Date & Time */}
              {currentStep === 2 && selectedDoctor && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Date & Time</h2>
                  
                  {/* Date Selection */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-gray-700 mb-4">Available Dates</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {days.map((day) => (
                        <button
                          key={day.fullDate}
                          onClick={() => handleDateSelect(day.fullDate)}
                          className={`p-3 rounded-xl border-2 transition-all
                            ${selectedDate === day.fullDate
                              ? 'border-blue-600 bg-blue-50 text-blue-600'
                              : 'border-gray-200 hover:border-blue-300'}`}
                        >
                          <div className="text-xs text-gray-500">{day.dayName}</div>
                          <div className="text-lg font-bold">{day.dayNumber}</div>
                          <div className="text-xs text-gray-500">{day.month}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-4">Available Time Slots</h3>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.id}
                            disabled={!slot.available}
                            onClick={() => {
                              setSelectedSlot(slot);
                              setAppointmentDetails(prev => ({ 
                                ...prev, 
                                date: selectedDate,
                                timeSlot: slot.time 
                              }));
                            }}
                            className={`p-2 rounded-lg border-2 transition-all text-sm
                              ${!slot.available 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                                : selectedSlot?.id === slot.id
                                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                                  : 'border-gray-200 hover:border-blue-300'}`}
                          >
                            <Clock size={14} className="mx-auto mb-1" />
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Patient Information */}
              {currentStep === 3 && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Information</h2>
                  
                  <form className="space-y-6">
                    {/* Appointment Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Appointment Type
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        <button
                          type="button"
                          onClick={() => handleAppointmentTypeSelect('in-person')}
                          className={`p-4 border-2 rounded-xl text-center transition-all
                            ${appointmentDetails.appointmentType === 'in-person'
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'}`}
                        >
                          <Building2 className={`mx-auto mb-2 ${appointmentDetails.appointmentType === 'in-person' ? 'text-blue-600' : 'text-gray-600'}`} />
                          <span className={`text-sm font-medium ${appointmentDetails.appointmentType === 'in-person' ? 'text-blue-600' : 'text-gray-700'}`}>
                            In-Person
                          </span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleAppointmentTypeSelect('video')}
                          className={`p-4 border-2 rounded-xl text-center transition-all
                            ${appointmentDetails.appointmentType === 'video'
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'}`}
                        >
                          <Video className={`mx-auto mb-2 ${appointmentDetails.appointmentType === 'video' ? 'text-blue-600' : 'text-gray-600'}`} />
                          <span className={`text-sm font-medium ${appointmentDetails.appointmentType === 'video' ? 'text-blue-600' : 'text-gray-700'}`}>
                            Video Call
                          </span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleAppointmentTypeSelect('home-visit')}
                          className={`p-4 border-2 rounded-xl text-center transition-all
                            ${appointmentDetails.appointmentType === 'home-visit'
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'}`}
                        >
                          <HeartPulse className={`mx-auto mb-2 ${appointmentDetails.appointmentType === 'home-visit' ? 'text-blue-600' : 'text-gray-600'}`} />
                          <span className={`text-sm font-medium ${appointmentDetails.appointmentType === 'home-visit' ? 'text-blue-600' : 'text-gray-700'}`}>
                            Home Visit
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Patient Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Patient Type
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setAppointmentDetails(prev => ({ ...prev, isNewPatient: true }))}
                          className={`px-6 py-3 border-2 rounded-xl transition-all flex items-center gap-2
                            ${appointmentDetails.isNewPatient
                              ? 'border-blue-600 bg-blue-50 text-blue-600'
                              : 'border-gray-200 hover:border-blue-300'}`}
                        >
                          <User size={18} />
                          New Patient
                        </button>
                        <button
                          type="button"
                          onClick={() => setAppointmentDetails(prev => ({ ...prev, isNewPatient: false }))}
                          className={`px-6 py-3 border-2 rounded-xl transition-all flex items-center gap-2
                            ${!appointmentDetails.isNewPatient
                              ? 'border-blue-600 bg-blue-50 text-blue-600'
                              : 'border-gray-200 hover:border-blue-300'}`}
                        >
                          <User size={18} />
                          Returning Patient
                        </button>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={appointmentDetails.patientInfo.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors"
                          placeholder="Enter first name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={appointmentDetails.patientInfo.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors"
                          placeholder="Enter last name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={appointmentDetails.patientInfo.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors"
                          placeholder="Enter email"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={appointmentDetails.patientInfo.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors"
                          placeholder="Enter phone number"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={appointmentDetails.patientInfo.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender *
                        </label>
                        <select
                          name="gender"
                          value={appointmentDetails.patientInfo.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors"
                          required
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={appointmentDetails.patientInfo.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors"
                        placeholder="Enter street address"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={appointmentDetails.patientInfo.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors"
                          placeholder="City"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={appointmentDetails.patientInfo.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors"
                          placeholder="State"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={appointmentDetails.patientInfo.pincode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors"
                          placeholder="Pincode"
                          required
                        />
                      </div>
                    </div>

                    {/* Reason for Appointment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Appointment *
                      </label>
                      <textarea
                        name="reason"
                        value={appointmentDetails.reason}
                        onChange={(e) => setAppointmentDetails(prev => ({ ...prev, reason: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors"
                        placeholder="Please describe your symptoms or reason for visit"
                        required
                      />
                    </div>

                    {/* Insurance Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Insurance Provider
                        </label>
                        <input
                          type="text"
                          name="insuranceProvider"
                          value={appointmentDetails.insuranceProvider}
                          onChange={(e) => setAppointmentDetails(prev => ({ ...prev, insuranceProvider: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors"
                          placeholder="Enter insurance provider"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Insurance ID / Policy Number
                        </label>
                        <input
                          type="text"
                          name="insuranceId"
                          value={appointmentDetails.insuranceId}
                          onChange={(e) => setAppointmentDetails(prev => ({ ...prev, insuranceId: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 outline-none transition-colors"
                          placeholder="Enter policy number"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 4: Confirm & Pay */}
              {currentStep === 4 && selectedDoctor && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Appointment</h2>
                  
                  <div className="space-y-6">
                    {/* Appointment Summary */}
                    <div className="bg-blue-50 p-6 rounded-xl">
                      <h3 className="font-semibold text-lg text-blue-800 mb-4">Appointment Summary</h3>
                      
                      <div className="flex items-start gap-4">
                        <img
                          src={selectedDoctor.image}
                          alt={selectedDoctor.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-600"
                        />
                        
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800">{selectedDoctor.name}</h4>
                          <p className="text-sm text-blue-600">{selectedDoctor.specialization}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Hospital size={14} />
                            {selectedDoctor.hospital}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-blue-600" />
                          <span className="text-sm text-gray-700">
                            {appointmentDetails.date ? new Date(appointmentDetails.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }) : 'Not selected'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-blue-600" />
                          <span className="text-sm text-gray-700">{appointmentDetails.timeSlot}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-blue-600" />
                          <span className="text-sm text-gray-700">
                            {appointmentDetails.patientInfo.firstName} {appointmentDetails.patientInfo.lastName}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {appointmentDetails.appointmentType === 'in-person' && <Building2 size={16} className="text-blue-600" />}
                          {appointmentDetails.appointmentType === 'video' && <Video size={16} className="text-blue-600" />}
                          {appointmentDetails.appointmentType === 'home-visit' && <HeartPulse size={16} className="text-blue-600" />}
                          <span className="text-sm text-gray-700 capitalize">{appointmentDetails.appointmentType} Visit</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="border-2 border-gray-200 rounded-xl p-6">
                      <h3 className="font-semibold text-lg text-gray-800 mb-4">Payment Details</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Consultation Fee</span>
                          <span className="font-semibold">${selectedDoctor.fee}</span>
                        </div>
                        
                        {appointmentDetails.appointmentType === 'home-visit' && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Home Visit Charge</span>
                            <span className="font-semibold">$50</span>
                          </div>
                        )}
                        
                        {appointmentDetails.appointmentType === 'video' && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Video Consultation Fee</span>
                            <span className="font-semibold">$20</span>
                          </div>
                        )}
                        
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total Amount</span>
                            <span className="text-blue-600">
                              ${selectedDoctor.fee + 
                                (appointmentDetails.appointmentType === 'home-visit' ? 50 : 
                                 appointmentDetails.appointmentType === 'video' ? 20 : 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="border-2 border-gray-200 rounded-xl p-6">
                      <h3 className="font-semibold text-lg text-gray-800 mb-4">Payment Method</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition-colors">
                          <CreditCard className="text-blue-600" />
                          <span className="font-medium">Credit/Debit Card</span>
                        </button>
                        
                        <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition-colors">
                          <Shield className="text-green-600" />
                          <span className="font-medium">Insurance</span>
                        </button>
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <div className="flex items-start gap-3">
                      <input type="checkbox" id="terms" className="mt-1" />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I confirm that the information provided is accurate and I agree to the 
                        <span className="text-blue-600 cursor-pointer hover:underline"> Terms & Conditions</span> and 
                        <span className="text-blue-600 cursor-pointer hover:underline"> Cancellation Policy</span>.
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold flex items-center gap-2"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    disabled={
                      (currentStep === 1 && !selectedDoctor) ||
                      (currentStep === 2 && (!selectedDate || !selectedSlot))
                    }
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 ml-auto"
                  >
                    Confirm & Pay
                    <CheckCircle size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Booking Summary (Sticky) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Booking Summary</h3>
                
                {selectedDoctor ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedDoctor.image}
                        alt={selectedDoctor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{selectedDoctor.name}</h4>
                        <p className="text-xs text-blue-600">{selectedDoctor.specialization}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Consultation Fee</span>
                        <span className="font-semibold">${selectedDoctor.fee}</span>
                      </div>
                      
                      {appointmentDetails.date && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Date</span>
                          <span className="font-semibold">
                            {new Date(appointmentDetails.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                      
                      {appointmentDetails.timeSlot && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Time</span>
                          <span className="font-semibold">{appointmentDetails.timeSlot}</span>
                        </div>
                      )}
                      
                      {appointmentDetails.appointmentType && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Type</span>
                          <span className="font-semibold capitalize">{appointmentDetails.appointmentType}</span>
                        </div>
                      )}
                      
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span className="text-blue-600">
                            ${selectedDoctor.fee + 
                              (appointmentDetails.appointmentType === 'home-visit' ? 50 : 
                               appointmentDetails.appointmentType === 'video' ? 20 : 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-xl">
                      <div className="flex items-start gap-2">
                        <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                        <p className="text-xs text-gray-600">
                          Cancellation is free up to 2 hours before appointment. 
                          Late cancellations may incur a fee.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Select a doctor to see booking summary</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully booked. A confirmation email has been sent to your inbox.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Appointment ID:</span> APT{Math.floor(Math.random() * 10000)}<br />
                <span className="font-semibold">Date:</span> {appointmentDetails.date}<br />
                <span className="font-semibold">Time:</span> {appointmentDetails.timeSlot}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/appointments')}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                View Appointments
              </button>
              <button
                onClick={() => navigate('/doctors')}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
              >
                Book Another
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  );
};

export default BookAppointment;