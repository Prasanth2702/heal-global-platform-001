// // // import React, { useState, useEffect } from 'react';
// // // import { Card, CardContent } from '@/components/ui/card';
// // // import { Button } from '@/components/ui/button';
// // // import { Badge } from '@/components/ui/badge';
// // // import {
// // //   Carousel,
// // //   CarouselContent,
// // //   CarouselItem,
// // //   CarouselNext,
// // //   CarouselPrevious,
// // // } from '@/components/ui/carousel';
// // // import { ArrowRight, Play, Calendar, Users, Heart, Shield, Zap, Globe } from 'lucide-react';
// // // import Autoplay from 'embla-carousel-autoplay';
// // // import heroImage from "@/assets/medical-hero.jpg";

// // // interface CarouselSlide {
// // //   id: string;
// // //   title: string;
// // //   subtitle: string;
// // //   description: string;
// // //   image: string;
// // //   ctaText: string;
// // //   secondaryCtaText: string;
// // //   ctaLink: string;
// // //   badge: string;
// // //   badgeColor: string;
// // //   features: string[];
// // //   stats: {
// // //     primary: string;
// // //     primaryLabel: string;
// // //     secondary: string;
// // //     secondaryLabel: string;
// // //   };
// // //   gradient: string;
// // //   isActive: boolean;
// // //   promotionType: 'platform' | 'hospital' | 'clinic' | 'service' | 'camp' | 'facility';
// // //   location?: string;
// // //   contactInfo?: string;
// // //   specialOffers?: string;
// // //   validUntil?: string;
// // // }

// // // // Default slides - these would be loaded from admin-managed content
// // // const defaultHeroSlides: CarouselSlide[] = [
// // //   {
// // //     id: '1',
// // //     title: "AI-Powered Medical Triage",
// // //     subtitle: "Instant Health Guidance",
// // //     description: "Get immediate medical advice with our advanced AI that analyzes symptoms and connects you with the right specialist in seconds.",
// // //     image: heroImage,
// // //     ctaText: "Try AI Triage",
// // //     secondaryCtaText: "Watch Demo",
// // //     ctaLink: "/ai-triage",
// // //     badge: "NEW",
// // //     badgeColor: "blue",
// // //     features: ["24/7 Available", "Multi-language", "HIPAA Secure"],
// // //     stats: { primary: "10K+", primaryLabel: "Consultations", secondary: "98%", secondaryLabel: "Accuracy" },
// // //     gradient: "from-blue-600 via-purple-600 to-teal-600",
// // //     isActive: true,
// // //     promotionType: "platform"
// // //   },
// // //   {
// // //     id: '2',
// // //     title: "NextGen Unified Medical Platform",
// // //     subtitle: "Complete Healthcare Ecosystem",
// // //     description: "AI-enhanced, multilingual, compliance-ready digital ecosystem connecting patients, medical professionals, and healthcare facilities.",
// // //     image: heroImage,
// // //     ctaText: "Get Started Today",
// // //     secondaryCtaText: "Learn More",
// // //     ctaLink: "/register/patient",
// // //     badge: "FEATURED",
// // //     badgeColor: "green",
// // //     features: ["AI-Enhanced", "Multilingual", "Compliance-Ready"],
// // //     stats: { primary: "50+", primaryLabel: "Countries", secondary: "1M+", secondaryLabel: "Users" },
// // //     gradient: "from-green-600 via-emerald-600 to-teal-600",
// // //     isActive: true,
// // //     promotionType: "platform"
// // //   },
// // //   {
// // //     id: '3',
// // //     title: "Secure Digital Health Records",
// // //     subtitle: "Your Health, Always Accessible",
// // //     description: "Bank-level security for your medical records with instant sharing capabilities and lifetime access from anywhere in the world.",
// // //     image: heroImage,
// // //     ctaText: "Secure Your Records",
// // //     secondaryCtaText: "View Security",
// // //     ctaLink: "/vault",
// // //     badge: "SECURE",
// // //     badgeColor: "orange",
// // //     features: ["Bank-level Security", "Instant Sharing", "Global Access"],
// // //     stats: { primary: "256-bit", primaryLabel: "Encryption", secondary: "99.9%", secondaryLabel: "Uptime" },
// // //     gradient: "from-orange-600 via-red-600 to-pink-600",
// // //     isActive: true,
// // //     promotionType: "platform"
// // //   },
// // //   {
// // //     id: '4',
// // //     title: "Telemedicine Revolution",
// // //     subtitle: "Healthcare Without Boundaries",
// // //     description: "High-quality video consultations with board-certified physicians. Healthcare that comes to you, wherever you are.",
// // //     image: heroImage,
// // //     ctaText: "Book Consultation",
// // //     secondaryCtaText: "Meet Doctors",
// // //     ctaLink: "/appointments",
// // //     badge: "POPULAR",
// // //     badgeColor: "purple",
// // //     features: ["HD Video Calls", "Board-Certified", "Insurance Accepted"],
// // //     stats: { primary: "5 min", primaryLabel: "Avg Wait", secondary: "24/7", secondaryLabel: "Available" },
// // //     gradient: "from-purple-600 via-indigo-600 to-blue-600",
// // //     isActive: true,
// // //     promotionType: "platform"
// // //   }
// // // ];

