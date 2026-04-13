// pages/Help.tsx
import Footer from '@/pages/alldetails/Footer';
import Header from '@/pages/alldetails/Header';
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, Stethoscope, Building2, Mail, Phone, MessageCircle, 
  Calendar, FileText, Shield, HelpCircle, ArrowLeft, 
  ChevronDown
} from 'lucide-react';

// ========== 1. Data for each role / person ==========
type HelpContent = {
  title: string;
  role: string;
  avatarIcon: React.ElementType;
  bgGradient: string;
  description: string;
  quickActions: { label: string; icon: React.ElementType; link: string }[];
  faqs: { q: string; a: string }[];
  contactEmail: string;
  contactPhone?: string;
};

const helpDatabase: Record<string, HelpContent> = {
  patient: {
    title: "Patient Support Center",
    role: "Patient",
    avatarIcon: User,
    bgGradient: "from-blue-500 to-cyan-400",
    description: "We're here to make your healthcare journey smooth. Get appointment help, prescription refills, or billing assistance.",
    quickActions: [
      { label: "Book Appointment", icon: Calendar, link: "/appointment/doctors" },
      { label: "Find Doctor / Specialists", icon: MessageCircle, link: "/appointment/doctors" },
    //   { label: "View Records", icon: FileText, link: "/records" },
    ],
    faqs: [
        {
    q: "How do I start the patient registration?",
    a: "Click 'Join as Patient' on the homepage → fill in your personal details (name, email, phone, password) → accept Terms & Privacy → click 'Next'."
  },
  {
    q: "What information do I need to provide?",
    a: "You'll provide: 1) Personal info (name, email, phone, password), 2) Medical info (DOB, gender, blood group, allergies, medications), 3) Address, and 4) Emergency contact & optional profile picture/documents."
  },
  {
    q: "Is there a minimum password requirement?",
    a: "Yes – at least 6 characters, including one letter, one number, and one special character (@$!%*?&)."
  },
  {
    q: "Do I have to upload medical documents?",
    a: "No, it's optional. You can skip that step and upload later from your patient dashboard."
  },
  {
    q: "What happens after I complete all 4 steps?",
    a: "You'll see a success popup and receive a welcome email. Then click 'Go to Dashboard' to start booking appointments and managing your health records."
  },
  {
    q: "Can I save my progress and finish later?",
    a: "Step 1 (personal info) is saved immediately. For the remaining steps, you must complete them in one session – the registration is designed to be fast (usually 3–5 minutes)."
  },
  { q: "How do I log in as a patient?", a: "Go to the login page, select 'Patient', enter your email and password, then click 'Sign In'. You can also use OTP (one‑time password) login." },
      { q: "I forgot my password. How do I reset it?", a: "On the login page, click 'Forgot password?'. Enter your registered email – we'll send a password reset link." },
      { q: "Can I log in with my phone number and OTP?", a: "Yes – choose the 'OTP Login' tab on the login screen, enter your registered phone number, and you'll receive a one‑time code." },
      { q: "Why am I getting 'Email not registered'?", a: "That means no account exists with that email. Please register first using the 'Register here' link on the login page." },
      { q: "How do I reschedule an appointment?", a: "Go to 'My Appointments' → select the visit → click 'Reschedule'." },
      { q: "Where can I see my lab results?", a: "Lab results appear in 'Health Records' within 48 hours." },
      { q: "Is telemedicine available?", a: "Yes! Many providers offer video visits – check the doctor's profile." },
    ],
    contactEmail: "patients@yourapp.com",
    contactPhone: "+1 (800) 555-PATIENT",
  },
  doctor: {
    title: "Doctor Help Desk",
    role: "Doctor",
    avatarIcon: Stethoscope,
    bgGradient: "from-emerald-500 to-teal-400",
    description: "Dedicated support for physicians. Manage schedules, e‑prescriptions, and patient communications.",
    quickActions: [
    //   { label: "Manage Schedule", icon: Calendar, link: "/schedule" },
    //   { label: "Write Prescription", icon: FileText, link: "/prescriptions" },
    //   { label: "Secure Chat", icon: MessageCircle, link: "/inbox" },
    ],
    faqs: [
      {
    q: "What are the steps to register as a doctor?",
    a: "You will go through 6 steps: 1) Account creation (email, phone, password), 2) Address, 3) Professional info (specialty, license, experience), 4) Profile picture, 5) Document uploads, 6) Schedule setup (working days & time slots)."
  },
  {
    q: "Do I need to upload my medical license?",
    a: "Yes – we require a valid medical license for verification. You can upload PDF or image files in Step 5."
  },
  {
    q: "What happens after I complete Step 1 (Account)?",
    a: "Your basic account is created immediately. You will receive a welcome email. The remaining steps can be completed in the same session."
  },
  {
  q: "How do I set my consultation hours?",
    a: "In Step 6, select a working day, choose Clinic or Tele‑consultation type, then click the time slots you want to make available. You can repeat for each day and both consultation types."
  },
  {
    q: "When will my profile be visible to patients?",
    a: "After you complete all 6 steps and click 'Complete Registration', your profile is submitted for review. Once verified (typically within 24‑48 hours), you will appear in search results."
  },
  {
    q: "Can I save my progress and finish later?",
    a: "Step 1 is saved immediately. For steps 2‑6, you need to complete them in one session – the whole process takes about 5‑7 minutes. You cannot resume later unless you restart."
  },
  {
    q: "What documents should I upload in Step 5?",
    a: "Recommended: Medical license, degree certificates, ID proof, and any specialisation certificates. All files are securely stored."
  } , 
  { q: "How do I log in as a doctor?", a: "Go to the login page, select 'Medical Professional', enter your email and password, then click 'Sign In'. OTP login is also available." },
      { q: "I forgot my password. How do I reset it?", a: "Click 'Forgot password?' on the login screen. We'll send a reset link to your registered email." },
      { q: "Can I use OTP login with my phone number?", a: "Yes – choose the 'OTP Login' tab and enter the phone number linked to your doctor account." },
      { q: "Why do I see 'Email not registered'?", a: "That email hasn't been registered as a doctor. Please complete the doctor registration first." },
      { q: "How do I add a new patient?", a: "Use the 'Add Patient' button on your dashboard – enter basic info." },
      { q: "Can I export visit notes?", a: "Yes, each patient record has a PDF export option." },
      { q: "What if a patient no‑shows?", a: "Mark the appointment as 'No‑show' and the system will auto‑notify." },
    ],
    contactEmail: "doctors@yourapp.com",
    contactPhone: "+1 (800) 555-DOCTOR",
  },
  facility: {
    title: "Facility Administration",
    role: "Facility",
    avatarIcon: Building2,
    bgGradient: "from-purple-500 to-pink-400",
    description: "Tools and support for hospitals, clinics, and labs. Billing, compliance, and staff management.",
    quickActions: [
    //   { label: "Staff Directory", icon: User, link: "/staff" },
    //   { label: "Compliance Docs", icon: Shield, link: "/compliance" },
    //   { label: "Billing Portal", icon: FileText, link: "/billing" },
    ],
    faqs: [
         {
    q: "What are the steps to register a facility?",
    a: "There are 4 steps: 1) Basic Info (facility name, type, email, phone, password, license, established year), 2) Location & License (address, city, state, pincode, departments), 3) Services (operating hours, insurance, additional services, description), 4) Documents & Profile (optional profile picture and document uploads)."
  },
  {
    q: "Do I need a medical license number to register?",
    a: "Yes – a valid medical license number for your facility is required. It will be verified before your facility goes live."
  },
  {
    q: "What happens after I complete Step 1?",
    a: "Your basic account and facility record are created immediately. You'll receive a welcome email with login instructions. The remaining steps must be completed in the same session."
  },
  {
  q: "How do I add departments or services?",
    a: "In Step 2, after selecting your facility type, a list of relevant departments appears. Check the boxes for the departments your facility offers."
  },
  {
    q: "Can I save my progress and finish later?",
    a: "Only Step 1 is saved permanently. Steps 2‑4 need to be completed in one session (typically 5‑7 minutes). You cannot resume partially completed steps later."
  },
  {
    q: "What documents should I upload in Step 4?",
    a: "Optional but recommended: facility registration certificate, license documents, insurance certificates, etc. All files are securely stored."
  },
  {
    q: "When will my facility be visible to patients?",
    a: "After completing all steps and clicking 'Complete Registration', your facility is submitted for verification. Once verified (usually within 24‑48 hours), it will appear in patient search results."
  },
   { q: "How do I log in as a facility administrator?", a: "Go to the login page, select 'Medical Facility', enter your email and password, then click 'Sign In'. OTP login is also available." },
      { q: "I forgot my facility account password. What should I do?", a: "Click 'Forgot password?' on the login screen. A password reset link will be sent to the facility's registered email." },
      { q: "Can staff members log in with OTP?", a: "Yes – any user (admin or staff) can use OTP login if their phone number is verified in the system." },
      { q: "Why do I see 'Email not registered' for my facility?", a: "That email hasn't been registered as a facility. Please complete the facility registration first." },
      { q: "How do I onboard a new physician?", a: "Go to 'Staff' → 'Add Provider' and fill the credential form." },
      { q: "Is there a facility API?", a: "Yes, request API keys from your account manager." },
      { q: "How to run monthly reports?", a: "Navigate to 'Analytics' → 'Reports' → select date range." },
    ],
    contactEmail: "facilities@yourapp.com",
    contactPhone: "+1 (800) 555-FACILITY",
  },
  // Example: a custom username "john_doe" – you can add any person
  john_doe: {
    title: "John Doe – Personalized Help",
    role: "Patient",
    avatarIcon: User,
    bgGradient: "from-indigo-500 to-blue-400",
    description: "Hi John! We noticed you recently had a knee surgery. Here's tailored support for your recovery.",
    quickActions: [
      { label: "Physio Appointments", icon: Calendar, link: "/appointments" },
      { label: "Pain Log", icon: FileText, link: "/logs" },
      { label: "Ask Nurse", icon: MessageCircle, link: "/chat" },
    ],
    faqs: [
      { q: "When can I drive again?", a: "Most patients resume driving after 4‑6 weeks – check with your surgeon." },
      { q: "How to request a refill?", a: "Use the 'Prescriptions' tab → 'Request Refill'." },
    ],
    contactEmail: "john@example.com", // could be personal
    contactPhone: "+1 (555) 123-4567",
  },
};

