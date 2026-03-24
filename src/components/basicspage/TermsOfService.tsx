import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  ArrowLeft,
  User as UserIcon,
  LogOut,
  Home,
  Calendar,
  Bed,
  Hospital,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/image/thefuturemed_logo (1).jpg";
import { useEffect, useState } from "react";
import Header from "@/pages/alldetails/Header";
import Footer from "@/pages/alldetails/Footer";

const TermsOfService = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleBackNavigation = () => navigate(-1);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Header */}
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">
                  Terms of Service
                </CardTitle>
                <p className="text-center text-gray-600">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="space-y-3 text-gray-700">
                      <p className="font-medium text-blue-800">
                        Welcome to cloudhospitals.ai – Your Trusted Healthcare Booking Platform
                      </p>
                      <p>
                        cloudhospitals.ai is a digital platform that connects patients with healthcare providers for 
                        appointment scheduling, bed reservations, and diagnostic test bookings. By using our services, 
                        you agree to these Terms of Service.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    1. Acceptance of Terms
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      By accessing and using cloudhospitals.ai, you accept and agree to
                      be bound by these Terms of Service. If you do not agree to
                      these terms, you may not use our platform. These terms apply to 
                      all users, including patients, healthcare providers, and hospital administrators.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    2. Account Registration and Eligibility
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Patient Accounts:</strong> To book appointments or reserve beds, you must 
                      create an account with accurate personal information including name, contact details, 
                      and emergency contact information. You must be at least 18 years old to create an account.
                    </p>
                    <p>
                      <strong>Healthcare Provider Accounts:</strong> Hospitals, clinics, and individual 
                      practitioners must provide valid registration credentials, licenses, and professional 
                      qualifications to list services on our platform.
                    </p>
                    <p>
                      <strong>Account Security:</strong> You are responsible for maintaining the 
                      confidentiality of your account credentials and for all activities under your account.
                    </p>
                    <p>
                      <strong>False Information:</strong> Providing false or misleading information may 
                      result in immediate account termination and cancellation of bookings.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    3. Booking and Payment Terms
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Appointment Booking:</strong> When you book an appointment through cloudhospitals.ai, 
                      you agree to pay any applicable consultation fees. Appointments are subject to the 
                      healthcare provider's availability and cancellation policies.
                    </p>
                    <p>
                      <strong>Bed Reservations:</strong> Bed bookings require advance payment or deposit 
                      as specified at the time of booking. Bed availability is subject to change based on 
                      hospital occupancy and emergencies.
                    </p>
                    <p>
                      <strong>Diagnostic Tests:</strong> Lab test bookings include sample collection fees 
                      where applicable. Test results are provided directly by the diagnostic center.
                    </p>
                    <p>
                      <strong>Payment Processing:</strong> All payments are processed securely through 
                      our payment partners. By making a payment, you authorize us to charge your selected 
                      payment method.
                    </p>
                    <p>
                      <strong>Cancellations and Refunds:</strong> All cancellations and refunds are governed 
                      by our separate Cancellation & Refund Policy, which is incorporated into these terms.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    4. User Responsibilities
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Accurate Information:</strong> You must provide accurate medical history and 
                      symptom information when booking appointments to ensure appropriate care.
                    </p>
                    <p>
                      <strong>Timely Arrival:</strong> You agree to arrive on time for scheduled appointments 
                      and inform providers of any delays.
                    </p>
                    <p>
                      <strong>Cancellation Notice:</strong> You agree to cancel bookings within the specified 
                      timeframe to avoid cancellation fees.
                    </p>
                    <p>
                      <strong>Prohibited Activities:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Making fraudulent bookings or providing false information</li>
                      <li>Attempting to bypass payment or booking systems</li>
                      <li>Harassing healthcare providers or staff</li>
                      <li>Using the platform for any unlawful purpose</li>
                      <li>Uploading malicious software or attempting to breach security</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    5. Healthcare Provider Responsibilities
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Accuracy of Listings:</strong> Healthcare providers agree to maintain accurate 
                      information regarding services, availability, fees, and qualifications.
                    </p>
                    <p>
                      <strong>Timely Updates:</strong> Providers must update availability in real-time and 
                      honor bookings made through the platform.
                    </p>
                    <p>
                      <strong>Quality of Care:</strong> Providers are solely responsible for the quality of 
                      medical care provided to patients.
                    </p>
                    <p>
                      <strong>Professional Conduct:</strong> Providers agree to treat all patients with 
                      respect and follow applicable medical ethics and regulations.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    6. Limitation of Liability
                  </h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="space-y-3 text-gray-700">
                      <p>
                        <strong>PLATFORM DISCLAIMER:</strong> cloudhospitals.ai provides a booking platform only. 
                        We are not responsible for:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>The quality of medical care provided by healthcare facilities</li>
                        <li>Medical outcomes or treatment decisions</li>
                        <li>Cancellations or changes made by healthcare providers</li>
                        <li>Technical issues preventing booking or access</li>
                        <li>Loss or corruption of data</li>
                        <li>Disputes between patients and providers</li>
                        <li>Errors in provider listings or availability</li>
                      </ul>
                      <p className="mt-2">
                        <strong>USER RESPONSIBILITY:</strong> Users should verify provider credentials 
                        independently and make informed healthcare decisions.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    7. Medical Emergency Disclaimer
                  </h2>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="space-y-3 text-gray-700">
                      <p className="font-medium text-red-800">
                        ⚠️ IMPORTANT: NOT FOR EMERGENCIES
                      </p>
                      <p>
                        cloudhospitals.ai is NOT an emergency service. If you are experiencing a medical emergency, 
                        please call your local emergency services immediately (such as 911 in the US, 112 in Europe, 
                        102 or 108 in India).
                      </p>
                      <p>
                        Do not use our platform for urgent medical needs requiring immediate attention.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    8. Intellectual Property
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Platform Content:</strong> All platform features, design, logos, and proprietary 
                      content are owned by cloudhospitals.ai and protected by intellectual property laws.
                    </p>
                    <p>
                      <strong>User Content:</strong> By submitting reviews or feedback, you grant us a 
                      license to use such content for platform improvement and promotional purposes.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    9. Platform Availability and Modifications
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      We strive to maintain platform availability but do not guarantee uninterrupted service. 
                      We reserve the right to modify, suspend, or discontinue any part of the platform at any 
                      time without notice.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    10. Termination
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      We reserve the right to suspend or terminate accounts for violations of these terms, 
                      fraudulent activity, or other reasons at our discretion. Upon termination, any pending 
                      bookings may be cancelled subject to our refund policy.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    11. Governing Law and Dispute Resolution
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      These terms are governed by applicable laws. Any disputes arising from your use of 
                     cloudhospitals.ai shall be resolved through good-faith negotiations. If a resolution cannot 
                      be reached, disputes may be submitted to binding arbitration.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    12. Changes to Terms
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      We may update these terms periodically. Continued use of the platform after changes 
                      constitutes acceptance of the updated terms.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    13. Contact Information
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    {/* <p>
                      For questions about these terms, booking issues, or general inquiries:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p><strong>Email:</strong> <a href="mailto:legal@healglobe.com" className="text-blue-600 hover:underline">legal@healglobe.com</a></p>
                      <p><strong>Support:</strong> <a href="mailto:support@healglobe.com" className="text-blue-600 hover:underline">support@healglobe.com</a></p>
                      <p><strong>UK Office:</strong> HealGlobe Global LLC, 128 City Road, London, EC1V 2NX, United Kingdom</p>
                      <p><strong>Dubai Office:</strong> HealGlobe Tech Solutions, Al Quasis, Rag business hub, Dubai, UAE</p>
                      <p><strong>USA Office:</strong> HealGlobe Global LLC, 8 The Green Suite B, Dover, Delaware 19901, United States</p>
                    </div> */}
                     <div className="space-y-3 text-gray-700">
                    <p>
                      For questions about these terms, booking issues, or general inquiries, contact us at:
                      <p><strong>Support:</strong> <a href="mailto:support@cloudhospitals.ai" className="text-blue-600 hover:underline">support@cloudhospitals.ai</a></p>
                    </p>
                  </div>
                  </div>
                </section>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TermsOfService;