// // // const HeroCarousel = () => {
// // //   const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(defaultHeroSlides);
  
// // //   // In a real implementation, this would fetch from your API/database
// // //   useEffect(() => {
// // //     // Fetch admin-managed slides
// // //     const loadSlides = async () => {
// // //       try {
// // //         // Replace with actual API call
// // //         // const response = await fetch('/api/carousel-slides');
// // //         // const slides = await response.json();
// // //         // setHeroSlides(slides.filter(slide => slide.isActive));
// // //         setHeroSlides(defaultHeroSlides.filter(slide => slide.isActive));
// // //       } catch (error) {
// // //         console.error('Failed to load carousel slides:', error);
// // //       }
// // //     };
    
// // //     loadSlides();
// // //   }, []);

// // //   const plugin = React.useRef(
// // //     Autoplay({ delay: 6000, stopOnInteraction: true })
// // //   );

// // //   return (
// // //     <section className="relative overflow-hidden">
// // //       <Carousel
// // //         plugins={[plugin.current]}
// // //         className="w-full"
// // //         onMouseEnter={plugin.current.stop}
// // //         onMouseLeave={plugin.current.reset}
// // //       >
// // //         <CarouselContent className="-ml-0">
// // //           {heroSlides.map((slide) => (
// // //             <CarouselItem key={slide.id} className="pl-0">
// // //               <div className="relative">
// // //                 {/* Background with gradient overlay */}
// // //                 <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-90 z-10`}></div>
// // //                 <div 
// // //                   className="relative h-[600px] md:h-[700px] bg-cover bg-center bg-no-repeat"
// // //                   style={{ backgroundImage: `url(${slide.image})` }}
// // //                 >
// // //                   <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-20"></div>
                  
// // //                   {/* Content */}
// // //                   <div className="container relative z-30 flex h-full items-center">
// // //                     <div className="max-w-3xl text-white">
// // //                       {/* Badge */}
// // //                       <div className="mb-6">
// // //                         <Badge 
// // //                           variant="secondary" 
// // //                           className="bg-white/20 text-white border border-white/30 backdrop-blur-sm text-sm font-semibold px-4 py-2"
// // //                         >
// // //                           {slide.badge}
// // //                         </Badge>
// // //                       </div>
                      
// // //                       {/* Main content */}
// // //                       <div className="mb-8">
// // //                         <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
// // //                           {slide.title}
// // //                         </h1>
// // //                         <p className="text-xl md:text-2xl mb-6 text-white/90 font-medium">
// // //                           {slide.subtitle}
// // //                         </p>
// // //                         <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
// // //                           {slide.description}
// // //                         </p>
                        
// // //                         {/* Location and Special Offers for Promotions */}
// // //                         {slide.location && (
// // //                           <p className="text-md text-white/90 mt-4">
// // //                             📍 {slide.location}
// // //                           </p>
// // //                         )}
// // //                         {slide.specialOffers && (
// // //                           <p className="text-md text-yellow-200 mt-2 font-semibold">
// // //                             🎉 {slide.specialOffers}
// // //                           </p>
// // //                         )}
// // //                         {slide.contactInfo && (
// // //                           <p className="text-md text-white/90 mt-2">
// // //                             📞 {slide.contactInfo}
// // //                           </p>
// // //                         )}
// // //                       </div>
                      
// // //                       {/* Features */}
// // //                       <div className="flex flex-wrap gap-3 mb-8">
// // //                         {slide.features.map((feature, index) => (
// // //                           <div 
// // //                             key={index}
// // //                             className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20"
// // //                           >
// // //                             {feature}
// // //                           </div>
// // //                         ))}
// // //                       </div>
                      