// ========== 2. Component that renders based on :username ==========
const PersonHelp = () => {
  const { username } = useParams<{ username: string }>();
  
  // Normalize: lowercase and fallback to 'patient' if not found
  const key = username?.toLowerCase() || '';
  const data = helpDatabase[key] || helpDatabase.patient; // fallback to patient

  const { title, role, avatarIcon: AvatarIcon, bgGradient, description, quickActions, faqs, contactEmail, contactPhone } = data;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link to="/help" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition">
        <ArrowLeft className="w-4 h-4 mr-1" /> All help topics
      </Link>

      {/* Hero card with avatar and role */}
      <div className={`bg-gradient-to-r ${bgGradient} rounded-2xl shadow-xl p-6 md:p-8 text-white mb-8`}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
            <AvatarIcon className="w-16 h-16" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
            <p className="mt-3 text-white/90 max-w-2xl">{description}</p>
          </div>
        </div>
      </div>

      {/* Quick actions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {quickActions.map((action, idx) => (
          <Link
            key={idx}
            to={action.link}
            className="flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
          >
            <action.icon className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-800">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Two columns: FAQ + Contact */}
        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-10 border border-gray-100">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-blue-500" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group border-b border-gray-100 pb-3">
                <summary className="font-medium text-gray-800 cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <span className="text-blue-500 group-open:rotate-180 transition-transform"><ChevronDown /></span>
                </summary>
                <p className="mt-2 text-gray-600 pl-2">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-blue-500" /> Contact Support
          </h2>
          <div className="space-y-4">
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow transition">
              <Mail className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">{contactEmail}</span>
            </a>
            {contactPhone && (
              <a href={`tel:${contactPhone}`} className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow transition">
                <Phone className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">{contactPhone}</span>
              </a>
            )}
            <div className="mt-4 p-4 bg-blue-50 rounded-xl text-blue-800 text-sm">
              ⏰ Live chat available Mon–Fri, 9am–6pm ET.
            </div>
          </div>
        </div>
    </div>
  );
};

