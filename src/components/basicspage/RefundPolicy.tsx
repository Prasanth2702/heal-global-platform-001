
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/pages/alldetails/Header";
import Footer from "@/pages/alldetails/Footer";
import { Link } from "react-router-dom";

const RefundPolicy = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Refund Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  1. No Refunds Once Payment is Processed
                </h2>
                <p className="text-gray-700">
                  All payments made through Razorpay in our TheFutureMed
                  platform are final and non-refundable. Once a transaction is
                  completed successfully, we do not offer any partial or full
                  refunds, cancellations, or chargebacks under any
                  circumstances.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  2. Service Acknowledgment
                </h2>
                <p className="text-gray-700">
                  Our platform clearly outlines the features, functionality, and
                  scope of services provided. Users are encouraged to fully
                  understand the nature of our offerings before making any
                  payment. By proceeding with payment, users confirm their
                  understanding and acceptance of the service scope.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  3. Technical Issues and Support
                </h2>
                <p className="text-gray-700">
                  In the unlikely event of technical issues or service
                  disruptions, our team will provide support to resolve the
                  issue as soon as possible. However, this does not qualify for
                  a refund. Please contact us at support@thefuturemed.com for
                  assistance.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">4. Policy Acceptance</h2>
                <p className="text-gray-700">
                  By making a payment on our platform, you expressly agree to
                  this Zero Refund Policy and waive any rights to dispute or
                  reverse the transaction through your bank or payment provider,
                  including Razorpay.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  5. Changes to This Policy
                </h2>
                <p className="text-gray-700">
                  We reserve the right to modify this policy at any time without
                  prior notice. Any changes will be updated on this page.
                  Continued use of the platform after changes are made
                  constitutes acceptance of those changes.
                </p>
              </div>

              <div className="space-y-4 pt-6">
                <h3 className="text-xl font-semibold">Need Help?</h3>
                <p className="text-gray-700">
                  For any queries or support, please reach out to us at:
                </p>
                <a
                  href="mailto:support@thefuturemed.com"
                  className="text-blue-600 hover:underline"
                >
                  support@thefuturemed.com
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RefundPolicy;