// // //                       {/* Stats */}
// // //                       <div className="flex items-center space-x-8 mb-8">
// // //                         <div className="text-center">
// // //                           <div className="text-3xl md:text-4xl font-bold">{slide.stats.primary}</div>
// // //                           <div className="text-sm text-white/80">{slide.stats.primaryLabel}</div>
// // //                         </div>
// // //                         <div className="text-center">
// // //                           <div className="text-3xl md:text-4xl font-bold">{slide.stats.secondary}</div>
// // //                           <div className="text-sm text-white/80">{slide.stats.secondaryLabel}</div>
// // //                         </div>
// // //                       </div>
                      
// // //                       {/* CTAs */}
// // //                       {/* <div className="flex flex-col sm:flex-row gap-4">
// // //                         <Button 
// // //                           size="xl"
// // //                           className="group bg-white text-gray-900 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
// // //                           onClick={() => window.location.href = slide.ctaLink}
// // //                         >
// // //                           {slide.ctaText}
// // //                           <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
// // //                         </Button>
                        
// // //                         <Button 
// // //                           variant="outline" 
// // //                           size="xl" 
// // //                           className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm"
// // //                         >
// // //                           <Play className="mr-2 h-4 w-4" />
// // //                           {slide.secondaryCtaText}
// // //                         </Button>
// // //                       </div> */}
// // //                     </div>
                    
// // //                     {/* Right side icons/decorations */}
// // //                     <div className="hidden lg:block absolute right-8 top-1/2 transform -translate-y-1/2">
// // //                       <div className="space-y-6">
// // //                         <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
// // //                           <Heart className="h-8 w-8 text-white" />
// // //                         </div>
// // //                         <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
// // //                           <Shield className="h-8 w-8 text-white" />
// // //                         </div>
// // //                         <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
// // //                           <Zap className="h-8 w-8 text-white" />
// // //                         </div>
// // //                         <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
// // //                           <Globe className="h-8 w-8 text-white" />
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </CarouselItem>
// // //           ))}
// // //         </CarouselContent>
        
// // //         {/* Navigation */}
// // //         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
// // //           <div className="flex space-x-4">
// // //             <CarouselPrevious className="static translate-y-0 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm" />
// // //             <CarouselNext className="static translate-y-0 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm" />
// // //           </div>
// // //         </div>
        
// // //         {/* Slide indicators */}
// // //         <div className="absolute bottom-8 right-8 z-40">
// // //           <div className="flex space-x-2">
// // //             {heroSlides.map((_, index) => (
// // //               <div 
// // //                 key={index}
// // //                 className="h-2 w-8 bg-white/40 rounded-full transition-all duration-300 hover:bg-white/60"
// // //               ></div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </Carousel>
// // //     </section>
// // //   );
// // // };

// // // export default HeroCarousel;


// // import React, { useState, useEffect, useRef } from 'react';
// // import { Badge } from '@/components/ui/badge';
// // import {
// //   Carousel,
// //   CarouselContent,
// //   CarouselItem,
// //   CarouselNext,
// //   CarouselPrevious,
// // } from '@/components/ui/carousel';
// // import { Heart, Shield, Zap, Globe } from 'lucide-react';
// // import Autoplay from 'embla-carousel-autoplay';
// // import heroImage from "@/assets/medical-hero.jpg";
// // import { supabase } from '@/integrations/supabase/client';

// // // Types
// // interface CarouselSlide {
// //   id: string;
// //   title: string;
// //   subtitle: string;
// //   description: string;
// //   image: string;
// //   ctaText: string;
// //   secondaryCtaText: string;
// //   ctaLink: string;
// //   badge: string;
// //   badgeColor: string;
// //   features: string[];
// //   stats: {
// //     primary: string;
// //     primaryLabel: string;
// //     secondary: string;
// //     secondaryLabel: string;
// //   };
// //   gradient: string;
// //   isActive: boolean;
// //   promotionType: 'platform' | 'hospital' | 'clinic' | 'service' | 'camp' | 'facility';
// //   location?: string;
// //   contactInfo?: string;
// //   specialOffers?: string;
// //   validUntil?: string;
// // }

// // interface BannerItem {
// //   id: string;
// //   image_url: string;
// //   showorder?: number;
// // }

