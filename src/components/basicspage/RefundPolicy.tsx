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
                Cancellation & Refund Policy
              </CardTitle>
              <p className="text-center text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  1. Appointment Cancellations
                </h2>
                <p className="text-gray-700">
                  <strong>Free Cancellation:</strong> Appointments can be cancelled free of charge up to 24 hours before the scheduled appointment time. Cancellations made within 24 hours of the appointment may be subject to a cancellation fee as determined by the healthcare provider.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>No-Show Policy:</strong> If you miss your scheduled appointment without prior cancellation, the full appointment fee will be charged and is non-refundable.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  2. Bed Booking Cancellations
                </h2>
                <p className="text-gray-700">
                  <strong>Bed Reservation:</strong> Bed bookings can be cancelled up to 48 hours before the scheduled admission date for a full refund of any advance payment made. Cancellations within 48 hours may incur a cancellation charge (typically 20-50% of the booking amount).
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Emergency Cancellations:</strong> In case of medical emergencies or unforeseen circumstances, please contact our support team immediately. We will work with the hospital to process your cancellation on a case-by-case basis.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  3. Diagnostic Test Bookings
                </h2>
                <p className="text-gray-700">
                  <strong>Lab Test Cancellations:</strong> Diagnostic test bookings can be cancelled up to 12 hours before the scheduled sample collection time for a full refund. Cancellations within 12 hours may incur a 25% cancellation fee.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Home Collection:</strong> If the lab is unable to collect the sample at the scheduled time due to technical issues, you are eligible for a full refund or free rescheduling.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  4. Refund Processing
                </h2>
                <p className="text-gray-700">
                  <strong>Refund Timeline:</strong> Approved refunds will be processed within 7-10 business days. The refund will be credited to the original payment method used during booking.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Payment Gateway Charges:</strong> Any payment gateway or transaction fees incurred during the original transaction may be deducted from the refund amount for cancellations made outside the free cancellation window.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  5. Provider-Initiated Cancellations
                </h2>
                <p className="text-gray-700">
                  <strong>Doctor/Hospital Cancellation:</strong> If your appointment or bed booking is cancelled by the healthcare provider (due to emergency, unavailability, or other reasons), you will receive a full refund of any amount paid. You will also be notified immediately and assisted in rescheduling with an alternative provider if desired.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  6. Technical Issues and Failed Transactions
                </h2>
                <p className="text-gray-700">
                  <strong>Failed Transactions:</strong> If your payment is deducted but booking confirmation is not received due to technical issues, please contact our support team immediately. We will verify the transaction and process a refund within 3-5 business days if the booking was not completed.
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Duplicate Payments:</strong> In case of accidental duplicate payments, please notify us immediately with transaction details. Duplicate payments will be refunded within 5-7 business days after verification.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  7. Non-Refundable Services
                </h2>
                <p className="text-gray-700">
                  The following services are non-refundable once accessed:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Teleconsultation fees for completed video/audio consultations</li>
                  <li>Membership or subscription fees for premium services</li>
                  <li>Already consumed services (e.g., completed lab tests, procedures)</li>
                  <li>Partial hospitalization charges for days already stayed</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  8. How to Request a Cancellation or Refund
                </h2>
                <p className="text-gray-700">
                  To cancel an appointment or request a refund:
                </p>
                <ol className="list-decimal pl-6 text-gray-700 space-y-1">
                  <li>Log in to your cloudhospitals.ai account</li>
                  <li>Go to "My Bookings" section</li>
                  <li>Select the booking you wish to cancel</li>
                  <li>Click on "Cancel Booking" and follow the instructions</li>
                  <li>For assistance, contact our support team</li>
                </ol>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  9. Policy Acceptance
                </h2>
                <p className="text-gray-700">
                  By booking appointments, beds, or diagnostic tests through cloudhospitals.ai, you acknowledge and agree to this Cancellation & Refund Policy. Different healthcare providers may have slightly varying cancellation policies, which will be clearly displayed at the time of booking.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">
                  10. Changes to This Policy
                </h2>
                <p className="text-gray-700">
                  We reserve the right to modify this policy at any time without prior notice. Any changes will be updated on this page. Continued use of the platform after changes are made constitutes acceptance of those changes.
                </p>
              </div>

              <div className="space-y-4 pt-6 bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold">Need Help with a Cancellation or Refund?</h3>
                <p className="text-gray-700">
                  For any queries regarding cancellations, refunds, or booking issues, please reach out to our support team:
                </p>
                <div className="space-y-2">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:refunds@cloudhospitals.ai"
                      className="text-blue-600 hover:underline"
                    >
                      refunds@cloudhospitals.ai
                    </a>
                  </p>
                  <p>
                    <strong>Support:</strong>{" "}
                    <a
                      href="mailto:support@cloudhospitals.ai"
                      className="text-blue-600 hover:underline"
                    >
                      support@cloudhospitals.ai
                    </a>
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    <a href="tel:+971504649918" className="text-blue-600 hover:underline">
                      +971 504-649-918
                    </a>{" "}
                    (Dubai Office)
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    <a href="tel:+13073104473" className="text-blue-600 hover:underline">
                      +1 307-310-4473
                    </a>{" "}
                    (USA Office)
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Please include your booking reference number and transaction details when contacting us for faster assistance.
                </p>
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