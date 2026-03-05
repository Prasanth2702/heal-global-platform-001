

import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  BookOpen,
  Shield,
  Zap,
  CreditCard,
  Smartphone,
  Globe,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Wifi,
  Clock,
  CreditCard as CardIcon,
  Globe as WorldIcon,
  UserX,
  HelpCircle,
  Mail,
  Smartphone as PhoneIcon,
  Lock,
  Star,
  Users,
  MessageCircle,
} from "lucide-react";
import Header from "@/pages/alldetails/Header";
import Footer from "@/pages/alldetails/Footer";

// FAQ Model Component - Reusable across all pages
const FAQModel = ({ faqs, title = "Payment-Related FAQs" }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <HelpCircle className="h-6 w-6 text-blue-500 mr-2" />
        {title}
      </h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-md transition-all duration-300"
          >
            <button
              onClick={() =>
                setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)
              }
              className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-blue-50 rounded-lg p-2 text-blue-600 flex-shrink-0">
                  {faq.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {faq.question}
                  </h3>
                  {expandedFAQ === faq.id && (
                    <p className="text-gray-700 mt-2 leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                  expandedFAQ === faq.id ? "rotate-90" : ""
                }`}
              />
            </button>
            {/* {expandedFAQ === faq.id && (
              <div className="px-6 pb-6">
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

// Guides Component
const GuidesSection = () => {
  const [expandedGuide, setExpandedGuide] = useState(null);

  const guides = [
    {
      id: 1,
      title: "What is TheFutureMed?",
      category: "overview",
      excerpt:
        "TheFutureMed is a global medical network and career hub for students, professionals, and healthcare organizations...",
      icon: <BookOpen className="h-5 w-5" />,
      readTime: "3 min read",
      content: {
        introduction:
          "TheFutureMed is a global platform designed to connect medical professionals, students, and organizations. It helps users access medical networks, career opportunities, and knowledge-sharing tools across the healthcare ecosystem.",
        steps: [
          "Global networking for doctors, students, and healthcare experts",
          "Career hub with jobs, internships, and resume/skill tools",
          "Medical events including seminars, conferences, and workshops",
          "Knowledge resources such as articles, webinars, and courses",
        ],
      },
    },
    {
      id: 2,
      title: "Who is TheFutureMed For?",
      category: "audience",
      excerpt:
        "The platform is built for medical students, healthcare professionals, recruiters, and researchers looking for opportunities...",
      icon: <Users className="h-5 w-5" />,
      readTime: "3 min read",
      content: {
        introduction:
          "TheFutureMed serves a wide audience across the medical industry, offering tools for learning, networking, and career growth.",
        steps: [
          "Medical students and fresh graduates seeking roles or internships",
          "Doctors, nurses, and specialists building professional networks",
          "Recruiters and hospitals searching for top medical talent",
          "Researchers and innovators exploring collaborations",
        ],
      },
    },
    {
      id: 3,
      title: "What Services Does TheFutureMed Offer?",
      category: "services",
      excerpt:
        "TheFutureMed offers networking tools, job support, education resources, and seminar/conference access...",
      icon: <Zap className="h-5 w-5" />,
      readTime: "4 min read",
      content: {
        introduction:
          "The platform includes multiple tools to help users advance their careers, collaborate with others, and stay updated on medical trends.",
        steps: [
          "Networking features to connect with peers and mentors",
          "Career tools including job listings and resume support",
          "Educational resources like webinars and articles",
          "Seminar and conference discovery with global access",
          "International opportunities for collaboration and remote work",
        ],
      },
    },
    {
      id: 4,
      title: "How Does TheFutureMed Work?",
      category: "usage",
      excerpt:
        "Create your profile, explore resources, engage with the community, and grow your career...",
      icon: <Smartphone className="h-5 w-5" />,
      readTime: "3 min read",
      content: {
        introduction:
          "TheFutureMed is designed to be simple and intuitive, guiding users through learning, connecting, and professional growth.",
        steps: [
          "Sign up and create your medical profile",
          "Explore jobs, networks, and upcoming events",
          "Engage by joining discussions or applying to opportunities",
          "Grow through analytics, mentors, and event participation",
        ],
      },
    },
    {
      id: 5,
      title: "Is TheFutureMed Free?",
      category: "pricing",
      excerpt:
        "Basic features are free, with optional premium upgrades for advanced tools...",
      icon: <Shield className="h-5 w-5" />,
      readTime: "2 min read",
      content: {
        introduction:
          "TheFutureMed provides free access to core features such as networking, profile creation, and browsing events.",
        steps: [
          "Free access to basic networking and seminar discovery",
          "Premium plans for advanced job alerts and visibility",
          "Exclusive event and resource access for paid members",
        ],
      },
    },
    {
      id: 6,
      title: "Privacy & Security",
      category: "security",
      excerpt:
        "Your data is protected with industry-standard security and global compliance...",
      icon: <Lock className="h-5 w-5" />,
      readTime: "3 min read",
      content: {
        introduction:
          "TheFutureMed prioritizes user security and data privacy, following global standards and regulations.",
        steps: [
          // "GDPR-compliant data protection",
          "Full control over profile visibility",
          "Encrypted communication and secure authentication",
        ],
      },
    },
    {
      id: 7,
      title: "What Makes TheFutureMed Different?",
      category: "features",
      excerpt:
        "Unlike general job boards, TheFutureMed is built exclusively for the medical ecosystem...",
      icon: <Star className="h-5 w-5" />,
      readTime: "3 min read",
      content: {
        introduction:
          "The platform combines networking, career development, education, and medical events into a single global hub.",
        steps: [
          "Medical-specific networking",
          "Career tools tailored to healthcare",
          "Integrated seminar & conference system",
          "Focus on long-term professional growth",
        ],
      },
    },
    {
      id: 8,
      title: "Getting Started / Support",
      category: "support",
      excerpt: "Sign up on the homepage or contact support for assistance...",
      icon: <MessageCircle className="h-5 w-5" />,
      readTime: "2 min read",
      content: {
        introduction:
          "Starting is simple, and the support team is available for guidance whenever needed.",
        steps: [
          "Sign up for a free account",
          "Set up your professional medical profile",
          <>
            Email{" "}
            <a
              href="mailto:support@thefuturemed.com"
              className="text-blue-600 underline"
            >
              {" "}
              support@thefuturemed.com
            </a>{" "}
            for help
          </>,
          "Response time within 24–48 hours",
        ],
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <BookOpen className="h-6 w-6 text-green-500 mr-2" />
        General FAQs
      </h2>

      {guides.map((guide) => (
        <div
          key={guide.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-md transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-green-50 rounded-lg p-2 mr-3 text-green-600">
                  {guide.icon}
                </div>
                <span className="text-sm font-medium text-green-600 capitalize">
                  {guide.category}
                </span>
                {/* <span className="mx-3 text-gray-400">•</span>
                <span className="text-sm text-gray-500">{guide.readTime}</span> */}
              </div>
            </div>

            <h4 className="font-bold text-lg text-gray-900 mb-3">
              {guide.title}
            </h4>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {guide.excerpt}
            </p>

            <button
              onClick={() =>
                setExpandedGuide(expandedGuide === guide.id ? null : guide.id)
              }
              className="inline-flex items-center text-green-600 font-semibold text-sm hover:text-green-700 transition-colors duration-200 group/btn"
            >
              {expandedGuide === guide.id ? "Show Less" : "Read Full Guide"}
              <ChevronRight
                className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                  expandedGuide === guide.id
                    ? "rotate-90"
                    : "group-hover/btn:translate-x-1"
                }`}
              />
            </button>

            {expandedGuide === guide.id && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">
                    {guide.content.introduction}
                  </h5>
                  <ul className="space-y-3">
                    {guide.content.steps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
const Access = () => {
  const [expandedGuide, setExpandedGuide] = useState(null);

  const access = [
    {
      id: "faq-1",
      category: "Account",
      title: "How do I create an account on TheFutureMed?",
      readTime: "2 min read",
      icon: <BookOpen className="h-5 w-5" />,
      excerpt:
        "Learn how to quickly create your account and get started with TheFutureMed in just a few steps.",
      content: {
        introduction: "Follow these steps to create your account easily:",
        steps: [
          <>
            Visit the homepage and click{" "}
            <a
              href="https://www.thefuturemed.com/"
              className="text-blue-600 underline"
            >
              "Sign Up"
            </a>{" "}
            or{" "}
            <a
              href="https://www.thefuturemed.com/register"
              className="text-blue-600 underline"
            >
              "Join Now"
            </a>
            .
          </>,
          "Enter your name, email, profession, and password.",
          // "Verify your email through the link sent instantly.",
          "Complete optional profile details like qualifications and location.",
          "Setup takes only 2–3 minutes and is free.",
        ],
      },
    },

    {
      id: "faq-2",
      category: "Account",
      title: "What if I forget my password?",
      readTime: "1 min read",
      icon: <BookOpen className="h-5 w-5" />,
      excerpt: "Easily reset your password using your registered email.",
      content: {
        introduction: "You can reset your password by following these steps:",
        steps: [
          "Go to the login page and click “Forgot Password?”.",
          "Enter your registered email to receive a reset link.",
          "Open the link (valid for 24 hours) and create a new password.",
          "Ensure your new password has uppercase, lowercase, and a number.",
          <>
            If issues continue, email{" "}
            <a
              href="mailto:support@thefuturemed.com"
              className="text-blue-600 underline"
            >
              support@thefuturemed.com
            </a>
            .
          </>,
        ],
      },
    },

    // {
    //   id: "faq-3",
    //   category: "Account",
    //   title: "How do I log in to my account?",
    //   readTime: "1 min read",
    //   icon: <BookOpen className="h-5 w-5" />,
    //   excerpt:
    //     "Logging in is simple—just use your registered email and password.",
    //   content: {
    //     introduction: "To log in securely, follow these steps:",
    //     steps: [
    //       "Open the login section on the homepage.",
    //       "Enter your email and password.",
    //       "Enable 2FA from settings for added protection.",
    //       "Avoid saving login details on public/shared devices.",
    //     ],
    //   },
    // },

    // {
    //   id: "faq-4",
    //   category: "Account",
    //   title: "Can I use social login options?",
    //   readTime: "1 min read",
    //   icon: <BookOpen className="h-5 w-5" />,
    //   excerpt:
    //     "Login faster with Google or LinkedIn using social authentication.",
    //   content: {
    //     introduction: "TheFutureMed supports quick social login:",
    //     steps: [
    //       "Choose Google or LinkedIn login on the signup page.",
    //       "Allow access to auto-fill your professional information.",
    //       "Enjoy faster onboarding with verified profile details.",
    //     ],
    //   },
    // },

    // {
    //   id: "faq-5",
    //   category: "Account",
    //   title: "How do I verify my account?",
    //   readTime: "2 min read",
    //   icon: <BookOpen className="h-5 w-5" />,
    //   excerpt:
    //     "Verification increases trust and unlocks premium platform features.",
    //   content: {
    //     introduction: "Verify your account in a few simple steps:",
    //     steps: [
    //       "Go to your dashboard and upload valid credentials.",
    //       "Submit items like medical license, degree, or student ID.",
    //       "Wait 48 hours for manual review.",
    //       "A verified badge will appear on your profile after approval.",
    //     ],
    //   },
    // },

    {
      id: "faq-6",
      category: "Profile",
      title: "What can I customize in my profile?",
      readTime: "2 min read",
      icon: <BookOpen className="h-5 w-5" />,
      excerpt:
        "Make your profile stand out by customizing personal and professional details.",
      content: {
        introduction: "You can personalize your profile with the following:",
        steps: [
          "Upload your profile photo and add your bio.",
          "Update education, experience, skills, and certifications.",
          "Add publications and professional interests.",
          // "Choose privacy settings for each section.",
          // "Changes save automatically.",
        ],
      },
    },

    // {
    //   id: "faq-7",
    //   category: "Account",
    //   title: "What account settings are available?",
    //   readTime: "2 min read",
    //   icon: <BookOpen className="h-5 w-5" />,
    //   excerpt:
    //     "Manage notifications, privacy, linked accounts, security, and more.",
    //   content: {
    //     introduction: "Account settings include the following options:",
    //     steps: [
    //       "Toggle email notifications and alerts.",
    //       "Manage privacy and data sharing preferences.",
    //       "Enable/disable 2FA.",
    //       "Connect or disconnect social accounts.",
    //       "Change language or accessibility settings.",
    //     ],
    //   },
    // },

    {
      id: "faq-8",
      category: "Security",
      title: "Is my account data secure?",
      readTime: "1 min read",
      icon: <BookOpen className="h-5 w-5" />,
      excerpt: "Your data is fully protected with industry-standard security.",
      content: {
        introduction: "TheFutureMed protects your information using:",
        steps: [
          "End-to-end encryption for messages.",
          // "GDPR-compliant data storage.",
          "Regular security audits and monitoring.",
          "Option to disable third-party data sharing.",
          "Instant reporting tools for suspicious activity.",
        ],
      },
    },

    {
      id: "faq-9",
      category: "Account",
      title: "What are the free vs. premium account options?",
      readTime: "2 min read",
      icon: <BookOpen className="h-5 w-5" />,
      excerpt:
        "Compare free and premium features to choose what fits you best.",
      content: {
        introduction: "Here’s the difference between free, paid and premium:",
        steps: [
          "Free: Networking, basic job search, community access.",
          "Premium: AI resume review, exclusive webinars, unlimited applications.",
          "Premium offers mentor matching and advanced insights.",
          "Paid Seminars, Conferences to learn, network, and earn certifications.",
          // "You can upgrade, downgrade, or cancel anytime.",
        ],
      },
    },

    // {
    //   id: "faq-10",
    //   category: "Account",
    //   title: "How do I close or delete my account?",
    //   readTime: "2 min read",
    //   icon: <BookOpen className="h-5 w-5" />,
    //   excerpt:
    //     "Deactivate temporarily or delete permanently with a 30-day grace period.",
    //   content: {
    //     introduction: "To close or delete your account:",
    //     steps: [
    //       "Go to Settings → Account → Deactivation.",
    //       "Download your data if needed.",
    //       "Choose between deactivation or permanent deletion.",
    //       "Permanent deletion occurs after 30 days and cannot be reversed.",
    //     ],
    //   },
    // },

    {
      id: "faq-11",
      category: "Support",
      title: "What if I encounter account issues?",
      readTime: "1 min read",
      icon: <BookOpen className="h-5 w-5" />,
      excerpt: "Quick fixes for common issues and how to contact support.",
      content: {
        introduction: "Try these fixes before contacting support:",
        steps: [
          "Clear browser cache or try incognito mode.",
          "Refresh the page or switch to mobile view.",
          "Take a screenshot and submit a support ticket.",
          "Support replies within 24 hours (faster for premium users).",
        ],
      },
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <BookOpen className="h-6 w-6 text-green-500 mr-2" />
        Account-Related FAQ
      </h2>

      {access.map((access) => (
        <div
          key={access.id}
          className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden hover:shadow-md transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-green-50 rounded-lg p-2 mr-3 text-green-600">
                  {access.icon}
                </div>
                <span className="text-sm font-medium text-green-600 capitalize">
                  {access.category}
                </span>
              </div>
            </div>

            <h4 className="font-bold text-lg text-gray-900 mb-3">
              {access.title}
            </h4>

            <p className="text-gray-600 mb-4 leading-relaxed">
              {access.excerpt}
            </p>

            <button
              onClick={() =>
                setExpandedGuide(expandedGuide === access.id ? null : access.id)
              }
              className="inline-flex items-center text-green-600 font-semibold text-sm hover:text-green-700 transition-colors duration-200 group/btn"
            >
              {expandedGuide === access.id ? "Show Less" : "Read Full Guide"}
              <ChevronRight
                className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                  expandedGuide === access.id
                    ? "rotate-90"
                    : "group-hover/btn:translate-x-1"
                }`}
              />
            </button>

            {expandedGuide === access.id && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="font-semibold text-gray-900 mb-4">
                    {access.content.introduction}
                  </h5>
                  <ul className="space-y-3">
                    {access.content.steps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const ArticlesAndGuides = () => {
  const [activeCategory, setActiveCategory] = useState("gateway");
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const categories = [
    // { id: "all", name: "All Articles" },
    { id: "gateway", name: "General FAQs" },
    { id: "account-related-faq", name: "Account-Related FAQ" },
    { id: "faqs", name: "Payment FAQs" },
    // { id: "faqs", name: "FAQs" },
  ];

  const paymentFAQs = [
    {
      id: 1,
      question: "Why did my payment fail?",
      answer:
        "Payments may fail due to network issues, incorrect details, bank downtime, insufficient balance, or OTP delays. Try again or use a different payment method.",
      icon: <AlertCircle className="h-5 w-5" />,
    },
    {
      id: 2,
      question:
        "The money was deducted, but my payment is not showing as successful. What should I do?",
      answer:
        "Don't worry—this happens sometimes due to delayed bank confirmation. Your amount is usually auto-refunded within 3–5 working days. If not, contact support with your transaction ID.",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      id: 3,
      question: "Why am I not receiving the OTP for payment?",
      answer:
        "OTP delays can occur due to poor network, SMS congestion, or incorrect mobile number. Retry after a few minutes or switch to another payment option if available.",
      icon: <PhoneIcon className="h-5 w-5" />,
    },
    {
      id: 4,
      question:
        "My card/UPI details are correct, but payment is still failing. Why?",
      answer:
        "Even with correct details, payments can fail due to expired card, UPI handle/server downtime, or bank blocking the transaction for security. Try using a different UPI ID or another card.",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: 5,
      question: "Can I retry a failed payment?",
      answer:
        "Yes. You can safely retry. If the previous attempt shows 'Processing,' wait until you get a final status before retrying.",
      icon: <RefreshCw className="h-5 w-5" />,
    },
    {
      id: 6,
      question: "Which payment methods do you accept?",
      answer:
        "We support UPI, Debit & Credit Cards, Net Banking, Wallets, and various international payment methods.",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      id: 7,
      question: "How do I check if my payment went through?",
      answer:
        "You will receive an on-screen confirmation, email/SMS notification, and the item will appear in your dashboard. If none appear, the payment did not complete.",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      id: 8,
      question: "The payment page closed while paying. What happens now?",
      answer:
        <>
  If the amount was deducted accidentally, please contact{" "}
  <a
    href="mailto:support@thefuturemed.com"
    className="text-blue-600 underline"
  >
    support@thefuturemed.com
  </a>{" "}
  within 24 hours for refund assistance. Please note that as per our
  non-refund policy, payments successfully completed cannot be refunded.
</>,
      icon: <AlertCircle className="h-5 w-5" />,
    },
    // {
    //   id: 8,
    //   question: "The payment page closed while paying. What happens now?",
    //   answer:
    //     "If the bank did not confirm the transaction, the amount will not be deducted. If deducted accidentally, it will be refunded automatically.",
    //   icon: <AlertCircle className="h-5 w-5" />,
    // },
    {
      id: 9,
      question: "I entered the wrong UPI ID. How do I fix it?",
      answer:
        "The payment will fail automatically. Retry with the correct UPI ID or use another method like card payment.",
      icon: <UserX className="h-5 w-5" />,
    },
    // {
    //   id: 10,
    //   question: "How can I add a different card for payment?",
    //   answer:
    //     "You can add multiple cards in your payment profile. Go to Payment Methods, click 'Add New Card', enter your card details, and save. You can switch between saved cards during checkout.",
    //   icon: <CreditCard className="h-5 w-5" />,
    // },
    {
      id: 11,
      question: "Who do I contact for payment support?",
      answer:
        "You can raise a ticket through the Help & Support section or email us with your registered email/phone, transaction ID, and screenshot of the payment attempt for faster resolution.",
      icon: <Mail className="h-5 w-5" />,
    },
  ];

  const articles = [
    {
      id: 1,
      title: "Common Reasons for Payment Failure and How to Fix Them",
      category: "gateway",
      excerpt:
        "For any online business, payments are the final step that turns customer intent into revenue. When a transaction doesn't go through, it breaks that moment of conversion...",
      icon: <CreditCard className="h-5 w-5" />,
      featured: true,
      readTime: "4 min read",
    },
    {
      id: 2,
      title: "Optimizing Payment Gateway Integration",
      category: "integration",
      excerpt:
        "Learn how to seamlessly integrate payment gateways and reduce cart abandonment with best practices...",
      icon: <Zap className="h-5 w-5" />,
      featured: false,
      readTime: "5 min read",
    },
  ];

  const isPaymentGatewayCategory = activeCategory === "gateway";
  const isAccessFAQsCategory = activeCategory === "account-related-faq";
  const isFAQsCategory = activeCategory === "faqs";
  const isAllCategory = activeCategory === "all";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions & General
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              FAQs (Frequently Asked Questions) are quick answers to the most
              common questions you may have.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 sticky top-8">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setExpandedArticle(null);
                        setExpandedFAQ(null);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                        activeCategory === category.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="font-medium">{category.name}</span>
                      <ChevronRight
                        className={`h-4 w-4 transition-transform duration-200 ${
                          activeCategory === category.id
                            ? "text-blue-600 transform translate-x-0"
                            : "text-gray-400 group-hover:translate-x-1"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Quick Stats */}
                {/* <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Quick Stats
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">FAQs</span>
                      <span className="font-semibold text-blue-600">
                        {paymentFAQs.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">General</span>
                      <span className="font-semibold text-green-600">
                        {GuidesSection.length}
                      </span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* All Category - Shows both Guides and FAQs */}
              {/* {isAllCategory && (
                <div className="space-y-8">
                  <GuidesSection />
                  <Access />
                  <FAQModel faqs={paymentFAQs} title="Payment FAQs" />
                </div>
              )} */}

              {/* Guides Category */}
              {isPaymentGatewayCategory && <GuidesSection />}
              {isAccessFAQsCategory && <Access />}

              {/* FAQs Category */}
              {isFAQsCategory && <FAQModel faqs={paymentFAQs} />}
            </div>
          </div>

          {/* CTA Section */}
          {/* <div className="mt-16 bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Optimize Your Payment Processing?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Get expert guidance and implement best practices to boost your
                transaction success rates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:-translate-y-0.5">
                  Contact Sales
                </button>
                <button className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-200">
                  View Documentation
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ArticlesAndGuides;
export { FAQModel, GuidesSection };
