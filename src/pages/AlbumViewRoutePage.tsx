import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAlbumBySlug, ALBUMS } from '../data/albums';
import { AlbumViewer } from '../components/AlbumViewer';
import { updateSEO } from '../utils/seo';

export const AlbumViewRoutePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const album = slug ? getAlbumBySlug(slug) : undefined;

  useEffect(() => {
    if (album) {
      updateSEO({
        title: `Interactive Album Viewer: ${album.title} | 2R CREATIONS`,
        description: `Explore the full ${album.totalSpreads}-spread layout of the ${album.title} signature study with editorial cadence and page-turn pacing.`,
        canonicalPath: `/portfolio/${album.slug}/view`,
        ogImage: album.coverImage
      });
    }
  }, [album]);

  if (!album) {
    return (
      <div className="pt-36 pb-24 text-center bg-[#FBF9F5] min-h-[60vh] flex flex-col items-center justify-center px-6">
        <h1 className="font-serif text-3xl font-medium text-[#111111] mb-3">Album Not Found</h1>
        <p className="text-sm text-[#242424]/70 mb-6">The requested album could not be loaded into the viewer.</p>
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#111111] bg-[#C5A880] rounded-xs"
        >
          <span>Return to Portfolio</span>
        </Link>
      </div>
    );
  }

  const otherAlbums = ALBUMS.filter(a => a.id !== album.id);

  return (
    <AlbumViewer
      album={album}
      initialSpreadNumber={1}
      onClose={() => navigate(`/portfolio/${album.slug}`)}
      onStartProject={() => {
        navigate(`/contact?project=${encodeURIComponent(`Wedding Album (${album.title})`)}`);
      }}
      onOpenDifferentAlbum={(id) => {
        const next = ALBUMS.find(a => a.id === id);
        if (next) {
          navigate(`/portfolio/${next.slug}/view`);
        }
      }}
      otherAlbums={otherAlbums}
    />
  );
};
