import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ContactSection } from '../components/ContactSection';
import { updateSEO } from '../utils/seo';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialProject = searchParams.get('project') || undefined;

  useEffect(() => {
    updateSEO({
      title: 'Start Your Wedding Album Project | 2R Creations',
      description: 'Contact 2R Creations for a custom wedding album design or retouching quote, free sample spread, and 2–3 day turnaround schedule.',
      canonicalPath: '/contact',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' }
      ],
      structuredData: {
        '@type': 'ContactPage',
        name: 'Contact 2R Creations Studio',
        url: 'https://2rcreations.com/contact',
        mainEntity: {
          '@id': 'https://2rcreations.com/#organization'
        }
      }
    });
  }, []);

  return (
    <div className="pt-20">
      <ContactSection initialProjectType={initialProject} headingAs="h1" />
    </div>
  );
};