// // // Default hero slides (fallback)
// // const defaultHeroSlides: CarouselSlide[] = [
// //   {
// //     id: '1',
// //     title: "AI-Powered Medical Triage",
// //     subtitle: "Instant Health Guidance",
// //     description: "Get immediate medical advice with our advanced AI that analyzes symptoms and connects you with the right specialist in seconds.",
// //     image: heroImage,
// //     ctaText: "Try AI Triage",
// //     secondaryCtaText: "Watch Demo",
// //     ctaLink: "/ai-triage",
// //     badge: "NEW",
// //     badgeColor: "blue",
// //     features: ["24/7 Available", "Multi-language", "HIPAA Secure"],
// //     stats: { primary: "10K+", primaryLabel: "Consultations", secondary: "98%", secondaryLabel: "Accuracy" },
// //     gradient: "from-blue-600 via-purple-600 to-teal-600",
// //     isActive: true,
// //     promotionType: "platform"
// //   },
// //   {
// //     id: '2',
// //     title: "NextGen Unified Medical Platform",
// //     subtitle: "Complete Healthcare Ecosystem",
// //     description: "AI-enhanced, multilingual, compliance-ready digital ecosystem connecting patients, medical professionals, and healthcare facilities.",
// //     image: heroImage,
// //     ctaText: "Get Started Today",
// //     secondaryCtaText: "Learn More",
// //     ctaLink: "/register/patient",
// //     badge: "FEATURED",
// //     badgeColor: "green",
// //     features: ["AI-Enhanced", "Multilingual", "Compliance-Ready"],
// //     stats: { primary: "50+", primaryLabel: "Countries", secondary: "1M+", secondaryLabel: "Users" },
// //     gradient: "from-green-600 via-emerald-600 to-teal-600",
// //     isActive: true,
// //     promotionType: "platform"
// //   },
// //   {
// //     id: '3',
// //     title: "Secure Digital Health Records",
// //     subtitle: "Your Health, Always Accessible",
// //     description: "Bank-level security for your medical records with instant sharing capabilities and lifetime access from anywhere in the world.",
// //     image: heroImage,
// //     ctaText: "Secure Your Records",
// //     secondaryCtaText: "View Security",
// //     ctaLink: "/vault",
// //     badge: "SECURE",
// //     badgeColor: "orange",
// //     features: ["Bank-level Security", "Instant Sharing", "Global Access"],
// //     stats: { primary: "256-bit", primaryLabel: "Encryption", secondary: "99.9%", secondaryLabel: "Uptime" },
// //     gradient: "from-orange-600 via-red-600 to-pink-600",
// //     isActive: true,
// //     promotionType: "platform"
// //   },
// //   {
// //     id: '4',
// //     title: "Telemedicine Revolution",
// //     subtitle: "Healthcare Without Boundaries",
// //     description: "High-quality video consultations with board-certified physicians. Healthcare that comes to you, wherever you are.",
// //     image: heroImage,
// //     ctaText: "Book Consultation",
// //     secondaryCtaText: "Meet Doctors",
// //     ctaLink: "/appointments",
// //     badge: "POPULAR",
// //     badgeColor: "purple",
// //     features: ["HD Video Calls", "Board-Certified", "Insurance Accepted"],
// //     stats: { primary: "5 min", primaryLabel: "Avg Wait", secondary: "24/7", secondaryLabel: "Available" },
// //     gradient: "from-purple-600 via-indigo-600 to-blue-600",
// //     isActive: true,
// //     promotionType: "platform"
// //   }
// // ];

// // const HeroCarousel = () => {
// //   const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(defaultHeroSlides);
// //   const [bannerItems, setBannerItems] = useState<BannerItem[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   // Load hero slides (could be from admin API)
// //   useEffect(() => {
// //     setHeroSlides(defaultHeroSlides.filter(slide => slide.isActive));
// //   }, []);

// //   // Fetch banner images from Supabase – silently ignore missing table
// //   useEffect(() => {
// //     const fetchBanners = async () => {
// //       try {
// //         const { data, error } = await supabase
// //           .from("bannar_file")
// //           .select("id, image_url")
// //           .eq("status", true)
// //           .order("showorder", { ascending: true });

// //         if (error) {
// //           // If table doesn't exist (code 42P01), just treat as no banners
// //           if (error.code === '42P01') {
// //             console.log("Banner table not found – using default hero slides");
// //             setBannerItems([]);
// //           } else {
// //             console.error("Error fetching banners:", error);
// //             setBannerItems([]);
// //           }
// //         } else {
// //           setBannerItems(data || []);
// //         }
// //       } catch (err) {
// //         console.error("Unexpected error fetching banners:", err);
// //         setBannerItems([]);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchBanners();
// //   }, []);

// //   // Autoplay plugin
// //   const plugin = useRef(Autoplay({ delay: 6000, stopOnInteraction: true }));

// //   // Show banners only if we have items and no critical error
// //   const showBanners = bannerItems.length > 0;

