import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/pages/alldetails/Header";
import Footer from "@/pages/alldetails/Footer";

const PrivacyPolicy = () => {
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
                Privacy Policy
              </CardTitle>
              <p className="text-center text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  1. Information We Collect
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Personal Information:</strong> When you book appointments or reserve beds through cloudhospitals.ai, we collect personal details including your full name, date of birth, contact information (phone, email), and emergency contact information.
                  </p>
                  <p>
                    <strong>Medical Information:</strong> To facilitate appropriate healthcare services, we may collect relevant medical history, current symptoms, insurance details, and information about your preferred healthcare providers.
                  </p>
                  <p>
                    <strong>Payment Information:</strong> When you make payments for appointments or bed reservations, we collect billing information. Payment processing is handled securely by our third-party payment processors.
                  </p>
                  <p>
                    <strong>Device and Usage Data:</strong> We automatically collect information about how you access and use our platform, including IP address, browser type, pages visited, and appointment booking patterns.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  2. How We Use Your Information
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>We use collected information to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Process and confirm your appointment bookings with healthcare providers</li>
                    <li>Manage bed reservations and hospital admissions</li>
                    <li>Communicate appointment reminders and updates via SMS, email, or push notifications</li>
                    <li>Share relevant medical information with healthcare providers (with your consent)</li>
                    <li>Process payments and provide billing information</li>
                    <li>Improve our booking algorithms and user experience</li>
                    <li>Respond to customer support inquiries and resolve issues</li>
                    <li>Comply with healthcare regulations and legal requirements</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  3. Data Sharing and Disclosure
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Healthcare Providers:</strong> When you book an appointment or reserve a bed, we share necessary information with the respective hospitals, clinics, and healthcare providers to facilitate your care.
                  </p>
                  <p>
                    <strong>Payment Processors:</strong> We share billing information with secure third-party payment processors to handle financial transactions.
                  </p>
                  <p>
                    <strong>Legal Requirements:</strong> We may disclose information when required by law, court order, or to protect the rights and safety of our users and the public.
                  </p>
                  <p>
                    <strong>Service Providers:</strong> We may share data with trusted third-party service providers who assist in platform operations, analytics, and customer support, subject to confidentiality agreements.
                  </p>
                  <p className="font-medium mt-2">
                    We never sell your personal or medical information to third parties for marketing purposes.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  4. Data Security
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal and medical information. We are committed to maintaining HIPAA-compliant standards where applicable.
                  </p>
                  <p>
                    <strong>User Responsibility:</strong> Users are responsible for maintaining the confidentiality of their account credentials and for all activities under their account. Please notify us immediately of any unauthorized use.
                  </p>
                  <p>
                    While we strive to protect your data, no method of transmission over the internet is 100% secure. We continuously update our security practices to address emerging threats.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  5. Data Retention
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    We retain personal and medical information for as long as necessary to provide services, comply with legal obligations (including healthcare record retention laws), resolve disputes, and enforce our agreements.
                  </p>
                  <p>
                    Appointment and bed booking history may be retained to improve future service recommendations and for medical continuity purposes. Users may request account deletion, subject to legal and operational requirements.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  6. International Data Transfers
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    Your information may be transferred to and processed in countries other than your country of residence to facilitate booking services with international healthcare providers. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">7. Your Rights</h2>
                <div className="space-y-3 text-gray-700">
                  <p>Depending on your location, you may have rights to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Access your personal and medical information</li>
                    <li>Update or correct inaccurate information</li>
                    <li>Request deletion of your data (subject to legal retention requirements)</li>
                    <li>Object to or restrict processing of your data</li>
                    <li>Data portability - receive your data in a structured format</li>
                    <li>Withdraw consent for data processing where applicable</li>
                    <li>Opt-out of marketing communications</li>
                  </ul>
                  <p className="mt-2">
                    To exercise these rights, please contact us using the information below.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  8. Children's Privacy
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    cloudhospitals.ai services are intended for individuals 18 years and older. For minors requiring healthcare services, bookings must be made by a parent or legal guardian who accepts responsibility for all provided information.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  9. Changes to This Policy
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify users of significant changes through the platform or via email. Your continued use of cloudhospitals.ai after changes constitutes acceptance of the updated policy.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  10. Contact Information
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    For privacy-related questions, concerns, or to exercise your rights, please contact us at:
                  </p>
                  <p className="font-medium">
                    Email: privacy@cloudhospitals.ai
                  </p>
                  <p>
                    Or write to us at:
                    <br />
                   CloudHospitals LLC
                    <br />
                    128 City Road
                    <br />
                    London, EC1V 2NX
                    <br />
                    United Kingdom
                  </p>
                  <p className="mt-2">
                    For immediate support regarding your appointments or bed bookings, contact:
                    <br />
                    support@cloudhospitals.ai
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

export default PrivacyPolicy;