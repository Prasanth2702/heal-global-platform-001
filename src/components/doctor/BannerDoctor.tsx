import React, { useState, useRef, useEffect } from 'react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Upload, 
  Type, 
  Link as LinkIcon, 
  Image, 
  Trash2, 
  Eye,
  CheckCircle
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const BannerDoctor: React.FC = () => {
  // State for input fields (what user edits)
  const [imageUrlInput, setImageUrlInput] = useState<string>('https://picsum.photos/id/104/1200/400');
  const [textInput, setTextInput] = useState<string>('Special Offer');
  const [subtextInput, setSubtextInput] = useState<string>('Get up to 50% off on your first purchase');
  const [linkInput, setLinkInput] = useState<string>('https://example.com');
  const [alignInput, setAlignInput] = useState<'left' | 'center' | 'right'>('center');

  // State for actual banner display (what is shown in preview)
  const [displayBgImage, setDisplayBgImage] = useState<string>('https://picsum.photos/id/104/1200/400');
  const [displayText, setDisplayText] = useState<string>('Special Offer');
  const [displaySubtext, setDisplaySubtext] = useState<string>('Get up to 50% off on your first purchase');
  const [displayLink, setDisplayLink] = useState<string>('https://example.com');
  const [displayAlign, setDisplayAlign] = useState<'left' | 'center' | 'right'>('center');

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  // Cleanup object URLs on unmount or when new upload replaces
  useEffect(() => {
    return () => {
      if (imageUrlInput.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrlInput);
      }
    };
  }, [imageUrlInput]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke previous blob URL if exists
      if (imageUrlInput.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrlInput);
      }
      const objectUrl = URL.createObjectURL(file);
      setImageUrlInput(objectUrl);
      setUploadedFileName(file.name);
    }
  };

  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Button 1: Create Text Banner (Full banner with image, text, link, alignment)
  const handleCreateTextBanner = () => {
    setDisplayBgImage(imageUrlInput);
    setDisplayText(textInput);
    setDisplaySubtext(subtextInput);
    setDisplayLink(linkInput);
    setDisplayAlign(alignInput);
  };

  // Button 2: Image & Link Only (no text)
  const handleImageOnlyBanner = () => {
    setDisplayBgImage(imageUrlInput);
    setDisplayText(''); // Clear main text
    setDisplaySubtext(''); // Clear subtext
    setDisplayLink(linkInput);
    // Keep current alignment but text is empty so won't matter
  };

  // Button 3: Reset Banner
  const handleResetBanner = () => {
    const defaultImage = 'https://picsum.photos/id/104/1200/400';
    setDisplayBgImage(defaultImage);
    setDisplayText('Special Offer');
    setDisplaySubtext('Get up to 50% off on your first purchase');
    setDisplayLink('https://example.com');
    setDisplayAlign('center');
    
    // Also reset input fields
    setImageUrlInput(defaultImage);
    setTextInput('Special Offer');
    setSubtextInput('Get up to 50% off on your first purchase');
    setLinkInput('https://example.com');
    setAlignInput('center');
    setUploadedFileName('');
    
    // Clear file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle banner click - navigate to link
  const handleBannerClick = () => {
    if (displayLink && displayLink !== '#') {
      window.open(displayLink, '_blank');
    }
  };

  // Alignment buttons handler
  const handleAlignmentChange = (align: 'left' | 'center' | 'right') => {
    setAlignInput(align);
    setDisplayAlign(align);
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold" style={{ color: '#1a1a2e' }}>
            🎨 Banner Doctor
          </h1>
          <p className="lead text-muted">Create, customize, and preview stunning banners</p>
        </div>

        {/* Banner Preview Section */}
        <div className="card shadow-lg mb-5 border-0 rounded-4 overflow-hidden">
          <div className="card-header bg-white py-3 border-0">
            <h5 className="mb-0 fw-semibold">
              <Eye className="me-2" size={20} />
              Banner Preview
            </h5>
          </div>
          <div className="card-body p-0">
            <div 
              className="position-relative banner-preview"
              style={{
                backgroundImage: `url(${displayBgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '400px',
                cursor: displayLink ? 'pointer' : 'default',
                transition: 'all 0.3s ease'
              }}
              onClick={handleBannerClick}
            >
              {/* Dark overlay for better text readability */}
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}></div>
              
              {/* Banner Content */}
              <div 
                className="position-relative h-100 d-flex flex-column justify-content-center p-5"
                style={{ 
                  textAlign: displayAlign,
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                {displayText && (
                  <h1 
                    className="display-4 fw-bold mb-3 animate__animated animate__fadeIn"
                    style={{ 
                      wordBreak: 'break-word',
                      fontSize: displayAlign === 'center' ? '3rem' : '2.5rem'
                    }}
                  >
                    {displayText}
                  </h1>
                )}
                {displaySubtext && (
                  <p 
                    className="lead mb-0"
                    style={{ 
                      fontSize: '1.2rem',
                      maxWidth: displayAlign === 'center' ? '80%' : '100%',
                      marginLeft: displayAlign === 'center' ? 'auto' : '0',
                      marginRight: displayAlign === 'center' ? 'auto' : '0'
                    }}
                  >
                    {displaySubtext}
                  </p>
                )}
                {!displayText && !displaySubtext && (
                  <div className="text-center">
                    <p className="lead">Image Only Banner</p>
                    <small>Click to visit link</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="row g-4">
          {/* Image Section */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 rounded-4 h-100">
              <div className="card-body p-4">
                <h5 className="card-title fw-semibold mb-3">
                  <Image className="me-2" size={20} />
                  Background Image
                </h5>
                
                <div className="mb-3">
                  <label className="form-label fw-medium">Upload Image</label>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary flex-grow-1"
                      onClick={triggerFileUpload}
                    >
                      <Upload size={18} className="me-2" />
                      Choose File
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept="image/*"
                      className="d-none"
                    />
                  </div>
                  {uploadedFileName && (
                    <small className="text-muted mt-2 d-block">
                      📁 {uploadedFileName}
                    </small>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Or Image URL</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                  />
                </div>

                {/* Current image preview */}
                {imageUrlInput && (
                  <div className="mt-3">
                    <img 
                      src={imageUrlInput} 
                      alt="Preview" 
                      className="img-fluid rounded-3"
                      style={{ maxHeight: '100px', objectFit: 'cover', width: '100%' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Text & Link Section */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 rounded-4 h-100">
              <div className="card-body p-4">
                <h5 className="card-title fw-semibold mb-3">
                  <Type className="me-2" size={20} />
                  Content & Link
                </h5>
                
                <div className="mb-3">
                  <label className="form-label fw-medium">Main Title</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Enter banner title"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Subtitle / Description</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Enter description"
                    value={subtextInput}
                    onChange={(e) => setSubtextInput(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">
                    <LinkIcon className="me-1" size={16} />
                    Banner Link URL
                  </label>
                  <input 
                    type="url" 
                    className="form-control"
                    placeholder="https://example.com"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Text Alignment</label>
                  <div className="btn-group w-100" role="group">
                    <button 
                      className={`btn ${alignInput === 'left' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => handleAlignmentChange('left')}
                    >
                      <AlignLeft size={18} className="me-1" /> Left
                    </button>
                    <button 
                      className={`btn ${alignInput === 'center' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => handleAlignmentChange('center')}
                    >
                      <AlignCenter size={18} className="me-1" /> Center
                    </button>
                    <button 
                      className={`btn ${alignInput === 'right' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => handleAlignmentChange('right')}
                    >
                      <AlignRight size={18} className="me-1" /> Right
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three Main Action Buttons */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-4">
                <h5 className="card-title fw-semibold mb-3 text-center">Banner Actions</h5>
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  {/* Button 1: Create Text Banner */}
                  <button 
                    className="btn btn-primary btn-lg px-4"
                    onClick={handleCreateTextBanner}
                  >
                    <CheckCircle size={20} className="me-2" />
                    1. Create Text Banner
                  </button>
                  
                  {/* Button 2: Image & Link Only */}
                  <button 
                    className="btn btn-success btn-lg px-4"
                    onClick={handleImageOnlyBanner}
                  >
                    <Image size={20} className="me-2" />
                    2. Image & Link Only
                  </button>
                  
                  {/* Button 3: Reset Banner */}
                  <button 
                    className="btn btn-danger btn-lg px-4"
                    onClick={handleResetBanner}
                  >
                    <Trash2 size={20} className="me-2" />
                    3. Reset Banner
                  </button>
                </div>
                
                <div className="alert alert-info mt-4 mb-0" role="alert">
                  <strong>✨ How to use:</strong>
                  <ul className="mb-0 mt-2">
                    <li><strong>Button 1:</strong> Creates a complete banner with your image, title, subtitle, link, and selected text alignment.</li>
                    <li><strong>Button 2:</strong> Creates an image-only banner (no text) with your image and link - perfect for visual banners.</li>
                    <li><strong>Button 3:</strong> Resets everything to default settings.</li>
                    <li><strong>Alignment buttons:</strong> Change text position (Left/Center/Right) in real-time.</li>
                    <li><strong>Click on the banner preview</strong> to open the link in a new tab.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Banner Status */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card shadow-sm border-0 rounded-4 bg-light">
              <div className="card-body p-3">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <div>
                    <small className="text-muted">Current Banner Status:</small>
                    <div className="mt-1">
                      {displayText ? (
                        <span className="badge bg-primary me-2">Text Banner Active</span>
                      ) : (
                        <span className="badge bg-success me-2">Image-Only Banner</span>
                      )}
                      {displayLink && <span className="badge bg-info me-2">Link: {displayLink.substring(0, 30)}...</span>}
                      <span className="badge bg-secondary">Alignment: {displayAlign}</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <Eye size={16} className="me-1" /> Scroll to Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .banner-preview {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .banner-preview:hover {
          transform: scale(1.01);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .btn {
          transition: all 0.2s ease;
        }
        .btn:hover {
          transform: translateY(-2px);
        }
        .card {
          transition: transform 0.2s ease;
        }
        .card:hover {
          transform: translateY(-4px);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .banner-preview h1, .banner-preview p {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BannerDoctor;