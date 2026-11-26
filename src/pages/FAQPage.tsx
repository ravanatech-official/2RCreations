import React, { useEffect } from 'react';
import { FAQSection, STUDIO_FAQS } from '../components/FAQSection';
import { updateSEO } from '../utils/seo';

export const FAQPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Wedding Album Design FAQ | 2R Creations',
      description: 'Answers on wedding album turnaround times, revisions, international photographer collaboration, wedding styles, and image curation.',
      canonicalPath: '/faq',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'FAQ', path: '/faq' }
      ],
      structuredData: {
        '@type': 'FAQPage',
        mainEntity: STUDIO_FAQS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      }
    });
  }, []);

  return (
    <div className="pt-20">
      <FAQSection headingAs="h1" />
    </div>
  );
};
