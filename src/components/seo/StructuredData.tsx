import React from 'react';

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "NextGen Medical Platform",
  "url": "https://heal-global-platform.lovableproject.com",
  "logo": "https://heal-global-platform.lovableproject.com/icon-512.png",
  "description": "AI-enhanced, multilingual, compliance-ready digital ecosystem for healthcare",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-XXX-XXX-XXXX",
    "contactType": "customer service",
    "availableLanguage": ["English", "Arabic", "Spanish", "French", "Hindi"]
  },
  "sameAs": [
    "https://twitter.com/nextgenmedical",
    "https://linkedin.com/company/nextgen-medical"
  ]
};

// Medical Organization Schema
export const medicalOrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "name": "NextGen Medical Platform",
  "url": "https://heal-global-platform.lovableproject.com",
  "logo": "https://heal-global-platform.lovableproject.com/icon-512.png",
  "description": "Digital healthcare platform providing telemedicine, patient management, and AI-powered medical assistance",
  "medicalSpecialty": [
    "General Medicine",
    "Telemedicine",
    "Digital Health",
    "AI Medical Assistance"
  ],
  "hasCredential": "HIPAA Compliant",
  "availableService": [
    {
      "@type": "MedicalTherapy",
      "name": "Telemedicine Consultation"
    },
    {
      "@type": "Service",
      "name": "AI Medical Triage"
    },
    {
      "@type": "Service", 
      "name": "Digital Medical Records"
    }
  ]
};

// WebApplication Schema
export const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "NextGen Medical Platform",
  "url": "https://heal-global-platform.lovableproject.com",
  "description": "Comprehensive healthcare platform with AI-powered features",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web Browser",
  "browserRequirements": "Requires JavaScript. Compatible with Chrome, Firefox, Safari, Edge",
  "permissions": "camera, microphone, location (for emergency services)",
  "availableOnDevice": ["Desktop", "Mobile", "Tablet"],
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "AI-powered medical triage",
    "Telemedicine consultations", 
    "Digital medical records",
    "Appointment scheduling",
    "Multi-language support",
    "HIPAA compliance"
  ]
};

// FAQ Schema
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is NextGen Medical Platform HIPAA compliant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, NextGen Medical Platform is fully HIPAA compliant with end-to-end encryption, secure data storage, and comprehensive audit trails."
      }
    },
    {
      "@type": "Question", 
      "name": "What languages are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our platform supports multiple languages including English, Arabic, Spanish, French, and Hindi with real-time translation capabilities."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use this platform on mobile devices?",
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": "Yes, NextGen Medical Platform is fully responsive and works on all devices including smartphones, tablets, and desktops. We also offer PWA installation for native app-like experience."
      }
    }
  ]
};

// Breadcrumb Schema Generator
export const generateBreadcrumbSchema = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

// Service Schema Generator
export const generateServiceSchema = (service: {
  name: string;
  description: string;
  provider: string;
  areaServed?: string;
  availableChannel?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "provider": {
    "@type": "Organization",
    "name": service.provider
  },
  "areaServed": service.areaServed || "Worldwide",
  "availableChannel": service.availableChannel || ["Online"]
});