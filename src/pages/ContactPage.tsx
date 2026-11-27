import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ContactSection } from '../components/ContactSection';
import { updateSEO } from '../utils/seo';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialProject = searchParams.get('project') || undefined;

  useEffect(() => {
    updateSEO({
      title: 'Contact Studio & Start a Project | 2R CREATIONS',
      description: 'Submit your wedding album scope or project inquiry to 2R Creations. Receive a custom quote and turnaround timeline.',
      canonicalPath: '/contact'
    });
  }, []);

  return (
    <div className="pt-20">
      <ContactSection initialProjectType={initialProject} />
    </div>
  );
};
