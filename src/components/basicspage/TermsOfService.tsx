import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  ArrowLeft,
  User as UserIcon,
  LogOut,
  Home,
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
                 
                     <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="space-y-3 text-gray-700">
                                           <p>
                        This platform is for educational enhancement only and does not provide any licensing to practice medicine  , this platform
Provides certification modules and knowledge to upskill your existing knowledge
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
                      By accessing and using TheFutureMed, you accept and agree to
                      be bound by these Terms of Service. If you do not agree to
                      these terms, you may not use our platform.
                    </p>
                                      </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    2. Eligibility and Account Registration
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Professional Verification:</strong> This platform
                      is exclusively for verified medical professionals and
                      students. Users must provide accurate professional
                      credentials.
                    </p>
                    <p>
                      <strong>Account Security:</strong> Users are responsible
                      for maintaining account security and all activities under
                      their account.
                    </p>
                    <p>
                      <strong>False Information:</strong> Providing false or
                      misleading professional information may result in
                      immediate account termination.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    3. Platform Usage
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Permitted Use:</strong> The platform may be used
                      for professional medical networking, education, and
                      knowledge sharing.
                    </p>
                    <p>
                      <strong>Prohibited Activities:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>
                        Sharing patient information or violating HIPAA/privacy
                        regulations
                      </li>
                      <li>
                        Providing direct medical advice to patients through the
                        platform
                      </li>
                      <li>
                        Harassment, discrimination, or unprofessional conduct
                      </li>
                      <li>Spamming or unauthorized commercial activities</li>
                      <li>
                        Uploading malicious software or attempting to breach
                        security
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    4. Content and Intellectual Property
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>User Content:</strong> Users retain ownership of
                      content they post but grant TheFutureMed a license to use,
                      modify, and distribute such content on the platform.
                    </p>
                    <p>
                      <strong>Platform Content:</strong> All platform features,
                      design, and proprietary content are owned by TheFutureMed and
                      protected by intellectual property laws.
                    </p>
                    <p>
                      <strong>Medical Information:</strong> Content shared is
                      for educational purposes only and should not be considered
                      as medical advice for specific patients.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    5. Limitation of Liability
                  </h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="space-y-3 text-gray-700">
                      <p>
                        <strong>PLATFORM DISCLAIMER:</strong> TheFutureMed provides
                        a networking and educational platform only. We are not
                        responsible for:
                      </p>
                      <ul className="list-disc pl-6 space-y-1">
                        <li>
                          Medical decisions made based on platform content
                        </li>
                        <li>Technical issues, data loss, or system downtime</li>
                        <li>Loss or corruption of uploaded files</li>
                        <li>Actions or misconduct of other users</li>
                        <li>Third-party content or external links</li>
                        <li>
                          Data breaches due to circumstances beyond our control
                        </li>
                      </ul>
                      <p>
                        <strong>USER RESPONSIBILITY:</strong> Users must
                        maintain secure backups of important files and verify
                        all medical information independently.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    6. Data Usage and Promotion
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <strong>Promotional Use:</strong> TheFutureMed may use
                      aggregated, anonymized data and user testimonials for
                      promotional purposes, subject to privacy policy terms.
                    </p>
                    <p>
                      <strong>Professional Recognition:</strong> Outstanding
                      contributions to the platform may be highlighted in
                      marketing materials with user consent.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    7. Platform Availability
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      We strive to maintain platform availability but do not
                      guarantee uninterrupted service. Maintenance, updates, or
                      technical issues may cause temporary disruptions.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    8. Termination
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      We reserve the right to suspend or terminate accounts for
                      violations of these terms, professional misconduct, or
                      other reasons at our discretion.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    9. Governing Law
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      These terms are governed by applicable international laws
                      and regulations regarding digital platforms and medical
                      data privacy.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-3">
                    10. Contact Information
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p>
                      For questions about these terms, contact us at:
                      support@thefuturemed.com
                    </p>
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
