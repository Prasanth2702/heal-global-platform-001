import React from 'react'
import { 
  Calculator, 
  CalendarCheck, 
  PersonStanding, 
  Search, 
  Building2, 
  MapPin, 
  Phone, 
  Star,
  Bed,
  Users,
  Activity,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  HeartPulse,
  Mail,
  Globe,
  Shield,
  Award,
  Menu,
  X,
  ChevronRight,
  LogIn,
  UserPlus,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail as MailIcon,
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  ArrowRight,
  Pill,
  Ambulance
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();
      // Footer quick links
      const quickLinks = [
        { name: 'About Us', path: '/about' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'FAQs', path: '/faqs' },
        // { name: 'Blog', path: '/blog' },
      ];
    
      const services = [
        { name: 'Find Doctors', path: '/appointment/doctors', icon: PersonStanding },
        { name: 'Find Hospitals', path: '/appointment/hospitals', icon: Building2 },
        { name: 'Book Appointment', path: '/appointment/beds', icon: CalendarCheck },
        // { name: 'Health Checkup', path: '/health-checkup', icon: Activity },
        // { name: 'Pharmacy', path: '/pharmacy', icon: Pill },
        // { name: 'Ambulance', path: '/ambulance', icon: Ambulance },
      ];

    return (
      <footer className="bg-dark text-white pt-5 pb-4 mt-5">
        <div className="container">
          <div className="row g-4">
            {/* About Section */}
            <div className="col-lg-4 col-md-6">
               <Link to="/" className="flex items-center space-x-2">
            <img
              src="/favicon.svg"
              alt="NextGen Medical"
              className="h-8 w-8 rounded-md object-contain mt-1"
            />
            <span className="text-xl font-bold">NextGen Medical</span>
          </Link>
              <p className="text-white-50 mb-3">
                Your trusted partner in healthcare. We connect you with the best doctors, 
                hospitals, and healthcare services to ensure you receive the care you deserve.
              </p>
              <div className="d-flex gap-3">
                <a href="#" className="text-white-50 hover-text-primary">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-white-50 hover-text-primary">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-white-50 hover-text-primary">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-white-50 hover-text-primary">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-white-50 hover-text-primary">
                  <Youtube size={20} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6">
              <h6 className="fw-bold mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                {quickLinks.map((link, index) => (
                  <li key={index} className="mb-2">
                    <a 
                      href={link.path} 
                      className="text-white-50 text-decoration-none hover-text-primary d-inline-flex align-items-center"
                    >
                      <ChevronRight size={14} className="me-1" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold mb-3">Our Services</h6>
              <ul className="list-unstyled">
                {services.slice(0, 6).map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <li key={index} className="mb-2">
                      <a 
                        href={service.path} 
                        className="text-white-50 text-decoration-none hover-text-primary d-inline-flex align-items-center"
                      >
                        <Icon size={14} className="me-2" />
                        {service.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-6">
              <h6 className="fw-bold mb-3">Contact Us</h6>
              <ul className="list-unstyled">
                <li className="mb-2 d-flex align-items-start">
                  <MapPinIcon size={18} className="text-primary me-2 mt-1 flex-shrink-0" />
                  <span className="text-white-50">
                    123 Healthcare Avenue, Medical District, NY 10001
                  </span>
                </li>
                <li className="mb-2 d-flex align-items-center">
                  <PhoneIcon size={18} className="text-primary me-2 flex-shrink-0" />
                  <span className="text-white-50">+1 (555) 123-4567</span>
                </li>
                <li className="mb-2 d-flex align-items-center">
                  <MailIcon size={18} className="text-primary me-2 flex-shrink-0" />
                  <span className="text-white-50">info@healthcare.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="row mt-4 pt-3 border-top border-secondary">
            <div className="col-md-6 text-center text-md-start">
              <p className="text-white-50 small mb-0">
                © {currentYear} HealthCare Management System. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <a href="/privacy" className="text-white-50 text-decoration-none small me-3">
                Privacy Policy
              </a>
              <a href="/terms" className="text-white-50 text-decoration-none small me-3">
                Terms of Service
              </a>
              <a href="/cookies" className="text-white-50 text-decoration-none small">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };

export default Footer
