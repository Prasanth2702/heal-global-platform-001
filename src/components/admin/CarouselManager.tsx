import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Save, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  Hospital,
  Users,
  Calendar,
  MapPin
} from 'lucide-react';

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

const defaultSlides: CarouselSlide[] = [
  {
    id: '1',
    title: 'NextGen Unified Medical Platform',
    subtitle: 'Complete Healthcare Ecosystem',
    description: 'AI-enhanced, multilingual, compliance-ready digital ecosystem connecting patients, medical professionals, and healthcare facilities.',
    image: '/assets/medical-hero.jpg',
    ctaText: 'Get Started Today',
    secondaryCtaText: 'Learn More',
    ctaLink: '/register/patient',
    badge: 'FEATURED',
    badgeColor: 'blue',
    features: ['AI-Enhanced', 'Multilingual', 'Compliance-Ready'],
    stats: { primary: '50+', primaryLabel: 'Countries', secondary: '1M+', secondaryLabel: 'Users' },
    gradient: 'from-green-600 via-emerald-600 to-teal-600',
    isActive: true,
    promotionType: 'platform'
  }
];

const promotionTypes = [
  { value: 'platform', label: 'Platform Feature', icon: Users },
  { value: 'hospital', label: 'Hospital', icon: Hospital },
  { value: 'clinic', label: 'Clinic', icon: Users },
  { value: 'service', label: 'Medical Service', icon: Users },
  { value: 'camp', label: 'Medical Camp', icon: Calendar },
  { value: 'facility', label: 'Medical Facility', icon: MapPin }
];

