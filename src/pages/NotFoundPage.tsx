import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { updateSEO } from '../utils/seo';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    updateSEO({
      title: 'Page Not Found | 2R CREATIONS',
      description: 'The requested page could not be found.',
      canonicalPath: '/404'
    });
  }, []);

  return (
    <div className="pt-36 pb-28 min-h-[70vh] flex items-center justify-center bg-[#FBF9F5] px-6 text-center">
      <div className="max-w-md mx-auto">
        <span className="text-[11px] font-mono tracking-[0.25em] text-[#C5A880] uppercase block mb-3 font-semibold">
          404 &bull; PAGE NOT FOUND
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#111111] mb-4">
          The requested page does not exist.
        </h1>
        <p className="text-sm text-[#242424]/70 font-light leading-relaxed mb-8">
          The link may have moved or the URL was entered incorrectly. You can explore our signature album concepts or return to the studio homepage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FBF9F5] bg-[#111111] hover:bg-[#C5A880] hover:text-[#111111] rounded-xs transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Studio Homepage</span>
          </Link>

          <Link
            to="/portfolio"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#111111] bg-transparent border border-[#242424]/20 hover:border-[#111111] rounded-xs transition-colors"
          >
            <span>View Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