// //   // Loading state
// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-[600px] md:h-[700px] bg-gray-100">
// //         <div className="text-center text-gray-500">Loading carousel...</div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <section className="relative overflow-hidden">
// //       <Carousel
// //         plugins={[plugin.current]}
// //         className="w-full"
// //         onMouseEnter={plugin.current.stop}
// //         onMouseLeave={plugin.current.reset}
// //       >
// //         <CarouselContent className="-ml-0">
// //           {showBanners ? (
// //             // Banner images as slides (full-width, no text overlay)
// //             bannerItems.map((banner) => (
// //               <CarouselItem key={banner.id} className="pl-0">
// //                 <div className="relative h-[600px] md:h-[700px] w-full">
// //                   <img
// //                     src={banner.image_url}
// //                     alt={`Banner ${banner.id}`}
// //                     className="w-full h-full object-cover"
// //                   />
// //                 </div>
// //               </CarouselItem>
// //             ))
// //           ) : (
// //             // Fallback to rich hero slides
// //             heroSlides.map((slide) => (
// //               <CarouselItem key={slide.id} className="pl-0">
// //                 <div className="relative">
// //                   {/* Gradient overlay */}
// //                   <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-90 z-10`}></div>
// //                   {/* Background image */}
// //                   <div
// //                     className="relative h-[600px] md:h-[700px] bg-cover bg-center bg-no-repeat"
// //                     style={{ backgroundImage: `url(${slide.image})` }}
// //                   >
// //                     <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-20"></div>
                    
// //                     {/* Content */}
// //                     <div className="container relative z-30 flex h-full items-center">
// //                       <div className="max-w-3xl text-white">
// //                         {/* Badge */}
// //                         <div className="mb-6">
// //                           <Badge 
// //                             variant="secondary" 
// //                             className="bg-white/20 text-white border border-white/30 backdrop-blur-sm text-sm font-semibold px-4 py-2"
// //                           >
// //                             {slide.badge}
// //                           </Badge>
// //                         </div>
                        
// //                         {/* Main content */}
// //                         <div className="mb-8">
// //                           <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
// //                             {slide.title}
// //                           </h1>
// //                           <p className="text-xl md:text-2xl mb-6 text-white/90 font-medium">
// //                             {slide.subtitle}
// //                           </p>
// //                           <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
// //                             {slide.description}
// //                           </p>
// //                           {slide.location && (
// //                             <p className="text-md text-white/90 mt-4">📍 {slide.location}</p>
// //                           )}
// //                           {slide.specialOffers && (
// //                             <p className="text-md text-yellow-200 mt-2 font-semibold">
// //                               🎉 {slide.specialOffers}
// //                             </p>
// //                           )}
// //                           {slide.contactInfo && (
// //                             <p className="text-md text-white/90 mt-2">📞 {slide.contactInfo}</p>
// //                           )}
// //                         </div>
                        
// //                         {/* Features */}
// //                         <div className="flex flex-wrap gap-3 mb-8">
// //                           {slide.features.map((feature, index) => (
// //                             <div 
// //                               key={index}
// //                               className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20"
// //                             >
// //                               {feature}
// //                             </div>
// //                           ))}
// //                         </div>
                        
// //                         {/* Stats */}
// //                         <div className="flex items-center space-x-8 mb-8">
// //                           <div className="text-center">
// //                             <div className="text-3xl md:text-4xl font-bold">{slide.stats.primary}</div>
// //                             <div className="text-sm text-white/80">{slide.stats.primaryLabel}</div>
// //                           </div>
// //                           <div className="text-center">
// //                             <div className="text-3xl md:text-4xl font-bold">{slide.stats.secondary}</div>
// //                             <div className="text-sm text-white/80">{slide.stats.secondaryLabel}</div>
// //                           </div>
// //                         </div>
// //                       </div>
                      
// //                       {/* Right side icons */}
// //                       <div className="hidden lg:block absolute right-8 top-1/2 transform -translate-y-1/2">
// //                         <div className="space-y-6">
// //                           <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
// //                             <Heart className="h-8 w-8 text-white" />
// //                           </div>
// //                           <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
// //                             <Shield className="h-8 w-8 text-white" />
// //                           </div>
// //                           <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
// //                             <Zap className="h-8 w-8 text-white" />
// //                           </div>
// //                           <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
// //                             <Globe className="h-8 w-8 text-white" />
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </CarouselItem>
// //             ))
// //           )}
// //         </CarouselContent>
        
// //         {/* Navigation buttons - show only if more than one slide */}
// //         {(showBanners ? bannerItems.length > 1 : heroSlides.length > 1) && (
// //           <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
// //             <div className="flex space-x-4">
// //               <CarouselPrevious className="static translate-y-0 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm" />
// //               <CarouselNext className="static translate-y-0 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm" />
// //             </div>
// //           </div>
// //         )}
        