// ========== 3. Original "all categories" page (when no param or /help) ==========
const AllCategories = () => {
  const categories = [
    { key: 'patient', name: 'Patients Support Center', icon: User, color: 'from-blue-500 to-cyan-400', desc: 'Appointments, records, billing' },
    { key: 'doctor', name: 'Find Doctors / Specialists Support Center', icon: Stethoscope, color: 'from-emerald-500 to-teal-400', desc: 'Schedules, e‑scripts, chats' },
    { key: 'facility', name: 'Find Facility / Services Support Center', icon: Building2, color: 'from-purple-500 to-pink-400', desc: 'Staff, compliance, reports' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">How can we help you?</h1>
      <p className="text-center text-gray-600 mb-12">Choose your role to get personalized support</p>
      <div className="grid md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.key}
            to={`/help/${cat.key}`}
            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className={`bg-gradient-to-r ${cat.color} p-6 text-white`}>
              <cat.icon className="w-12 h-12 mb-3" />
              <h2 className="text-2xl font-bold">{cat.name}</h2>
            </div>
            <div className="p-5">
              <p className="text-gray-600">{cat.desc}</p>
              <span className="inline-block mt-4 text-blue-600 font-medium group-hover:translate-x-1 transition">
                Get help →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// ========== 4. Main Help component (uses router param) ==========
const Help = () => {
  const { username } = useParams();

  // If there's a username param, show the detailed person view
  // Otherwise show the category selection page
  return (
    <div>
      <Header />
      {username ? <PersonHelp /> : <AllCategories />}
      <Footer />
    </div>
  );
};

export default Help;