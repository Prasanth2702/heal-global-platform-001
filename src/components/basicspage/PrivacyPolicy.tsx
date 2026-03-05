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
                    <strong>:</strong> We collect information you provide
                    directly, including name, email address, medical specialty,
                    institution, and professional credentials.
                  </p>
                  <p>
                    <strong>Usage Data:</strong> We collect information about
                    how you use our platform, including pages visited, features
                    used, and interaction data.
                  </p>
                  <p>
                    <strong>Device Information:</strong> We may collect
                    device-specific information such as IP address, browser
                    type, and operating system.
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
                    <li>Provide and maintain our medical portal services</li>
                    <li>
                      Verify professional credentials and maintain platform
                      integrity
                    </li>
                    <li>
                      Facilitate community interactions and seminar
                      participation
                    </li>
                    <li>
                      Send important notifications about platform updates and
                      medical opportunities
                    </li>
                    <li>
                      Improve our services through analytics and user feedback
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  3. Data Sharing and Disclosure
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Professional Directory:</strong> Basic professional
                    information (name, specialty, institution) may be visible to
                    other verified medical professionals on the platform.
                  </p>
                  <p>
                    <strong>Legal Requirements:</strong> We may disclose
                    information when required by law or to protect the rights
                    and safety of our users.
                  </p>
                  <p>
                    <strong>Service Providers:</strong> We may share data with
                    trusted third-party service providers who assist in platform
                    operations.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  4. Data Security
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    We implement industry-standard security measures to protect
                    your personal information. However, no method of
                    transmission over the internet is 100% secure.
                  </p>
                  <p>
                    <strong>User Responsibility:</strong> Users are responsible
                    for maintaining the confidentiality of their account
                    credentials and for all activities under their account.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  5. Data Retention
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    We retain personal information for as long as necessary to
                    provide services and comply with legal obligations. Users
                    may request account deletion, subject to legal and
                    operational requirements.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  6. International Data Transfers
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    Your information may be transferred to and processed in
                    countries other than your country of residence. We ensure
                    appropriate safeguards are in place for such transfers.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">7. Your Rights</h2>
                <div className="space-y-3 text-gray-700">
                  <p>Depending on your location, you may have rights to:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Access, update, or delete your personal information</li>
                    <li>Object to or restrict processing of your data</li>
                    <li>Data portability</li>
                    <li>Withdraw consent where applicable</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">
                  8. Contact Information
                </h2>
                <div className="space-y-3 text-gray-700">
                  <p>
                    For privacy-related questions or requests, contact us at:
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

export default PrivacyPolicy;
