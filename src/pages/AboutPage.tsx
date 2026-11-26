import React, { useEffect } from 'react';
import { AboutSection } from '../components/AboutSection';
import { WhyChoose } from '../components/WhyChoose';
import { updateSEO } from '../utils/seo';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'About Sachini Fernando & Studio | 2R Creations',
      description: 'Meet Sachini Fernando, founder of 2R Creations. Dedicated to heirloom wedding album design and natural photo retouching with 2–3 day turnaround.',
      canonicalPath: '/about',
      ogImage: '/assets/images/2R-Creations-Designer-Portrait-Editorial.jpg',
      ogImageAlt: 'Sachini Fernando — Lead Wedding Album Designer & Founder of 2R Creations',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' }
      ],
      structuredData: {
        '@type': 'AboutPage',
        name: 'About 2R Creations',
        url: 'https://2rcreations.com/about',
        mainEntity: {
          '@id': 'https://2rcreations.com/#founder'
        }
      }
    });
  }, []);

  return (
    <div className="pt-20">
      <AboutSection headingAs="h1" />
      <WhyChoose />
    </div>
  );
};
