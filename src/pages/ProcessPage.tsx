import React, { useEffect } from 'react';
import { ProcessSection } from '../components/ProcessSection';
import { updateSEO } from '../utils/seo';

export const ProcessPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Design Process & Proofing Workflow | 2R CREATIONS',
      description: 'Understand our seamless 4-step album workflow, from gallery ingestion and proofing to lab-ready print export.',
      canonicalPath: '/process'
    });
  }, []);

  return (
    <div className="pt-20">
      <ProcessSection />
    </div>
  );
};
