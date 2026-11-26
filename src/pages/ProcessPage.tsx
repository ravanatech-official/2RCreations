import React, { useEffect } from 'react';
import { ProcessSection } from '../components/ProcessSection';
import { updateSEO } from '../utils/seo';

export const ProcessPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: '4-Step Album Design Workflow | 2R Creations',
      description: 'Our streamlined 4-step wedding album workflow for photographers: photo upload, bespoke spread design, online proofing, and lab-ready delivery.',
      canonicalPath: '/process',
      breadcrumbs: [
        { name: 'Home', path: '/' },
        { name: 'Process', path: '/process' }
      ],
      structuredData: {
        '@type': 'HowTo',
        name: 'How 2R Creations Designs Your Wedding Album',
        description: 'A seamless 4-step outsourcing workflow for wedding photographers and couples worldwide.',
        totalTime: 'P3D',
        step: [
          { '@type': 'HowToStep', position: 1, name: 'Send Your Photos', text: 'Provide your selected wedding photographs and print lab specifications.' },
          { '@type': 'HowToStep', position: 2, name: 'Design', text: 'We craft bespoke spreads balanced around story pacing, style, and visual direction.' },
          { '@type': 'HowToStep', position: 3, name: 'Review', text: 'Review the digital proofing spreads online and share requested adjustments.' },
          { '@type': 'HowToStep', position: 4, name: 'Final Delivery', text: 'Print-ready high-resolution artwork is exported strictly to your lab dimensions.' }
        ]
      }
    });
  }, []);

  return (
    <div className="pt-20">
      <ProcessSection headingAs="h1" />
    </div>
  );
};