const gradientOptions = [
  { value: 'from-blue-600 via-purple-600 to-teal-600', label: 'Blue Teal', preview: 'bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600' },
  { value: 'from-green-600 via-emerald-600 to-teal-600', label: 'Green Teal', preview: 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600' },
  { value: 'from-orange-600 via-red-600 to-pink-600', label: 'Orange Pink', preview: 'bg-gradient-to-r from-orange-600 via-red-600 to-pink-600' },
  { value: 'from-purple-600 via-indigo-600 to-blue-600', label: 'Purple Blue', preview: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600' },
  { value: 'from-red-600 via-rose-600 to-pink-600', label: 'Red Rose', preview: 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600' }
];

const CarouselManager = () => {
  const { toast } = useToast();
  const [slides, setSlides] = useState<CarouselSlide[]>(defaultSlides);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>('');

  const [formData, setFormData] = useState<Partial<CarouselSlide>>({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    ctaText: '',
    secondaryCtaText: '',
    ctaLink: '',
    badge: '',
    badgeColor: 'blue',
    features: [''],
    stats: { primary: '', primaryLabel: '', secondary: '', secondaryLabel: '' },
    gradient: 'from-blue-600 via-purple-600 to-teal-600',
    isActive: true,
    promotionType: 'platform',
    location: '',
    contactInfo: '',
    specialOffers: '',
    validUntil: ''
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, upload to your storage service
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setFormData(prev => ({ ...prev, image: imageUrl }));
      
      toast({
        title: 'Image Uploaded',
        description: 'Image has been uploaded successfully',
      });
    }
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.map((feat, i) => i === index ? value : feat) || []
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const saveSlide = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: 'Validation Error',
        description: 'Title and description are required',
        variant: 'destructive'
      });
      return;
    }

    const slideData: CarouselSlide = {
      id: editingSlide?.id || Date.now().toString(),
      title: formData.title || '',
      subtitle: formData.subtitle || '',
      description: formData.description || '',
      image: formData.image || '/assets/medical-hero.jpg',
      ctaText: formData.ctaText || 'Learn More',
      secondaryCtaText: formData.secondaryCtaText || 'Contact Us',
      ctaLink: formData.ctaLink || '#',
      badge: formData.badge || 'NEW',
      badgeColor: formData.badgeColor || 'blue',
      features: formData.features?.filter(f => f.trim()) || [],
      stats: formData.stats || { primary: '', primaryLabel: '', secondary: '', secondaryLabel: '' },
      gradient: formData.gradient || 'from-blue-600 via-purple-600 to-teal-600',
      isActive: formData.isActive ?? true,
      promotionType: formData.promotionType || 'platform',
      location: formData.location,
      contactInfo: formData.contactInfo,
      specialOffers: formData.specialOffers,
      validUntil: formData.validUntil
    };

    if (editingSlide) {
      setSlides(prev => prev.map(slide => slide.id === editingSlide.id ? slideData : slide));
      toast({
        title: 'Slide Updated',
        description: 'Carousel slide has been updated successfully',
      });
    } else {
      setSlides(prev => [...prev, slideData]);
      toast({
        title: 'Slide Added',
        description: 'New carousel slide has been added successfully',
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setEditingSlide(null);
    setShowForm(false);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      ctaText: '',
      secondaryCtaText: '',
      ctaLink: '',
      badge: '',
      badgeColor: 'blue',
      features: [''],
      stats: { primary: '', primaryLabel: '', secondary: '', secondaryLabel: '' },
      gradient: 'from-blue-600 via-purple-600 to-teal-600',
      isActive: true,
      promotionType: 'platform',
      location: '',
      contactInfo: '',
      specialOffers: '',
      validUntil: ''
    });
    setUploadedImage('');
  };

  const editSlide = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setFormData(slide);
    setShowForm(true);
  };

  const deleteSlide = (slideId: string) => {
    setSlides(prev => prev.filter(slide => slide.id !== slideId));
    toast({
      title: 'Slide Deleted',
      description: 'Carousel slide has been deleted',
    });
  };

  const toggleSlideActive = (slideId: string) => {
    setSlides(prev => prev.map(slide => 
      slide.id === slideId ? { ...slide, isActive: !slide.isActive } : slide
    ));
  };

  const getPromotionTypeIcon = (type: string) => {
    const typeData = promotionTypes.find(t => t.value === type);
    const IconComponent = typeData?.icon || Users;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hero Carousel Management</h2>
          <p className="text-muted-foreground">
            Manage promotional slides for hospitals, clinics, services, and campaigns
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Slide
        </Button>
      </div>

      {/* Slide Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSlide ? 'Edit Slide' : 'Create New Slide'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., City General Hospital"
                />
              </div>
              
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g., Excellence in Healthcare"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the promotion, service, or facility"
                rows={3}
              />
            </div>

            {/* Promotion Type and Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="promotionType">Promotion Type</Label>
                <select 
                  id="promotionType"
                  value={formData.promotionType}
                  onChange={(e) => setFormData(prev => ({ ...prev, promotionType: e.target.value as any }))}
                  className="w-full border rounded px-3 py-2"
                >
                  {promotionTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Downtown Medical District"
                />
              </div>
              
              <div>
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="image-upload">Promotional Image</Label>
              <div className="mt-2 space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  {uploadedImage && (
                    <Badge variant="secondary">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      Image uploaded
                    </Badge>
                  )}
                </div>
                {uploadedImage && (
                  <div className="w-full h-32 rounded-lg overflow-hidden border">
                    <img 
                      src={uploadedImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* CTAs and Badge */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="ctaText">Primary CTA</Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) => setFormData(prev => ({ ...prev, ctaText: e.target.value }))}
                  placeholder="e.g., Book Appointment"
                />
              </div>
              
              <div>
                <Label htmlFor="secondaryCtaText">Secondary CTA</Label>
                <Input
                  id="secondaryCtaText"
                  value={formData.secondaryCtaText}
                  onChange={(e) => setFormData(prev => ({ ...prev, secondaryCtaText: e.target.value }))}
                  placeholder="e.g., Learn More"
                />
              </div>
              
              <div>
                <Label htmlFor="badge">Badge Text</Label>
                <Input
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                  placeholder="e.g., NEW, FEATURED"
                />
              </div>
              
              <div>
                <Label htmlFor="ctaLink">CTA Link</Label>
                <Input
                  id="ctaLink"
                  value={formData.ctaLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, ctaLink: e.target.value }))}
                  placeholder="/appointments"
                />
              </div>
            </div>

            {/* Gradient Selection */}
            <div>
              <Label>Background Gradient</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                {gradientOptions.map(option => (
                  <div
                    key={option.value}
                    className={`h-12 rounded-lg cursor-pointer border-2 ${
                      formData.gradient === option.value ? 'border-primary' : 'border-transparent'
                    } ${option.preview}`}
                    onClick={() => setFormData(prev => ({ ...prev, gradient: option.value }))}
                    title={option.label}
                  ></div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <Label>Features/Highlights</Label>
              <div className="space-y-2 mt-2">
                {formData.features?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Feature highlight"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Feature
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="statPrimary">Primary Stat</Label>
                <Input
                  id="statPrimary"
                  value={formData.stats?.primary}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    stats: { ...prev.stats!, primary: e.target.value } 
                  }))}
                  placeholder="e.g., 250+"
                />
              </div>
              
              <div>
                <Label htmlFor="statPrimaryLabel">Primary Label</Label>
                <Input
                  id="statPrimaryLabel"
                  value={formData.stats?.primaryLabel}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    stats: { ...prev.stats!, primaryLabel: e.target.value } 
                  }))}
                  placeholder="e.g., Beds"
                />
              </div>
              
              <div>
                <Label htmlFor="statSecondary">Secondary Stat</Label>
                <Input
                  id="statSecondary"
                  value={formData.stats?.secondary}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    stats: { ...prev.stats!, secondary: e.target.value } 
                  }))}
                  placeholder="e.g., 24/7"
                />
              </div>
              
              <div>
                <Label htmlFor="statSecondaryLabel">Secondary Label</Label>
                <Input
                  id="statSecondaryLabel"
                  value={formData.stats?.secondaryLabel}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    stats: { ...prev.stats!, secondaryLabel: e.target.value } 
                  }))}
                  placeholder="e.g., Emergency"
                />
              </div>
            </div>

            {/* Additional Fields for Promotions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactInfo">Contact Information</Label>
                <Input
                  id="contactInfo"
                  value={formData.contactInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                  placeholder="Phone: +1-XXX-XXX-XXXX"
                />
              </div>
              
              <div>
                <Label htmlFor="specialOffers">Special Offers</Label>
                <Input
                  id="specialOffers"
                  value={formData.specialOffers}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialOffers: e.target.value }))}
                  placeholder="e.g., 20% off consultations"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button onClick={saveSlide}>
                <Save className="h-4 w-4 mr-2" />
                {editingSlide ? 'Update Slide' : 'Save Slide'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Slides List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Slides ({slides.length})</h3>
        {slides.map((slide) => (
          <Card key={slide.id} className={slide.isActive ? '' : 'opacity-50'}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getPromotionTypeIcon(slide.promotionType)}
                    <h4 className="font-semibold">{slide.title}</h4>
                    <Badge variant="outline">{slide.promotionType}</Badge>
                    {slide.badge && (
                      <Badge className="bg-blue-100 text-blue-800">{slide.badge}</Badge>
                    )}
                    {!slide.isActive && (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{slide.subtitle}</p>
                  <p className="text-sm line-clamp-2 mb-3">{slide.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    {slide.location && (
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {slide.location}
                      </span>
                    )}
                    {slide.validUntil && (
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Valid until {slide.validUntil}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleSlideActive(slide.id)}
                  >
                    {slide.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editSlide(slide)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteSlide(slide.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CarouselManager;