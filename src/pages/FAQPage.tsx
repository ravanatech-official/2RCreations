import React, { useEffect } from 'react';
import { FAQSection } from '../components/FAQSection';
import { updateSEO } from '../utils/seo';

export const FAQPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Frequently Asked Questions | 2R CREATIONS',
      description: 'Answers regarding lab sizing, turnaround timelines, revisions, client image protection, and album design proofing.',
      canonicalPath: '/faq'
    });
  }, []);

  return (
    <div className="pt-20">
      <FAQSection />
    </div>
  );
};