// //         {/* Slide indicators */}
// //         {(showBanners ? bannerItems.length > 1 : heroSlides.length > 1) && (
// //           <div className="absolute bottom-8 right-8 z-40">
// //             <div className="flex space-x-2">
// //               {(showBanners ? bannerItems : heroSlides).map((_, idx) => (
// //                 <div 
// //                   key={idx}
// //                   className="h-2 w-8 bg-white/40 rounded-full transition-all duration-300 hover:bg-white/60"
// //                 />
// //               ))}
// //             </div>
// //           </div>
// //         )}
// //       </Carousel>
// //     </section>
// //   );
// // };

// // export default HeroCarousel;

// import React, { useState, useEffect, useRef } from 'react';
// import { Badge } from '@/components/ui/badge';
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from '@/components/ui/carousel';
// import { Heart, Shield, Zap, Globe } from 'lucide-react';
// import Autoplay from 'embla-carousel-autoplay';
// import heroImage from "@/assets/medical-hero.jpg";
// import { supabase } from '@/integrations/supabase/client';

// // Types
// interface CarouselSlide {
//   id: string;
//   title: string;
//   subtitle: string;
//   description: string;
//   image: string;
//   ctaText: string;
//   secondaryCtaText: string;
//   ctaLink: string;
//   badge: string;
//   badgeColor: string;
//   features: string[];
//   stats: {
//     primary: string;
//     primaryLabel: string;
//     secondary: string;
//     secondaryLabel: string;
//   };
//   gradient: string;
//   isActive: boolean;
// }

// interface BannerItem {
//   id: string;
//   image_url: string;
//   showorder?: number;
// }

// // Default Slides
// const defaultHeroSlides: CarouselSlide[] = [
//   {
//     id: '1',
//     title: "AI-Powered Medical Triage",
//     subtitle: "Instant Health Guidance",
//     description:
//       "Get immediate medical advice with our advanced AI that analyzes symptoms and connects you with the right specialist.",
//     image: heroImage,
//     ctaText: "Try AI",
//     secondaryCtaText: "Learn",
//     ctaLink: "/",
//     badge: "NEW",
//     badgeColor: "blue",
//     features: ["24/7", "AI", "Secure"],
//     stats: {
//       primary: "10K+",
//       primaryLabel: "Consultations",
//       secondary: "98%",
//       secondaryLabel: "Accuracy",
//     },
//     gradient: "from-blue-600 via-purple-600 to-teal-600",
//     isActive: true,
//   },
//   {
//     id: '2',
//     title: "Telemedicine Platform",
//     subtitle: "Healthcare Anywhere",
//     description:
//       "Consult top doctors through secure video consultation.",
//     image: heroImage,
//     ctaText: "Book",
//     secondaryCtaText: "Doctors",
//     ctaLink: "/",
//     badge: "POPULAR",
//     badgeColor: "green",
//     features: ["HD", "Secure", "24/7"],
//     stats: {
//       primary: "5 min",
//       primaryLabel: "Wait",
//       secondary: "24/7",
//       secondaryLabel: "Support",
//     },
//     gradient: "from-green-600 via-emerald-600 to-teal-600",
//     isActive: true,
//   }
// ];

// const HeroCarousel = () => {
//   const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>([]);
//   const [bannerItems, setBannerItems] = useState<BannerItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   const plugin = useRef(
//     Autoplay({
//       delay: 5000,
//       stopOnInteraction: true,
//     })
//   );

//   useEffect(() => {
//     setHeroSlides(defaultHeroSlides.filter(s => s.isActive));
//   }, []);

//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("bannar_file")
//           .select("id,image_url")
//           .eq("status", true)
//           .order("showorder", { ascending: true });

//         if (error) {
//           console.log("Banner not found", error);
//           setBannerItems([]);
//         } else {
//           setBannerItems(data || []);
//         }
//       } catch (error) {
//         console.log(error);
//         setBannerItems([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBanners();
//   }, []);

//   // Merge banner + hero
//   const combinedSlides = [
//     ...bannerItems.map((banner) => ({
//       id: `banner-${banner.id}`,
//       type: "banner",
//       image: banner.image_url,
//     })),
//     ...heroSlides.map((slide) => ({
//       ...slide,
//       type: "hero",
//     })),
//   ];

