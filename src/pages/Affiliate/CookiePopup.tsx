import React, { useEffect, useState } from 'react';
import { Cookie, X, Shield, Check } from 'lucide-react';

const CookiePopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = document.cookie.split('; ').find(row => row.startsWith('myWebsiteCookieConsent='));
    if (!consent) {
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const handleAccept = () => {
    document.cookie = "myWebsiteCookieConsent=accepted; max-age=31536000; path=/";
    setIsVisible(false);
  };

  const handleDecline = () => {
    document.cookie = "myWebsiteCookieConsent=declined; max-age=31536000; path=/";
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-50
      transform transition-all duration-500 ease-in-out
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
    `}>
      {/* Main container */}
      <div className="relative bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl">
        {/* Gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Icon and Text Section */}
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Cookie className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  Cookies Consent
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.
                  {/* <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline ml-1 font-medium">
                    Learn more
                  </a> */}
                </p>
                
                {/* Privacy badge - visible on tablet/desktop */}
                <div className="hidden md:flex items-center mt-2 space-x-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span>Essential cookies</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Analytics cookies</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-2 flex-shrink-0">
              {/* <button
                onClick={handleDecline}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 order-2 sm:order-1"
              >
                Decline
              </button> */}
              
              <button
                onClick={handleAccept}
                className="px-8 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] order-1 sm:order-2"
              >
                Accept
              </button>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2  p-2 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile privacy badges */}
          <div className="flex md:hidden items-center justify-center mt-3 space-x-4">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Shield className="h-3 w-3 text-green-500" />
              <span>Essential cookies</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Check className="h-3 w-3 text-green-500" />
              <span>Analytics cookies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePopup;