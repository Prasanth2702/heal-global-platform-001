import React, { useState, useEffect } from 'react';
import { 
  Cookie, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Info, 
  Shield, 
  Globe, 
  Lock,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import Header from '@/pages/alldetails/Header';
import Footer from '@/pages/alldetails/Footer';

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  cookies: CookieDetail[];
}

interface CookieDetail {
  name: string;
  provider: string;
  purpose: string;
  expiry: string;
  type: string;
}

const CookiePolicy: React.FC = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['necessary']);
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false
  });
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    // Check if user has already set preferences
    const savedPreferences = localStorage.getItem('cookiePreferences');
    if (savedPreferences) {
      setCookiePreferences(JSON.parse(savedPreferences));
      setShowBanner(false);
    }
  }, []);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    setCookiePreferences(allAccepted);
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    setCookiePreferences(onlyNecessary);
    localStorage.setItem('cookiePreferences', JSON.stringify(onlyNecessary));
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    setShowBanner(false);
    setShowSettings(false);
    setShowConsentModal(true);
    setTimeout(() => setShowConsentModal(false), 3000);
  };

  // Cookie categories with detailed information
  const cookieCategories: CookieCategory[] = [
    {
      id: 'necessary',
      name: 'Necessary Cookies',
      description: 'These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies.',
      required: true,
      cookies: [
        {
          name: 'PHPSESSID',
          provider: 'Healthcare System',
          purpose: 'Preserves user session state across page requests',
          expiry: 'Session',
          type: 'HTTP Cookie'
        },
        {
          name: 'csrf_token',
          provider: 'Healthcare System',
          purpose: 'Ensures form submission security and prevents cross-site request forgery',
          expiry: 'Session',
          type: 'HTTP Cookie'
        },
        {
          name: 'cookiePreferences',
          provider: 'Healthcare System',
          purpose: 'Stores your cookie consent preferences',
          expiry: '1 year',
          type: 'HTTP Cookie'
        },
        {
          name: 'session_security',
          provider: 'Healthcare System',
          purpose: 'Maintains secure user session and authentication',
          expiry: 'Session',
          type: 'HTTP Cookie'
        }
      ]
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      description: 'These cookies enhance the functionality and personalization of our website. They remember your preferences and help provide enhanced features.',
      required: false,
      cookies: [
        {
          name: 'language_preference',
          provider: 'Healthcare System',
          purpose: 'Remembers your preferred language for the website',
          expiry: '6 months',
          type: 'HTTP Cookie'
        },
        {
          name: 'theme_preference',
          provider: 'Healthcare System',
          purpose: 'Saves your display preferences (dark/light mode)',
          expiry: '6 months',
          type: 'HTTP Cookie'
        },
        {
          name: 'recent_searches',
          provider: 'Healthcare System',
          purpose: 'Stores your recent symptom or doctor searches',
          expiry: '30 days',
          type: 'Local Storage'
        },
        {
          name: 'appointment_reminders',
          provider: 'Healthcare System',
          purpose: 'Enables appointment scheduling reminders',
          expiry: '1 year',
          type: 'HTTP Cookie'
        }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'We use these cookies to understand how visitors interact with our website, measure traffic, and improve our services. All data is anonymized.',
      required: false,
      cookies: [
        {
          name: '_ga',
          provider: 'Google Analytics',
          purpose: 'Distinguishes unique users and tracks website usage',
          expiry: '2 years',
          type: 'HTTP Cookie'
        },
        {
          name: '_gid',
          provider: 'Google Analytics',
          purpose: 'Stores and counts pageviews for analytics',
          expiry: '24 hours',
          type: 'HTTP Cookie'
        },
        {
          name: '_gat',
          provider: 'Google Analytics',
          purpose: 'Throttles request rate to improve site performance',
          expiry: '1 minute',
          type: 'HTTP Cookie'
        },
        {
          name: 'heatmap_data',
          provider: 'Healthcare System',
          purpose: 'Tracks user interaction patterns for UI improvement',
          expiry: 'Session',
          type: 'Local Storage'
        }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'These cookies track your browsing habits to deliver personalized advertisements and measure campaign effectiveness. They may be set by our advertising partners.',
      required: false,
      cookies: [
        {
          name: 'fb_pixel',
          provider: 'Meta',
          purpose: 'Tracks conversions and retargets visitors on Facebook',
          expiry: '3 months',
          type: 'HTTP Cookie'
        },
        {
          name: 'ads_preferences',
          provider: 'Healthcare System',
          purpose: 'Stores your preferences for health-related content',
          expiry: '90 days',
          type: 'HTTP Cookie'
        },
        {
          name: 'campaign_tracker',
          provider: 'Healthcare System',
          purpose: 'Tracks effectiveness of health awareness campaigns',
          expiry: '30 days',
          type: 'HTTP Cookie'
        },
        {
          name: 'ad_consent',
          provider: 'Ad Partners',
          purpose: 'Records your consent for personalized advertising',
          expiry: '1 year',
          type: 'HTTP Cookie'
        }
      ]
    }
  ];

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50">
      {/* Cookie Consent Banner */}
      {showBanner && !showSettings && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Cookie className="text-blue-600" size={24} />
                </div>
                <div className="max-w-3xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookie Consent</h3>
                  <p className="text-gray-600 text-sm">
                    We use cookies to enhance your experience on our healthcare platform, analyze site traffic, 
                    and personalize content. Some cookies are necessary for the website to function properly, 
                    while others help us improve your experience. You can choose your preferences below.
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Last updated: December 15, 2024
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Settings size={18} />
                  Customize Settings
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Cookie className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Cookie Preferences</h2>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Your Privacy Matters</h3>
                    <p className="text-sm text-blue-800">
                      We respect your right to privacy. You can choose which cookies to accept. 
                      Necessary cookies are required for the website to function and cannot be disabled.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookie Categories */}
              <div className="space-y-4">
                {cookieCategories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="bg-gray-50 px-4 py-3 flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection(category.id)}
                    >
                      <div className="flex items-center gap-3">
                        {expandedSections.includes(category.id) ? 
                          <ChevronUp size={20} className="text-gray-500" /> : 
                          <ChevronDown size={20} className="text-gray-500" />
                        }
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {category.required ? (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                            Required
                          </span>
                        ) : (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={cookiePreferences[category.id as keyof typeof cookiePreferences]}
                              onChange={(e) => setCookiePreferences({
                                ...cookiePreferences,
                                [category.id]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        )}
                      </div>
                    </div>

                    {expandedSections.includes(category.id) && (
                      <div className="p-4 border-t border-gray-200">
                        <table className="min-w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cookie Name</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {category.cookies.map((cookie, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm font-medium text-gray-900">{cookie.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{cookie.provider}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{cookie.purpose}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{cookie.expiry}</td>
                                <td className="px-4 py-2 text-sm text-gray-600">{cookie.type}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Additional Information */}
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe size={18} className="text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Third-Party Cookies</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Some cookies are placed by third-party services that appear on our pages. 
                    These include analytics providers and advertising networks.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock size={18} className="text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Data Protection</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    All cookie data is encrypted and handled in compliance with HIPAA, GDPR, and 
                    CCPA regulations to protect your health information.
                  </p>
                </div>
              </div>

              {/* Cookie Policy Details */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Info size={18} className="text-blue-600" />
                  Detailed Cookie Policy Information
                </h3>
                <div className="prose prose-sm max-w-none text-gray-600">
                  <p className="mb-4">
                    This Cookie Policy explains how Healthcare Management System ("we", "us", or "our") 
                    uses cookies and similar technologies to recognize you when you visit our website. 
                    It explains what these technologies are and why we use them, as well as your rights 
                    to control our use of them.
                  </p>
                  
                  <h4 className="font-semibold text-gray-900 mt-4 mb-2">What are cookies?</h4>
                  <p className="mb-4">
                    Cookies are small data files that are placed on your computer or mobile device when 
                    you visit a website. Cookies are widely used by website owners to make their websites 
                    work more efficiently, as well as to provide reporting information and personalize 
                    your experience.
                  </p>

                  <h4 className="font-semibold text-gray-900 mt-4 mb-2">How can you control cookies?</h4>
                  <p className="mb-4">
                    You have the right to decide whether to accept or reject cookies. You can exercise 
                    your cookie preferences by clicking on the appropriate opt-out links provided in the 
                    cookie banner or settings panel. You can also set or amend your web browser controls 
                    to accept or refuse cookies.
                  </p>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={18} />
                      <div>
                        <h5 className="font-semibold text-yellow-800 mb-1">Important Note for Healthcare Services</h5>
                        <p className="text-sm text-yellow-700">
                          Some cookies are essential for providing healthcare services, such as maintaining 
                          secure sessions for patient portals, appointment scheduling, and accessing medical 
                          records. These necessary cookies cannot be disabled without affecting site functionality.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reject All
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showConsentModal && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle size={20} />
          <span>Your cookie preferences have been saved successfully!</span>
        </div>
      )}

      {/* Main Cookie Policy Page Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-12 text-white">
              <div className="flex items-center gap-4 mb-4">
                <Cookie size={40} />
                <h1 className="text-3xl font-bold">Cookie Policy</h1>
              </div>
              <p className="text-blue-100 text-lg">
                Understanding how we use cookies to improve your healthcare experience
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm text-blue-200">
                <span>Last Updated: December 15, 2024</span>
                <span>•</span>
                <span>Version 2.0</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Quick Actions */}
              <div className="mb-8 flex gap-3">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Settings size={18} />
                  Manage Cookie Preferences
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Accept All
                </button>
              </div>

              {/* Policy Sections */}
              <div className="space-y-8">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
                  <p className="text-gray-600">
                    At Healthcare Management System, we are committed to protecting your privacy and ensuring 
                    transparency about how we use cookies on our website. This Cookie Policy explains what 
                    cookies are, how we use them, and your choices regarding their use.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Why We Use Cookies</h2>
                  <p className="text-gray-600 mb-4">We use cookies for several purposes:</p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li><span className="font-medium">Essential Operations:</span> To enable secure login, appointment scheduling, and access to medical records</li>
                    <li><span className="font-medium">Performance:</span> To analyze how users interact with our site and improve functionality</li>
                    <li><span className="font-medium">Personalization:</span> To remember your preferences and provide relevant health information</li>
                    <li><span className="font-medium">Security:</span> To protect against fraud and ensure the safety of your health data</li>
                    <li><span className="font-medium">Compliance:</span> To maintain records of consent and meet regulatory requirements</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
                  <div className="space-y-4">
                    {cookieCategories.map((category) => (
                      <div key={category.id} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Your Rights and Choices</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-600 mb-4">
                      You have the right to:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={18} />
                        <span className="text-gray-600">Accept or reject non-essential cookies at any time</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={18} />
                        <span className="text-gray-600">Withdraw consent for cookies you previously accepted</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={18} />
                        <span className="text-gray-600">Configure your browser to block or delete cookies</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={18} />
                        <span className="text-gray-600">Request information about the data collected through cookies</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Contact Information</h2>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about our Cookie Policy or data practices, please contact our 
                    Data Protection Officer:
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-700">Email: privacy@healthcaresystem.com</p>
                    <p className="text-gray-700">Phone: +1 (555) 123-4567</p>
                    <p className="text-gray-700">Address: 123 Healthcare Ave, Medical District, CA 94105</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Updates to This Policy</h2>
                  <p className="text-gray-600">
                    We may update this Cookie Policy from time to time to reflect changes in technology, 
                    legislation, or our data practices. Any updates will be posted on this page with an 
                    updated revision date. We encourage you to review this policy periodically.
                  </p>
                </section>
              </div>

              {/* Footer Note */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  By using our website, you acknowledge that you have read and understood our Cookie Policy. 
                  For more information about how we handle your personal data, please see our{' '}
                  <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CookiePolicy;