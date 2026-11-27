import React, { useEffect } from 'react';
import { AboutSection } from '../components/AboutSection';
import { WhyChoose } from '../components/WhyChoose';
import { updateSEO } from '../utils/seo';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'About 2R Creations | Professional Wedding Album Designer',
      description: 'Learn about 2R Creations, dedicated to crafting heirloom wedding albums with intentional pacing and cultural reverence.',
      canonicalPath: '/about'
    });
  }, []);

  return (
    <div className="pt-20">
      <AboutSection />
      <WhyChoose />
    </div>
  );
};
