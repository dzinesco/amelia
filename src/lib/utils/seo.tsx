import React from 'react';
import { APP_CONFIG } from '../config/constants';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = APP_CONFIG.name,
  description = APP_CONFIG.description,
  image = '/og-image.png',
  url = 'https://amelia-ai.netlify.app',
}) => {
  const fullTitle = title === APP_CONFIG.name ? title : `${title} | ${APP_CONFIG.name}`;

  React.useEffect(() => {
    // Update meta tags
    document.title = fullTitle;
    updateMetaTag('description', description);
    
    // Open Graph
    updateMetaTag('og:title', fullTitle);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image);
    updateMetaTag('og:url', url);
    updateMetaTag('og:type', 'website');
    
    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Additional
    updateMetaTag('application-name', APP_CONFIG.name);
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    updateMetaTag('apple-mobile-web-app-title', APP_CONFIG.name);
    updateMetaTag('format-detection', 'telephone=no');
    updateMetaTag('mobile-web-app-capable', 'yes');
    updateMetaTag('theme-color', '#06b6d4');
  }, [fullTitle, description, image, url]);

  return null;
};

function updateMetaTag(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    if (name.startsWith('og:')) {
      element.setAttribute('property', name);
    } else {
      element.setAttribute('name', name);
    }
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}