//   if (loading) {
//     return (
//       <div className="h-[600px] flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <section className="relative overflow-hidden">
//       <Carousel
//         plugins={[plugin.current]}
//         className="w-full"
//         onMouseEnter={plugin.current.stop}
//         onMouseLeave={plugin.current.reset}
//       >
//         <CarouselContent className="-ml-0">

//           {combinedSlides.map((slide: any) => (
//             <CarouselItem key={slide.id} className="pl-0">

//               {slide.type === "banner" ? (

//                 <div className="h-[600px] md:h-[700px]">
//                   <img
//                     src={slide.image}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//               ) : (

//                 <div className="relative">

//                   <div
//                     className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-90 z-10`}
//                   />

//                   <div
//                     className="h-[600px] md:h-[700px] bg-cover bg-center"
//                     style={{
//                       backgroundImage: `url(${slide.image})`,
//                     }}
//                   >
//                     <div className="container relative z-20 h-full flex items-center">

//                       <div className="text-white max-w-3xl">

//                         <Badge className="mb-4 bg-white/20 text-white">
//                           {slide.badge}
//                         </Badge>

//                         <h1 className="text-5xl font-bold mb-4">
//                           {slide.title}
//                         </h1>

//                         <p className="text-xl mb-4">
//                           {slide.subtitle}
//                         </p>

//                         <p className="text-lg text-white/80">
//                           {slide.description}
//                         </p>

//                         <div className="flex gap-6 mt-8">

//                           <div>
//                             <div className="text-3xl font-bold">
//                               {slide.stats.primary}
//                             </div>
//                             <div>
//                               {slide.stats.primaryLabel}
//                             </div>
//                           </div>

//                           <div>
//                             <div className="text-3xl font-bold">
//                               {slide.stats.secondary}
//                             </div>
//                             <div>
//                               {slide.stats.secondaryLabel}
//                             </div>
//                           </div>

//                         </div>

//                       </div>

//                       <div className="absolute right-10 space-y-4 hidden lg:block">

//                         <div className="p-4 bg-white/20 rounded-full">
//                           <Heart className="text-white" />
//                         </div>

//                         <div className="p-4 bg-white/20 rounded-full">
//                           <Shield className="text-white" />
//                         </div>

//                         <div className="p-4 bg-white/20 rounded-full">
//                           <Zap className="text-white" />
//                         </div>

//                         <div className="p-4 bg-white/20 rounded-full">
//                           <Globe className="text-white" />
//                         </div>

//                       </div>

//                     </div>
//                   </div>
//                 </div>

//               )}

//             </CarouselItem>
//           ))}

//         </CarouselContent>

//         {combinedSlides.length > 1 && (
//           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
//             <CarouselPrevious />
//             <CarouselNext />
//           </div>
//         )}

//       </Carousel>
//     </section>
//   );
// };

// export default HeroCarousel;

import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Heart, Shield, Zap, Globe } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import heroImage from "@/assets/medical-hero.jpg";
import { supabase } from '@/integrations/supabase/client';

// Types (unchanged)
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

interface BannerItem {
  id: string;
  image_url: string;
  showorder?: number;
  link_url:string;
}

// Default hero slides (unchanged)
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
    features: ["24/7 Available"],
    stats: { primary: "10K+", primaryLabel: "Consultations", secondary: "98%", secondaryLabel: "Accuracy" },
    gradient: "from-blue-600 via-purple-600 to-teal-600",
    isActive: true,
    promotionType: "platform"
  },
  {
    id: '2',
    title: "Gen Z era Unified Medical Platform",
    subtitle: "Complete Healthcare Ecosystem",
    description: "AI-enhanced, compliance-ready digital ecosystem connecting patients, medical professionals, and healthcare facilities.",
    image: heroImage,
    ctaText: "Get Started Today",
    secondaryCtaText: "Learn More",
    ctaLink: "/register/patient",
    badge: "FEATURED",
    badgeColor: "green",
    features: ["AI-Enhanced", "Compliance-Ready"],
    stats: { primary: "50+", primaryLabel: "Countries", secondary: "1M+", secondaryLabel: "Users" },
    gradient: "from-green-600 via-emerald-600 to-teal-600",
    isActive: true,
    promotionType: "platform"
  },
  {
    id: '3',
    title: "Secure Digital Health Records",
    subtitle: "Your Health, Always Accessible",
    description: "High-level security for your medical records with instant sharing capabilities and lifetime access from anywhere in the world.",
    image: heroImage,
    ctaText: "Secure Your Records",
    secondaryCtaText: "View Security",
    ctaLink: "/vault",
    badge: "SECURE",
    badgeColor: "orange",
    features: ["High-level Security", "Instant Sharing", "Global Access"],
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
    features: ["HD Video Calls"],
    stats: { primary: "5 min", primaryLabel: "Avg Wait", secondary: "24/7", secondaryLabel: "Available" },
    gradient: "from-purple-600 via-indigo-600 to-blue-600",
    isActive: true,
    promotionType: "platform"
  }
];

