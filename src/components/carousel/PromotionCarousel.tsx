import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Users, Clock, Shield } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

const promotions = [
  {
    id: 1,
    title: "AI-Powered Health Triage",
    subtitle: "Get instant medical guidance",
    description: "Our advanced AI analyzes your symptoms and connects you with the right specialist instantly.",
    image: "/api/placeholder/800/400",
    badge: "NEW",
    badgeVariant: "default" as const,
    ctaText: "Try AI Triage",
    ctaLink: "/ai-triage",
    features: ["24/7 Available", "Multi-language", "HIPAA Secure"],
    icon: Star,
    gradient: "from-blue-600 to-purple-600"
  },
  {
    id: 2,
    title: "Telemedicine Made Simple",
    subtitle: "Consult with doctors anywhere, anytime",
    description: "High-quality video consultations with board-certified physicians from the comfort of your home.",
    image: "/api/placeholder/800/400",
    badge: "POPULAR",
    badgeVariant: "secondary" as const,
    ctaText: "Book Consultation",
    ctaLink: "/appointments",
    features: ["HD Video Calls", "Prescription Service", "Insurance Accepted"],
    icon: Users,
    gradient: "from-green-600 to-teal-600"
  },
  {
    id: 3,
    title: "Digital Health Records",
    subtitle: "Your medical history, always accessible",
    description: "Secure, comprehensive digital health records that travel with you and can be shared instantly with any healthcare provider.",
    image: "/api/placeholder/800/400",
    badge: "SECURE",
    badgeVariant: "outline" as const,
    ctaText: "Manage Records",
    ctaLink: "/vault",
    features: ["Bank-level Security", "Instant Sharing", "Lifetime Access"],
    icon: Shield,
    gradient: "from-orange-600 to-red-600"
  },
  {
    id: 4,
    title: "Family Health Plans",
    subtitle: "Complete care for your loved ones",
    description: "Comprehensive health plans covering telemedicine, preventive care, and emergency services for the whole family.",
    image: "/api/placeholder/800/400",
    badge: "LIMITED TIME",
    badgeVariant: "destructive" as const,
    ctaText: "View Plans",
    ctaLink: "/plans",
    features: ["Family Discounts", "Preventive Care", "Emergency Coverage"],
    icon: Clock,
    gradient: "from-purple-600 to-pink-600"
  }
];

const PromotionCarousel = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {promotions.map((promo) => {
            const IconComponent = promo.icon;
            return (
              <CarouselItem key={promo.id} className="pl-2 md:pl-4">
                <Card className="overflow-hidden border-0 shadow-xl">
                  <CardContent className="p-0 relative">
                    <div className={`bg-gradient-to-r ${promo.gradient} text-white`}>
                      <div className="relative p-8 md:p-12">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white/30"></div>
                          <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full border border-white/20"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-3">
                              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                <IconComponent className="h-6 w-6" />
                              </div>
                              <Badge variant={promo.badgeVariant} className="text-xs font-semibold">
                                {promo.badge}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="mb-6">
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">
                              {promo.title}
                            </h3>
                            <p className="text-lg text-white/90 mb-4">
                              {promo.subtitle}
                            </p>
                            <p className="text-white/80 leading-relaxed max-w-2xl">
                              {promo.description}
                            </p>
                          </div>
                          
                          {/* Features */}
                          <div className="flex flex-wrap gap-3 mb-8">
                            {promo.features.map((feature, index) => (
                              <div 
                                key={index}
                                className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm"
                              >
                                {feature}
                              </div>
                            ))}
                          </div>
                          
                          {/* CTA */}
                          <Button 
                            variant="secondary"
                            size="lg"
                            className="group bg-white text-gray-900 hover:bg-white/90 transition-all duration-300"
                            onClick={() => window.location.href = promo.ctaLink}
                          >
                            {promo.ctaText}
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        
        <div className="flex justify-center mt-8 space-x-4">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default PromotionCarousel;