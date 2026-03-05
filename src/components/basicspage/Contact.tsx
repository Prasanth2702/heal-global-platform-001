import React, { useState } from "react";
// ⚠️ DISABLED: import { Container, Row, Col, Form, Card, Alert } from "react-bootstrap";
import "./Contact.css";
import { Button } from "@/components/ui/button";
import Header from "@/pages/alldetails/Header";
import Footer from "@/pages/alldetails/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
  });
  const api_key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4eWZyamZneWRsZGpkcWVsaXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNzQxNzUsImV4cCI6MjA2Mzk1MDE3NX0.AIsRdTcohJH6VHHhpsYpFJriMN0qJ_tqd6dxHtd7o_c";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      setSubmitStatus({
        success: false,
        message: "Please agree to the terms and conditions",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: "" });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/contact-us-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Remove Authorization header and use only apikey
            Authorization: `Bearer ${api_key}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      setSubmitStatus({
        success: true,
        message:
          data.message ||
          "Thank you for your message! We'll get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
        phone: "",
      });
      setAgreed(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while sending your message",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="contact-us-page">
        <Header />

        <main className="contact-main p-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
              {/* Contact Form Column */}
              <div className="lg:col-span-4 mb-5">
                <div className="bg-white rounded-lg shadow-sm mb-4 p-6">
                  <h2 className="section-title text-2xl font-bold mb-4">
                    Have Any Questions For Us?
                  </h2>
                  <p className="section-subtitle text-gray-600 mb-6">
                    Various versions have evolved over the years, sometimes by
                    accident, sometimes on purpose injected humour and the like.
                  </p>

                  {submitStatus.message && (
                    <div
                      className={`mb-4 p-4 rounded ${
                        submitStatus.success
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {submitStatus.message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block font-medium mb-2"
                        >
                          Your Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-300 rounded px-4 py-2"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block font-medium mb-2"
                        >
                          Your Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-300 rounded px-4 py-2"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="phone" className="block font-medium mb-2">
                        Your Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-4 py-2"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="message"
                        className="block font-medium mb-2"
                      >
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Enter your message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded px-4 py-2"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          required
                          className="mr-2"
                        />
                        <span>
                          By clicking you agree to our{" "}
                          <a
                            href="/terms-of-service"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            terms & conditions
                          </a>
                        </span>
                      </label>
                    </div>

                    <Button
                      className="submit-btn w-full"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Submit"}
                    </Button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-sm mb-4 p-6">
                  <div className="contact-info-section">
                    <h3 className="info-title font-bold mb-2">UK Office</h3>
                    <p className="info-content text-gray-600">
                      THEFUTUREMED Global LLC
                      <br />
                      128 City Road
                      <br />
                      London, EC1V 2NX
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm mb-4 p-6">
                  <div className="contact-info-section">
                    <h3 className="info-title font-bold mb-2">Dubai Office</h3>
                    <p className="info-content text-gray-600">
                      PMHS Tech Solutions
                      <br />
                      Al Quasis,
                      <br />
                      Rag business hub,
                      <br />
                      Dubai.
                      <br />
                      <br />
                      <a href="tel:+971504649918" className="text-blue-600">
                        +971 504-649-918
                      </a>
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm mb-4 p-6">
                  <div className="contact-info-section">
                    <h3 className="info-title font-bold mb-2">USA Office</h3>
                    <p className="info-content text-gray-600">
                      THEFUTUREMED Global LLC
                      <br />
                      8 The Green Suite B, Dover, Delaware 19901
                      <br />
                      Sheridan, WY 82801
                      <br />
                      <br />
                      <a href="tel:+13073104473" className="text-blue-600">
                        +1 307-310-4473
                      </a>
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm mb-4 p-6">
                  <div className="contact-info-section">
                    <h3 className="info-title font-bold mb-2">Email</h3>
                    <p className="info-content text-gray-600">
                      <a
                        href="mailto:drshan@thefuturemed.com"
                        className="text-blue-600"
                      >
                        drshan@thefuturemed.com
                      </a>
                    </p>
                    <p className="info-content text-gray-600">
                      <a
                        href="mailto: support@thefuturemed.com"
                        className="text-blue-600"
                      >
                        support@thefuturemed.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-1 lg:col-span-7 bg-white rounded-lg shadow-sm p-6 mt-4">
                <h3 className="info-title font-bold mb-4">Our Location</h3>
                <div className="map-container mb-4">
                  <iframe
                    title="PMHS Health Care Physio Rehab Services Location"
                    width="100%"
                    height="300"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src="https://maps.google.com/maps?q=13.000886,77.623536&z=15&output=embed"
                  />
                </div>
                <div className="text-center">
                  <Button className="directions-btn" asChild>
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=PMHS+Health+Care+Physio+Rehab+Services,+6%2F8+high+street+D+Costa+layout+wheelers+road,+6,+extension,+Bengaluru,+Karnataka+560006"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
