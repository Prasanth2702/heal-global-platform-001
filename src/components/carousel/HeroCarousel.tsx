import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowRight, Play, Calendar, Users, Heart, Shield, Zap, Globe } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import heroImage from "@/assets/medical-hero.jpg";

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  secondaryCtaText: string;
  ctaLink: string;
  badge: string;
  badgeColor: string;
  features: string[];
  stats: {
    primary: string;
    primaryLabel: string;
    secondary: string;
    secondaryLabel: string;
  };
  gradient: string;
  isActive: boolean;
  promotionType: 'platform' | 'hospital' | 'clinic' | 'service' | 'camp' | 'facility';
  location?: string;
  contactInfo?: string;
  specialOffers?: string;
  validUntil?: string;
}

// Default slides - these would be loaded from admin-managed content
const defaultHeroSlides: CarouselSlide[] = [
  {
    id: '1',
    title: "AI-Powered Medical Triage",
    subtitle: "Instant Health Guidance",
    description: "Get immediate medical advice with our advanced AI that analyzes symptoms and connects you with the right specialist in seconds.",
    image: heroImage,
    ctaText: "Try AI Triage",
    secondaryCtaText: "Watch Demo",
    ctaLink: "/ai-triage",
    badge: "NEW",
    badgeColor: "blue",
    features: ["24/7 Available", "Multi-language", "HIPAA Secure"],
    stats: { primary: "10K+", primaryLabel: "Consultations", secondary: "98%", secondaryLabel: "Accuracy" },
    gradient: "from-blue-600 via-purple-600 to-teal-600",
    isActive: true,
    promotionType: "platform"
  },
  {
    id: '2',
    title: "NextGen Unified Medical Platform",
    subtitle: "Complete Healthcare Ecosystem",
    description: "AI-enhanced, multilingual, compliance-ready digital ecosystem connecting patients, medical professionals, and healthcare facilities.",
    image: heroImage,
    ctaText: "Get Started Today",
    secondaryCtaText: "Learn More",
    ctaLink: "/register/patient",
    badge: "FEATURED",
    badgeColor: "green",
    features: ["AI-Enhanced", "Multilingual", "Compliance-Ready"],
    stats: { primary: "50+", primaryLabel: "Countries", secondary: "1M+", secondaryLabel: "Users" },
    gradient: "from-green-600 via-emerald-600 to-teal-600",
    isActive: true,
    promotionType: "platform"
  },
  {
    id: '3',
    title: "Secure Digital Health Records",
    subtitle: "Your Health, Always Accessible",
    description: "Bank-level security for your medical records with instant sharing capabilities and lifetime access from anywhere in the world.",
    image: heroImage,
    ctaText: "Secure Your Records",
    secondaryCtaText: "View Security",
    ctaLink: "/vault",
    badge: "SECURE",
    badgeColor: "orange",
    features: ["Bank-level Security", "Instant Sharing", "Global Access"],
    stats: { primary: "256-bit", primaryLabel: "Encryption", secondary: "99.9%", secondaryLabel: "Uptime" },
    gradient: "from-orange-600 via-red-600 to-pink-600",
    isActive: true,
    promotionType: "platform"
  },
  {
    id: '4',
    title: "Telemedicine Revolution",
    subtitle: "Healthcare Without Boundaries",
    description: "High-quality video consultations with board-certified physicians. Healthcare that comes to you, wherever you are.",
    image: heroImage,
    ctaText: "Book Consultation",
    secondaryCtaText: "Meet Doctors",
    ctaLink: "/appointments",
    badge: "POPULAR",
    badgeColor: "purple",
    features: ["HD Video Calls", "Board-Certified", "Insurance Accepted"],
    stats: { primary: "5 min", primaryLabel: "Avg Wait", secondary: "24/7", secondaryLabel: "Available" },
    gradient: "from-purple-600 via-indigo-600 to-blue-600",
    isActive: true,
    promotionType: "platform"
  }
];

const HeroCarousel = () => {
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(defaultHeroSlides);
  
  // In a real implementation, this would fetch from your API/database
  useEffect(() => {
    // Fetch admin-managed slides
    const loadSlides = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/carousel-slides');
        // const slides = await response.json();
        // setHeroSlides(slides.filter(slide => slide.isActive));
        setHeroSlides(defaultHeroSlides.filter(slide => slide.isActive));
      } catch (error) {
        console.error('Failed to load carousel slides:', error);
      }
    };
    
    loadSlides();
  }, []);

  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true })
  );

  return (
    <section className="relative overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-0">
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              <div className="relative">
                {/* Background with gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-90 z-10`}></div>
                <div 
                  className="relative h-[600px] md:h-[700px] bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-20"></div>
                  
                  {/* Content */}
                  <div className="container relative z-30 flex h-full items-center">
                    <div className="max-w-3xl text-white">
                      {/* Badge */}
                      <div className="mb-6">
                        <Badge 
                          variant="secondary" 
                          className="bg-white/20 text-white border border-white/30 backdrop-blur-sm text-sm font-semibold px-4 py-2"
                        >
                          {slide.badge}
                        </Badge>
                      </div>
                      
                      {/* Main content */}
                      <div className="mb-8">
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                          {slide.title}
                        </h1>
                        <p className="text-xl md:text-2xl mb-6 text-white/90 font-medium">
                          {slide.subtitle}
                        </p>
                        <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                          {slide.description}
                        </p>
                        
                        {/* Location and Special Offers for Promotions */}
                        {slide.location && (
                          <p className="text-md text-white/90 mt-4">
                            📍 {slide.location}
                          </p>
                        )}
                        {slide.specialOffers && (
                          <p className="text-md text-yellow-200 mt-2 font-semibold">
                            🎉 {slide.specialOffers}
                          </p>
                        )}
                        {slide.contactInfo && (
                          <p className="text-md text-white/90 mt-2">
                            📞 {slide.contactInfo}
                          </p>
                        )}
                      </div>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-3 mb-8">
                        {slide.features.map((feature, index) => (
                          <div 
                            key={index}
                            className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20"
                          >
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center space-x-8 mb-8">
                        <div className="text-center">
                          <div className="text-3xl md:text-4xl font-bold">{slide.stats.primary}</div>
                          <div className="text-sm text-white/80">{slide.stats.primaryLabel}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl md:text-4xl font-bold">{slide.stats.secondary}</div>
                          <div className="text-sm text-white/80">{slide.stats.secondaryLabel}</div>
                        </div>
                      </div>
                      
                      {/* CTAs */}
                      {/* <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          size="xl"
                          className="group bg-white text-gray-900 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                          onClick={() => window.location.href = slide.ctaLink}
                        >
                          {slide.ctaText}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="xl" 
                          className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm"
                        >
                          <Play className="mr-2 h-4 w-4" />
                          {slide.secondaryCtaText}
                        </Button>
                      </div> */}
                    </div>
                    
                    {/* Right side icons/decorations */}
                    <div className="hidden lg:block absolute right-8 top-1/2 transform -translate-y-1/2">
                      <div className="space-y-6">
                        <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                          <Heart className="h-8 w-8 text-white" />
                        </div>
                        <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                          <Shield className="h-8 w-8 text-white" />
                        </div>
                        <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                          <Zap className="h-8 w-8 text-white" />
                        </div>
                        <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                          <Globe className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <div className="flex space-x-4">
            <CarouselPrevious className="static translate-y-0 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm" />
            <CarouselNext className="static translate-y-0 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm" />
          </div>
        </div>
        
        {/* Slide indicators */}
        <div className="absolute bottom-8 right-8 z-40">
          <div className="flex space-x-2">
            {heroSlides.map((_, index) => (
              <div 
                key={index}
                className="h-2 w-8 bg-white/40 rounded-full transition-all duration-300 hover:bg-white/60"
              ></div>
            ))}
          </div>
        </div>
      </Carousel>
    </section>
  );
};

export default HeroCarousel;