// Image optimization utilities
export const imageFormats = {
  webp: 'image/webp',
  avif: 'image/avif',
  jpeg: 'image/jpeg',
  png: 'image/png'
};

export const supportedFormats = {
  webp: () => {
    try {
      return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } catch {
      return false;
    }
  },
  avif: () => {
    try {
      return document.createElement('canvas').toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch {
      return false;
    }
  }
};

// Generate responsive image sources
export const generateImageSources = (basePath: string, alt: string, sizes?: string) => {
  const supports = {
    webp: supportedFormats.webp(),
    avif: supportedFormats.avif()
  };

  const sources = [];
  
  if (supports.avif) {
    sources.push({
      srcSet: `${basePath}.avif`,
      type: imageFormats.avif
    });
  }
  
  if (supports.webp) {
    sources.push({
      srcSet: `${basePath}.webp`,
      type: imageFormats.webp
    });
  }

  return {
    sources,
    fallback: {
      src: `${basePath}.jpg`,
      alt,
      sizes: sizes || '100vw'
    }
  };
};

// Intersection Observer for lazy loading
export const createImageObserver = (callback: (entry: IntersectionObserverEntry) => void) => {
  if (!('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback);
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1
    }
  );
};

// Preload critical images
export const preloadImage = (src: string, crossOrigin?: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  if (crossOrigin) {
    link.crossOrigin = crossOrigin;
  }
  document.head.appendChild(link);
};

// Progressive image loading component props
export interface ProgressiveImageProps {
  src: string;
  placeholderSrc?: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
}