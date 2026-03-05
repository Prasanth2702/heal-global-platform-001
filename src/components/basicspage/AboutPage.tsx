
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Building,
  ArrowLeft,
  Shield,
  UserPlus,
  Home,
  User,
  X,
  Lock,
  Laptop,
  Users,
  GraduationCap,
  Menu,
  LogOut,
  UserIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import logo from "@/image/thefuturemed_logo (1).jpg";
import Header from "@/pages/alldetails/Header";
import Footer from "@/pages/alldetails/Footer";

const AboutPage = () => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBackNavigation = () => {
    navigate(-1);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      toast({ title: "Signed Out", description: "You have been signed out." });
      navigate("/");
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();
  }, []);

  return (
    <>
   
    <div className="space-y-6">
      {/* Header with Sheet component wrapping mobile menu */}
      <Header/>

      {/* Page content remains the same */}
      <div className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1 bg-white p-5 md:p-6 shadow rounded-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              About PMHS
              {/* About PMHS Smarthealth LLP */}
            </h2>
            <p className="text-gray-700 text-sm md:text-base">
              <strong className="bold">
                Prestige Medical Health Sciences (PMHS)
              </strong>
              , founded in 2016 in Bangalore, now embraces a forward-thinking
              ideology—revolutionizing the medical industry into the digital era
              through <strong>THEFUTUREMED.com</strong>. to transform medical
              education through a cutting-edge digital platform. This platform
              is designed to empower aspiring healthcare professionals by
              providing high-quality, accessible online courses and interactive
              learning experiences in allied health sciences.
            </p>
            <p className="text-gray-700 mt-4 text-sm md:text-base">
              {" "}
              Our mission is to create a holistic ecosystem where students can
              gain comprehensive knowledge in fields such as Nursing, Medical
              Imaging Technology, Medical Laboratory Technology, Optometry, and
              Physiotherapy. Beyond traditional learning, the platform offers a
              unique “earn while you teach” model, enabling qualified
              professionals and educators to share their expertise, conduct live
              sessions, and mentor students, while generating income from their
              contributions.
            </p>
            <p className="text-gray-700 mt-4 text-sm md:text-base">
              {" "}
              By integrating modern educational tools, virtual classrooms, and
              practical training modules, this digital initiative aims to
              nurture the next generation of medical professionals, bridging the
              gap between classroom learning and real-world healthcare demands.
              PMHS envisions a community-driven platform where knowledge
              sharing, professional growth, and earning opportunities converge,
              creating a sustainable and impactful approach to healthcare
              education in India and beyond.
            </p>
            <p className="text-gray-700 mt-4 text-sm md:text-base">
              Further, PMHS has also ventured into its first diagnostic center
              in Bangalore city. With a legacy spanning three generations in the
              education sector.
            </p>
          </div>

          {/* Right Column */}
          <div className="flex-1 bg-white p-5 md:p-6 shadow rounded-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Our Mission</h2>
            <img
              src="/image.jpeg"
              alt="Our mission"
              className="w-full h-40 md:h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700 text-sm md:text-base">
              Our mission is to empower users by delivering high-quality,
              accessible information...
            </p>
          </div>
        </div>

        {/* Section: Our Team */}
        <div className="max-w-6xl mx-auto mt-8 bg-white p-5 md:p-6 shadow rounded-lg">
          <h2 className="text-xl md:text-3xl font-bold mb-4">Our Team</h2>
          <p className="text-gray-700 mb-6 text-sm md:text-base">
            Meet the experts behind <strong>THEFUTUREMED.com</strong> – a unique
            blend of medical professionals, AI engineers, and education
            specialists.
          </p>

          <div className="space-y-6">
            {/* Team Member 1 */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-white p-5 md:p-6 shadow rounded-lg">
                <h3 className="text-lg md:text-xl font-semibold text-blue-700">
                  Dr. Mohammed Ahetasham, M.B.B.S, M.D.R.D
                </h3>
                <p className="text-sm md:text-base font-medium text-gray-800">
                  Founder & Chairman – Prestige Medical Health Sciences (PMHS)
                </p>
                <p className="text-gray-700 mt-2 text-sm md:text-base">
                  Dr. Mohammed Ahetasham is a visionary healthcare innovator,
                  accomplished Radiologist, and Founder & Chairman of Prestige
                  Medical Health Sciences (PMHS). With over 12 years of
                  experience in the medical industry, he has been instrumental
                  in advancing the intersection of clinical excellence, academic
                  leadership, and digital transformation.
                </p>
                <p className="text-gray-700 mt-2 text-sm md:text-base">
                  His career spans extensive clinical practice, academic
                  research, and leadership in the adoption of emerging
                  technologies such as medical prompting, AI, machine learning,
                  agentic platforms, and no-code healthtech solutions.
                </p>
                {/* <p className="text-gray-700 mt-2 text-sm md:text-base">
                After earning his M.B.B.S. from Vydehi Institute of Medical
                Sciences and Research Centre in 2009, Dr. Ahetasham served as a
                Consultant Radiologist across leading institutions such as
                NIMHANS, Kidwai Memorial Institute, Narayana Health, Apollo
                Cradle, and Anand Diagnostic. He completed his M.D.R.D from Dr.
                B.R. Ambedkar Medical College in 2016, the same year he
                established PMHS with a mission to deliver globally relevant,
                future-ready healthcare education.
              </p> */}
              </div>

              {/* Team Member 2 */}
              <div className="flex-1 bg-white p-5 md:p-6 shadow rounded-lg">
                <h3 className="text-lg md:text-xl font-semibold text-blue-700">
                  Suresh Kannan
                </h3>
                <p className="text-sm md:text-base font-medium text-gray-800">
                  Senior Technology Leader | AI Platforms & Product Delivery
                </p>
                <p className="text-gray-700 mt-2 text-sm md:text-base">
                  An accomplished technology leader with over 25 years of
                  experience in driving innovation across product engineering,
                  software architecture, and large-scale project delivery. Known
                  for successfully leading global teams and delivering
                  intelligent, AI-powered solutions.
                </p>
                <p className="text-gray-700 mt-2 text-sm md:text-base">
                  With deep expertise in cloud infrastructure, AI/ML systems,
                  and large language models (LLMs), this executive has played a
                  critical role in building next-generation platforms.
                </p>
                {/* <p className="text-gray-700 mt-2 text-sm md:text-base">
                Highly proficient in integrating low-code and no-code platforms,
                orchestrating end-to-end delivery pipelines, and managing
                deployments across cloud-native environments like Supabase, they
                bring a strategic, hands-on approach to transforming digital
                ecosystems. With a focus on aligning technical capabilities to
                business goals, they consistently drive measurable outcomes and
                lasting value.
              </p> */}
              </div>
            </div>
          </div>
        </div>

        {/* New Section Below the Two Columns */}
        <div className="max-w-6xl mx-auto mt-8 bg-white p-5 md:p-6 shadow rounded-lg">
          <h2 className="text-xl md:text-3xl font-bold mb-4">
            Our Mission and Approach
          </h2>
          <p className="text-gray-700 mb-4 text-sm md:text-base">
            Empower Your Medical Career with <strong>THEFUTUREMED.com</strong> —
            The Community of Medics created by a Medic, for the Medics,
            Globally. The ultimate platform for medical professionals to learn,
            connect, and earn digitally.
          </p>

          <h3 className="text-lg md:text-xl font-semibold mt-5 mb-2">
            Why Choose THEFUTUREMED.com?
          </h3>
          <p className="text-gray-700 mb-4 text-sm md:text-base">
            A one-stop platform designed exclusively for medical professionals
            including Doctors, Dentists, Nurses, Physiotherapists, Allied Health
            Workers, Ayurveda Practitioners, Homeopaths, Unani Practitioners,
            Dieticians, and more.
          </p>

          <h3 className="text-base md:text-lg font-semibold mt-4">
            Our Features: Learn, Connect, and Earn
          </h3>

          <ul className="list-disc list-inside text-gray-700 space-y-3 mt-2 text-sm md:text-base">
            <li>
              <strong>Host or Attend Medical Seminars and Conferences</strong>
              <br />
              Share expertise or gain insights from healthcare leaders:
              <ul className="list-disc ml-6 mt-1">
                <li>Host online medical conferences</li>
                <li>Attend interactive seminars on trending topics</li>
                <li>Earn by sharing knowledge globally</li>
              </ul>
            </li>

            <li>
              <strong>E-Learning Modules & Certifications</strong>
              <br />
              Upskill or monetize your expertise:
              <ul className="list-disc ml-6 mt-1">
                <li>Expert-led modules for skill development</li>
                <li>Host and sell your own courses</li>
                <li>Accredited programs for growth</li>
              </ul>
            </li>

            <li>
              <strong>Job Portal for Healthcare Professionals</strong>
              <br />
              Post your resume or discover jobs from hospitals and clinics for
              full-time or part-time roles.
            </li>
          </ul>

          <h3 className="text-base md:text-lg font-semibold mt-5">
            Why THEFUTUREMED.com Stands Out
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2 text-sm md:text-base">
            <li>Global Reach: Connect with professionals worldwide</li>
            <li>Community-Driven: Collaborate within a thriving network</li>
            <li>Monetization Opportunities: Seminars, e-stores, and more</li>
          </ul>

          <h3 className="text-base md:text-lg font-semibold mt-5">
            Explore Our Key Offerings
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2 text-sm md:text-base">
            <li>
              <strong>Community for Medics:</strong> Collaborate on research,
              share insights, and grow your network.
            </li>
            <li>
              <strong>Publish Research & Journals:</strong> Upload and share
              your medical publications.
            </li>
            <li>
              <strong>E-Store for :</strong> Sell books, instruments, and more
              via your landing page.
            </li>
          </ul>

          <h3 className="text-base md:text-lg font-semibold mt-5">
            How THEFUTUREMED.com Benefits You
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2 text-sm md:text-base">
            <li>Boost Visibility through a global medical network</li>
            <li>Earn More by teaching, hosting, or selling</li>
            <li>Expand Knowledge with certified courses and events</li>
          </ul>

          <p className="text-blue-700 font-semibold mt-5 text-sm md:text-base">
            👉 Join <strong>THEFUTUREMED.com</strong> Today!
          </p>
        </div>

        {/* Section: Commitment to Excellence */}
        {/* <div className="max-w-6xl mx-auto mt-8 bg-white p-5 md:p-6 shadow rounded-lg">
          <h2 className="text-xl md:text-3xl font-bold mb-4">
            Commitment to Excellence and Student Success
          </h2>
          <p className="text-gray-700 text-sm md:text-base">
            At PMHS, we pride ourselves on our experienced faculty and
            state-of-the-art facilities, ensuring that our students receive a
            comprehensive education that meets global standards. Our commitment
            to excellence is reflected in our{" "}
            <strong>100% placement record</strong>, with many graduates securing
            positions within our own network of specialized healthcare
            facilities.
          </p>
        </div> */}

        {/* Section: Highlights or Features */}
        {/* <div className="max-w-6xl mx-auto mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="bg-white shadow rounded-lg p-5 text-center">
              <Building className="mx-auto mb-3 h-8 w-8 md:h-10 md:w-10 text-blue-500" />
              <h3 className="text-lg md:text-xl font-semibold mb-3">
                Organisations
              </h3>
              <ol className="list-decimal list-inside text-left text-gray-600 space-y-1 text-sm md:text-base">
                <li>Para medical AHS college</li>
                <li>Physiotherapy college</li>
                <li>Nursing College</li>
                <li>Health care services and diagnostics</li>
                <li>Physio rehab centers</li>
              </ol>
            </div>

            <div className="bg-white shadow rounded-lg p-5 text-center">
              <Laptop className="mx-auto mb-3 h-8 w-8 md:h-10 md:w-10 text-blue-500" />
              <h3 className="text-lg md:text-xl font-semibold mb-3">
                Our Digital Products
              </h3>
              <div className="text-left text-gray-600 space-y-2 text-sm md:text-base">
                <ol className="list-decimal list-inside">
                  <li>THEFUTUREMED – A safe haven for Health care heroes</li>
                  <li className="mt-1">
                    PMHS Smart Health – Platform with Tele Consultation, Tele
                    Radiology, EMR software, Billing software
                  </li>
                </ol>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-5 text-center">
              <Users className="mx-auto mb-3 h-8 w-8 md:h-10 md:w-10 text-blue-500" />
              <h3 className="text-lg md:text-xl font-semibold mb-3">
                Groups To Discuss
              </h3>
              <ul className="list-decimal list-inside text-left text-gray-600 space-y-1 text-sm md:text-base">
                <li>In house Tech company</li>
              </ul>
            </div>
          </div>
        </div> */}
      </div>
      <Footer/>
    </div>
    </>
  );
};

export default AboutPage;
