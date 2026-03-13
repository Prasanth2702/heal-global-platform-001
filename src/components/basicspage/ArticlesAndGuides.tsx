import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  BookOpen,
  Shield,
  Zap,
  CreditCard,
  Smartphone,
  Globe,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Wifi,
  Clock,
  CreditCard as CardIcon,
  Globe as WorldIcon,
  UserX,
  HelpCircle,
  Mail,
  Smartphone as PhoneIcon,
  Lock,
  Star,
  Users,
  MessageCircle,
  Calendar,
  Bed,
  Hospital,
  Stethoscope,
  User,
  Building,
  Ambulance,
  HeartPulse,
  Video,
} from "lucide-react";
import Header from "@/pages/alldetails/Header";
import Footer from "@/pages/alldetails/Footer";

// FAQ Model Component - Reusable across all pages
const FAQModel = ({ faqs, title = "Payment & Booking FAQs" }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <HelpCircle className="h-6 w-6 text-blue-500 mr-2" />
        {title}
      </h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-md transition-all duration-300"
          >
            <button
              onClick={() =>
                setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
              }
              className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 rounded-lg p-2 text-blue-600 flex-shrink-0">
                  {faq.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {faq.question}
                  </h3>
                  {expandedFAQ === faq.id && (
                    <p className="text-gray-700 mt-2 leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                  expandedFAQ === faq.id ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Guides Component for Patients
const PatientsGuideSection = () => {
  const [expandedGuide, setExpandedGuide] = useState(null);

  const guides = [
    {
      id: 1,
      title: "How to Book an Appointment on HealGlobe.com",
      category: "patients",
      excerpt:
        "Learn how to easily book doctor appointments online, choose your preferred time slot, and manage your healthcare visits.",
      icon: <Calendar className="h-5 w-5" />,
      readTime: "3 min read",
      content: {
        introduction:
          "Booking appointments through HealGlobe.com is simple and convenient. Follow these steps to schedule your next visit:",
        steps: [
          "Log in to your HealGlobe.com account",
          "Search for doctors by specialty, location, or hospital name",
          "View doctor profiles, patient reviews, and available time slots",
          "Select a convenient time slot that works for you",
          "Confirm your booking and make payment if required",
          "Receive instant confirmation via SMS and email",
          "Attend your appointment (in-person or video consultation)",
        ],
      },
    },
    {
      id: 2,
      title: "How to Reserve a Hospital Bed",
      category: "patients",
      excerpt:
        "Step-by-step guide to booking hospital beds for planned admissions or emergencies through our platform.",
      icon: <Bed className="h-5 w-5" />,
      readTime: "4 min read",
      content: {
        introduction:
          "HealGlobe.com makes bed reservations simple. Here's how to secure a bed for your hospital stay:",
        steps: [
          "Search for hospitals by location and bed type (ICU, General Ward, Private Room)",
          "Check real-time bed availability and estimated costs",
          "Review hospital details, amenities, and insurance acceptance",
          "Select your preferred hospital and bed type",
          "Complete the reservation with advance payment if required",
          "Receive bed allocation confirmation with admission instructions",
          "Direct hospital admission upon arrival with minimal paperwork",
        ],
      },
    },
    {
      id: 3,
      title: "Booking Diagnostic Tests & Health Checkups",
      category: "patients",
      excerpt:
        "Schedule lab tests and health packages at NABL accredited laboratories with home sample collection.",
      icon: <HeartPulse className="h-5 w-5" />,
      readTime: "3 min read",
      content: {
        introduction:
          "Get your health checkups done easily through HealGlobe.com:",
        steps: [
          "Browse available diagnostic tests and health packages",
          "Select your preferred lab or diagnostic center",
          "Choose between lab visit or home sample collection",
          "Pick a convenient date and time slot",
          "Complete booking and payment",
          "Receive sample collection confirmation or lab visit details",
          "Get digital reports delivered to your account",
        ],
      },
    },
    {
      id: 4,
      title: "Managing Your Appointments & Bookings",
      category: "patients",
      excerpt:
        "Learn how to view, reschedule, or cancel your appointments and bed reservations.",
      icon: <Clock className="h-5 w-5" />,
      readTime: "2 min read",
      content: {
        introduction:
          "Take control of your healthcare schedule with these management features:",
        steps: [
          "Go to 'My Bookings' section in your account dashboard",
          "View all upcoming and past appointments",
          "Reschedule appointments up to 24 hours before the scheduled time",
          "Cancel bookings and check refund eligibility",
          "Add appointments to your calendar",
          "Set reminders for upcoming visits",
        ],
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <User className="h-6 w-6 text-green-500 mr-2" />
        For Patients - Booking Guides
      </h2>

      {guides.map((guide) => (
        <div
          key={guide.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-md transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-green-50 rounded-lg p-2 mr-3 text-green-600">
                  {guide.icon}
                </div>
                <span className="text-sm font-medium text-green-600 capitalize">
                  {guide.category}
                </span>
              </div>
            </div>

            <h4 className="font-bold text-lg text-gray-900 mb-3">
              {guide.title}
            </h4>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {guide.excerpt}
            </p>

            <button
              onClick={() =>
                setExpandedGuide(expandedGuide === guide.id ? null : guide.id)
              }
              className="inline-flex items-center text-green-600 font-semibold text-sm hover:text-green-700 transition-colors duration-200 group/btn"
            >
              {expandedGuide === guide.id ? "Show Less" : "Read Full Guide"}
              <ChevronRight
                className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                  expandedGuide === guide.id
                    ? "rotate-90"
                    : "group-hover/btn:translate-x-1"
                }`}
              />
            </button>

            {expandedGuide === guide.id && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">
                    {guide.content.introduction}
                  </h5>
                  <ul className="space-y-3">
                    {guide.content.steps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Guides Component for Medical Professionals (Doctors)
const MedicalProfessionalsGuideSection = () => {
  const [expandedGuide, setExpandedGuide] = useState(null);

  const guides = [
    {
      id: 1,
      title: "Setting Up Your Doctor Profile on HealGlobe.com",
      category: "doctors",
      excerpt:
        "Create a professional profile to attract patients, manage appointments, and build your online presence.",
      icon: <Stethoscope className="h-5 w-5" />,
      readTime: "4 min read",
      content: {
        introduction:
          "A complete doctor profile helps patients find and trust you. Follow these steps:",
        steps: [
          "Register as a healthcare provider on HealGlobe.com",
          "Submit your medical credentials and license for verification",
          "Add your specialties, qualifications, and years of experience",
          "Upload a professional photo and write a compelling bio",
          "Set your consultation fees and available services",
          "Define your availability and working hours",
          "Get verified to build patient trust",
        ],
      },
    },
    {
      id: 2,
      title: "Managing Your Appointment Schedule",
      category: "doctors",
      excerpt:
        "Learn how to set availability, block time slots, and manage patient appointments efficiently.",
      icon: <Calendar className="h-5 w-5" />,
      readTime: "3 min read",
      content: {
        introduction:
          "Take control of your schedule with these appointment management features:",
        steps: [
          "Set your weekly availability in the doctor dashboard",
          "Define consultation durations (15 min, 30 min, 1 hour)",
          "Block time for breaks, meetings, or personal time",
          "View all upcoming appointments in one place",
          "Accept or reschedule patient requests",
          "Send reminders to patients before appointments",
          "Access patient history before consultations",
        ],
      },
    },
    {
      id: 3,
      title: "Providing Teleconsultations",
      category: "doctors",
      excerpt:
        "Guide to conducting video consultations, writing digital prescriptions, and following up with patients.",
      icon: <Video className="h-5 w-5" />,
      readTime: "4 min read",
      content: {
        introduction:
          "HealGlobe.com makes telemedicine easy. Here's how to conduct virtual consultations:",
        steps: [
          "Ensure you have a stable internet connection and webcam",
          "Join video consultations directly from your dashboard",
          "Use the integrated tools to write digital prescriptions",
          "Record consultation notes in the patient's secure record",
          "Schedule follow-up appointments if needed",
          "Set your availability for video consultations separately",
          "Get paid securely through the platform",
        ],
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Stethoscope className="h-6 w-6 text-purple-500 mr-2" />
        For Medical Professionals - Doctor Guides
      </h2>

      {guides.map((guide) => (
        <div
          key={guide.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-md transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-purple-50 rounded-lg p-2 mr-3 text-purple-600">
                  {guide.icon}
                </div>
                <span className="text-sm font-medium text-purple-600 capitalize">
                  {guide.category}
                </span>
              </div>
            </div>

            <h4 className="font-bold text-lg text-gray-900 mb-3">
              {guide.title}
            </h4>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {guide.excerpt}
            </p>

            <button
              onClick={() =>
                setExpandedGuide(expandedGuide === guide.id ? null : guide.id)
              }
              className="inline-flex items-center text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors duration-200 group/btn"
            >
              {expandedGuide === guide.id ? "Show Less" : "Read Full Guide"}
              <ChevronRight
                className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                  expandedGuide === guide.id
                    ? "rotate-90"
                    : "group-hover/btn:translate-x-1"
                }`}
              />
            </button>

            {expandedGuide === guide.id && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">
                    {guide.content.introduction}
                  </h5>
                  <ul className="space-y-3">
                    {guide.content.steps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Guides Component for Healthcare Facilities (Hospitals)
const FacilitiesGuideSection = () => {
  const [expandedGuide, setExpandedGuide] = useState(null);

  const guides = [
    {
      id: 1,
      title: "Listing Your Hospital on HealGlobe.com",
      category: "hospitals",
      excerpt:
        "Complete guide to adding your healthcare facility, managing bed inventory, and attracting patients.",
      icon: <Hospital className="h-5 w-5" />,
      readTime: "5 min read",
      content: {
        introduction:
          "Get your hospital or clinic listed on HealGlobe.com with these steps:",
        steps: [
          "Register your facility with official credentials and licenses",
          "Complete facility profile with contact details and location",
          "List all departments and specialties available",
          "Upload photos of your facility and amenities",
          "Define bed inventory by type (ICU, General, Private, etc.)",
          "Set consultation fees and service charges",
          "Get verified to appear in search results",
        ],
      },
    },
    {
      id: 2,
      title: "Managing Bed Availability in Real-Time",
      category: "hospitals",
      excerpt:
        "Learn how to update bed inventory, manage admissions, and optimize occupancy rates.",
      icon: <Bed className="h-5 w-5" />,
      readTime: "4 min read",
      content: {
        introduction:
          "Efficient bed management is crucial for hospital operations. Here's how:",
        steps: [
          "Access the hospital dashboard to view current bed status",
          "Update bed availability in real-time as admissions occur",
          "Set different bed types with separate availability tracking",
          "Manage waiting lists for popular bed categories",
          "Receive booking requests and confirm allocations",
          "Track occupancy rates and generate reports",
          "Integrate with your existing hospital management system",
        ],
      },
    },
    {
      id: 3,
      title: "Managing Doctor Schedules and Appointments",
      category: "hospitals",
      excerpt:
        "Administrator's guide to managing multiple doctors, their schedules, and patient flow.",
      icon: <Users className="h-5 w-5" />,
      readTime: "4 min read",
      content: {
        introduction:
          "Coordinate your medical staff efficiently with these tools:",
        steps: [
          "Add doctors to your facility and assign departments",
          "Set individual doctor schedules and consultation types",
          "Manage leave requests and temporary unavailability",
          "View all appointments across your facility",
          "Track patient flow and doctor performance",
          "Generate reports on appointment volume and revenue",
          "Optimize scheduling based on demand patterns",
        ],
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Building className="h-6 w-6 text-orange-500 mr-2" />
        For Healthcare Facilities - Hospital Guides
      </h2>

      {guides.map((guide) => (
        <div
          key={guide.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-md transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-orange-50 rounded-lg p-2 mr-3 text-orange-600">
                  {guide.icon}
                </div>
                <span className="text-sm font-medium text-orange-600 capitalize">
                  {guide.category}
                </span>
              </div>
            </div>

            <h4 className="font-bold text-lg text-gray-900 mb-3">
              {guide.title}
            </h4>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {guide.excerpt}
            </p>

            <button
              onClick={() =>
                setExpandedGuide(expandedGuide === guide.id ? null : guide.id)
              }
              className="inline-flex items-center text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors duration-200 group/btn"
            >
              {expandedGuide === guide.id ? "Show Less" : "Read Full Guide"}
              <ChevronRight
                className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                  expandedGuide === guide.id
                    ? "rotate-90"
                    : "group-hover/btn:translate-x-1"
                }`}
              />
            </button>

            {expandedGuide === guide.id && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">
                    {guide.content.introduction}
                  </h5>
                  <ul className="space-y-3">
                    {guide.content.steps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Account-Related FAQs for HealGlobe
const AccountFAQs = () => {
  const [expandedGuide, setExpandedGuide] = useState(null);

  const access = [
    {
      id: "faq-1",
      category: "Account",
      title: "How do I create a patient account on HealGlobe?",
      readTime: "2 min read",
      icon: <User className="h-5 w-5" />,
      excerpt:
        "Learn how to quickly create your patient account and start booking appointments.",
      content: {
        introduction: "Follow these steps to create your account easily:",
        steps: [
          "Visit HealGlobe.com and click 'Sign Up'",
          "Enter your name, email, phone number, and create a password",
          "Verify your email through the link sent to your inbox",
          "Complete your profile with basic information",
          "Add emergency contact details (optional but recommended)",
          "Start searching for doctors and booking appointments",
          "Setup takes only 2–3 minutes and is completely free",
        ],
      },
    },
    {
      id: "faq-2",
      category: "Account",
      title: "How do I register as a doctor or healthcare provider?",
      readTime: "3 min read",
      icon: <Stethoscope className="h-5 w-5" />,
      excerpt:
        "Step-by-step guide to creating a professional account on HealGlobe.",
      content: {
        introduction: "Healthcare providers need additional verification:",
        steps: [
          "Click 'Join as Healthcare Provider' on the signup page",
          "Select your profession (Doctor, Nurse, Specialist, etc.)",
          "Enter your professional details and credentials",
          "Upload your medical license and ID proof for verification",
          "Add your specialties, qualifications, and experience",
          "Submit for verification (usually takes 24-48 hours)",
          "Once verified, you can start accepting appointments",
        ],
      },
    },
    {
      id: "faq-3",
      category: "Account",
      title: "How do I reset my password?",
      readTime: "1 min read",
      icon: <Lock className="h-5 w-5" />,
      excerpt: "Easily reset your password using your registered email.",
      content: {
        introduction: "You can reset your password by following these steps:",
        steps: [
          "Go to the login page and click 'Forgot Password?'",
          "Enter your registered email address",
          "Check your email for a password reset link (valid for 24 hours)",
          "Click the link and create a new password",
          "Ensure your new password has at least 8 characters with a mix of letters and numbers",
          "Log in with your new password",
          "If issues continue, contact support@healglobe.com",
        ],
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Users className="h-6 w-6 text-green-500 mr-2" />
        Account-Related FAQs
      </h2>

      {access.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-md transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-green-50 rounded-lg p-2 mr-3 text-green-600">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-green-600 capitalize">
                  {item.category}
                </span>
              </div>
            </div>

            <h4 className="font-bold text-lg text-gray-900 mb-3">
              {item.title}
            </h4>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {item.excerpt}
            </p>

            <button
              onClick={() =>
                setExpandedGuide(expandedGuide === item.id ? null : item.id)
              }
              className="inline-flex items-center text-green-600 font-semibold text-sm hover:text-green-700 transition-colors duration-200 group/btn"
            >
              {expandedGuide === item.id ? "Show Less" : "Read Full Guide"}
              <ChevronRight
                className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                  expandedGuide === item.id
                    ? "rotate-90"
                    : "group-hover/btn:translate-x-1"
                }`}
              />
            </button>

            {expandedGuide === item.id && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">
                    {item.content.introduction}
                  </h5>
                  <ul className="space-y-3">
                    {item.content.steps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Payment FAQs for HealGlobe
const PaymentFAQs = () => {
  const paymentFAQs = [
    {
      id: 1,
      question: "Why did my payment for appointment booking fail?",
      answer:
        "Payments may fail due to network issues, incorrect card details, bank downtime, insufficient balance, or OTP delays. Please try again or use a different payment method. If money was deducted but booking not confirmed, it will be auto-refunded within 3-5 business days.",
      icon: <AlertCircle className="h-5 w-5" />,
    },
    {
      id: 2,
      question: "How do I get a refund for a cancelled appointment?",
      answer:
        "Refunds for cancelled appointments are processed automatically based on our cancellation policy. Free cancellations up to 24 hours before appointment receive full refund. Cancellations within 24 hours may incur a fee. Refunds typically reflect in 5-7 business days.",
      icon: <RefreshCw className="h-5 w-5" />,
    },
    {
      id: 3,
      question: "What payment methods are accepted for bed bookings?",
      answer:
        "We accept all major payment methods including UPI, Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, and popular digital wallets. For international users, we accept international credit cards and PayPal.",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: 4,
      question: "Is my payment information secure on HealGlobe?",
      answer:
        "Yes, we use industry-standard encryption and secure payment gateways. We are PCI-DSS compliant and never store your complete card details on our servers. All transactions are processed through secure, verified payment partners.",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      id: 5,
      question: "Can I pay using health insurance for appointments?",
      answer:
        "Insurance coverage varies by provider and plan. During booking, you can check if your insurance is accepted. For cashless claims, you may need to verify with the hospital directly. We're working to integrate more insurance providers for seamless payments.",
      icon: <HeartPulse className="h-5 w-5" />,
    },
    {
      id: 6,
      question: "Who do I contact for payment support?",
      answer: (
        <>
          For payment-related issues, please email{" "}
          <a
            href="mailto:payments@healglobe.com"
            className="text-blue-600 underline"
          >
            payments@healglobe.com
          </a>{" "}
          with your transaction ID, booking details, and screenshots if available.
          Our team typically responds within 24 hours.
        </>
      ),
      icon: <Mail className="h-5 w-5" />,
    },
  ];

  return <FAQModel faqs={paymentFAQs} title="Payment & Booking FAQs" />;
};

const ArticlesAndGuides = () => {
  const [activeCategory, setActiveCategory] = useState("patients");
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const categories = [
    { id: "patients", name: "For Patients" },
    { id: "doctors", name: "For Medical Professionals" },
    { id: "hospitals", name: "For Healthcare Facilities" },
    { id: "account", name: "Account FAQs" },
    { id: "payment", name: "Payment FAQs" },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Help Center & FAQs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about booking appointments, reserving beds,
              and managing your healthcare on HealGlobe.com
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-all">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Book Appointments</h3>
              <p className="text-gray-600 text-sm">Find and book appointments with top doctors</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-all">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bed className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Reserve Hospital Beds</h3>
              <p className="text-gray-600 text-sm">Check availability and book beds instantly</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition-all">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Doctor Dashboard</h3>
              <p className="text-gray-600 text-sm">Manage your practice and patient appointments</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 sticky top-8">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                  Help Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setExpandedArticle(null);
                        setExpandedFAQ(null);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                        activeCategory === category.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform duration-200 ${
                          activeCategory === category.id
                            ? "text-blue-600 transform translate-x-0"
                            : "text-gray-400 group-hover:translate-x-1"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeCategory === "patients" && <PatientsGuideSection />}
              {activeCategory === "doctors" && <MedicalProfessionalsGuideSection />}
              {activeCategory === "hospitals" && <FacilitiesGuideSection />}
              {activeCategory === "account" && <AccountFAQs />}
              {activeCategory === "payment" && <PaymentFAQs />}
            </div>
          </div>

          {/* Contact Support CTA */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Still Need Help?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Our support team is here to assist you with any questions about bookings, payments, or account issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@healglobe.com"
                  className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Email Support
                </a>
                <a
                  href="#"
                  className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  Visit Help Center
                </a>
              </div>
              <p className="text-blue-100 mt-4">
                Response time: Typically within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ArticlesAndGuides;
export { FAQModel, PatientsGuideSection, MedicalProfessionalsGuideSection, FacilitiesGuideSection };