const HeroCarousel = () => {
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(defaultHeroSlides);
  const [bannerItems, setBannerItems] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load hero slides (static)
  useEffect(() => {
    setHeroSlides(defaultHeroSlides.filter(slide => slide.isActive));
  }, []);

  // Fetch banner images from Supabase – silently ignore missing table
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data, error } = await supabase
          .from("bannar_file")
          .select("id, image_url,link_url")
          .eq("status", true)
          .order("showorder", { ascending: true });

        if (error) {
          if (error.code === '42P01') {
            console.log("Banner table not found – using only hero slides");
            setBannerItems([]);
          } else {
            console.error("Error fetching banners:", error);
            setBannerItems([]);
          }
        } else {
          setBannerItems(data || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching banners:", err);
        setBannerItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // ✅ Combine both: banners first, then hero slides
  const allSlides = [
    ...heroSlides.map(slide => ({ type: 'hero' as const, slide })),
    ...bannerItems.map(banner => ({ type: 'banner' as const, banner }))
  ];

  const plugin = useRef(Autoplay({ delay: 6000, stopOnInteraction: true }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px] md:h-[700px] bg-gray-100">
        <div className="text-center text-gray-500">Loading carousel...</div>
      </div>
    );
  }

  // If no slides at all (should not happen because heroSlides always exist)
  if (allSlides.length === 0) return null;

  return (
    <section className="relative overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-0">
          {allSlides.map((item, idx) => {
            if (item.type === 'banner') {
              return (
                <CarouselItem key={`banner-${item.banner.id}`} className="pl-0">
                  {/* <div className="relative h-[600px] md:h-[700px] w-full">
                       <a
                href={item.banner.link_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                    <img
                      src={item.banner.image_url}
                      alt={`Banner ${item.banner.id}`}
                      className="w-full h-full object-cover"
                    />
                    </a>
                  </div> */}
                  <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full bg-blue-100 flex items-center justify-center">
  <a
    href={item.banner.link_url}
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full h-full flex items-center justify-center"
  >
    <img
      src={item.banner.image_url}
      alt={`Banner ${item.banner.id}`}
      className="max-w-full max-h-full object-contain"
    />
  </a>
</div>
                </CarouselItem>
              );
            } else {
              const slide = item.slide;
              return (
                <CarouselItem key={`hero-${slide.id}`} className="pl-0">
                  <div className="relative">
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} opacity-90 z-10`}></div>
                    {/* Background image */}
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
                            {slide.location && (
                              <p className="text-md text-white/90 mt-4">📍 {slide.location}</p>
                            )}
                            {slide.specialOffers && (
                              <p className="text-md text-yellow-200 mt-2 font-semibold">
                                🎉 {slide.specialOffers}
                              </p>
                            )}
                            {slide.contactInfo && (
                              <p className="text-md text-white/90 mt-2">📞 {slide.contactInfo}</p>
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
                          {/* <div className="flex items-center space-x-8 mb-8">
                            <div className="text-center">
                              <div className="text-3xl md:text-4xl font-bold">{slide.stats.primary}</div>
                              <div className="text-sm text-white/80">{slide.stats.primaryLabel}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-3xl md:text-4xl font-bold">{slide.stats.secondary}</div>
                              <div className="text-sm text-white/80">{slide.stats.secondaryLabel}</div>
                            </div>
                          </div> */}
                        </div>
                        
                        {/* Right side icons */}
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
              );
            }
          })}
        </CarouselContent>
        
        {/* Navigation buttons - show if total slides > 1 */}
        {allSlides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
            <div className="flex space-x-4">
              <CarouselPrevious className="static translate-y-0 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm" />
              <CarouselNext className="static translate-y-0 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm" />
            </div>
          </div>
        )}
        
        {/* Slide indicators - one dot per total slide */}
        {allSlides.length > 1 && (
          <div className="absolute bottom-8 right-8 z-40">
            <div className="flex space-x-2">
              {allSlides.map((_, idx) => (
                <div 
                  key={idx}
                  className="h-2 w-8 bg-white/40 rounded-full transition-all duration-300 hover:bg-white/60"
                />
              ))}
            </div>
          </div>
        )}
      </Carousel>
    </section>
  );
};

export default HeroCarousel;