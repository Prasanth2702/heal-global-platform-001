import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroCarousel from "@/components/carousel/HeroCarousel";
import PromotionCarousel from "@/components/carousel/PromotionCarousel";
import SEOHead from "@/components/seo/SEOHead";
import { organizationSchema, medicalOrganizationSchema, webApplicationSchema, faqSchema } from "@/components/seo/StructuredData";

const LandingPage = () => {
  const navigate = useNavigate();
  const userTypes = [
    {
      title: "Patients",
      description: "Book appointments, access medical records, and manage your health journey",
      icon: User,
      variant: "patient" as const,
      features: ["Book Appointments", "Digital Medical Records", "Health Timeline", "Emergency SOS"]
    },
    {
      title: "Medical Professionals", 
      description: "Manage your practice, access patient records, and provide teleconsultations",
      icon: User,
      variant: "doctor" as const,
      features: ["Patient Management", "e-Prescriptions", "Teleconsultation", "Revenue Dashboard"]
    },
    {
      title: "Medical Facilities",
      description: "Streamline operations, manage departments, and track facility analytics",
      icon: Calendar,
      variant: "facility" as const,
      features: ["Department Management", "Staff Scheduling", "Analytics Dashboard", "Invoice Generation"]
    },
    {
      title: "Admin Portal",
      description: "Platform oversight, user management, and comprehensive analytics",
      icon: Search,
      variant: "admin" as const,
      features: ["User Approval", "Platform Analytics", "Role Management", "Compliance Monitoring"]
    }
  ];

  return (
    <>
      <SEOHead 
        title="NextGen Medical Platform - AI-Enhanced Healthcare Ecosystem"
        description="AI-enhanced, multilingual, compliance-ready digital ecosystem connecting patients, medical professionals, and healthcare facilities in one powerful platform."
        keywords="medical platform, healthcare, AI medical, telemedicine, patient portal, doctor portal, medical records, appointments, HIPAA compliance, multilingual healthcare"
        jsonLd={[organizationSchema, medicalOrganizationSchema, webApplicationSchema, faqSchema]}
      />
      
      <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-hero"></div>
            <span className="text-xl font-bold">NextGen Medical</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => {
                document.getElementById('user-types')?.scrollIntoView({ behavior: 'smooth' });
              }}>Sign In 
            </Button>
            <Button variant="hero">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Smart Hero Carousel */}
      <HeroCarousel />

      {/* User Types Section */}
      <section className="py-20 bg-muted/30" id="user-types">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Portal</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access specialized features designed for your role in the healthcare ecosystem
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userTypes.map((userType, index) => {
              const IconComponent = userType.icon;
              return (
                <Card key={index} variant={userType.variant} className="group cursor-pointer h-full">
                  <CardHeader className="text-center">
                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-${userType.variant}`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">{userType.title}</CardTitle>
                    <CardDescription className="text-center">
                      {userType.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {userType.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant={userType.variant} 
                      className="w-full mt-6 group-hover:scale-105 transition-transform"
                      onClick={() => navigate(`/register/${userType.variant}`)}
                    >
                      Access Portal
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promotions Carousel */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Healthcare Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our latest innovations in digital healthcare technology
            </p>
          </div>
          <PromotionCarousel />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Advanced Healthcare Technology</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powered by AI, built for compliance, designed for the future of healthcare
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="elevated" className="hover-scale">
              <CardHeader>
                <CardTitle className="text-xl mb-2">AI-Powered Features</CardTitle>
                <CardDescription>
                  Smart scheduling, diagnostic assistance, and automated workflows powered by advanced machine learning
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card variant="elevated" className="hover-scale">
              <CardHeader>
                <CardTitle className="text-xl mb-2">Compliance Ready</CardTitle>
                <CardDescription>
                  HIPAA, MOH-UAE, NABH compliant with full audit trails and data encryption
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card variant="elevated" className="hover-scale">
              <CardHeader>
                <CardTitle className="text-xl mb-2">Multilingual Support</CardTitle>
                <CardDescription>
                  Real-time translation and voice assistance in 50+ languages for better accessibility
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-hero"></div>
              <span className="text-xl font-bold">NextGen Medical</span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2024 NextGen Medical Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
};

export default LandingPage;