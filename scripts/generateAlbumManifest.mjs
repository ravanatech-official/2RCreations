import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const albumsDir = path.join(rootDir, 'public', 'albums');
const outputPath = path.join(rootDir, 'src', 'data', 'albumManifest.json');

const albumFolders = [
  '01-traditional-sri-lankan',
  '02-modern-editorial',
  '03-luxury-estate',
  '04-indian-heritage',
  '05-western-destination',
  '06-preshoot-engagement'
];

const manifest = {};

if (fs.existsSync(albumsDir)) {
  for (const folder of albumFolders) {
    const folderPath = path.join(albumsDir, folder);
    if (!fs.existsSync(folderPath)) {
      manifest[folder] = {
        hasThumbnail: false,
        thumbnailPath: '',
        availablePhotos: [],
        availablePhotoCount: 0
      };
      continue;
    }

    const files = fs.readdirSync(folderPath);
    let thumbnailPath = '';
    const thumbnailFile = files.find(f => /^thumbnail\.(jpg|jpeg|png|webp)$/i.test(f));
    if (thumbnailFile) {
      thumbnailPath = `/albums/${folder}/${thumbnailFile}`;
    }

    let coverPath = '';
    const coverFile = files.find(f => /^cover\.(jpg|jpeg|png|webp)$/i.test(f));
    if (coverFile) {
      coverPath = `/albums/${folder}/${coverFile}`;
    }

    let page01Path = '';
    const page01File = files.find(f => /^(page-01|page-1)\.(jpg|jpeg|png|webp)$/i.test(f));
    if (page01File) {
      page01Path = `/albums/${folder}/${page01File}`;
    }

    let pageLastPath = '';
    const pageLastFile = files.find(f => /^(page-last|last-page)\.(jpg|jpeg|png|webp)$/i.test(f));
    if (pageLastFile) {
      pageLastPath = `/albums/${folder}/${pageLastFile}`;
    }

    const spreadFiles = files.filter(f => /^spread-\d{2}\.(jpg|jpeg|png|webp)$/i.test(f));
    spreadFiles.sort();

    const photoFiles = files.filter(f => /^photo-\d{2}\.(jpg|jpeg|png|webp)$/i.test(f));
    photoFiles.sort();

    manifest[folder] = {
      hasThumbnail: Boolean(thumbnailPath),
      thumbnailPath,
      hasCover: Boolean(coverPath),
      coverPath,
      hasPage01: Boolean(page01Path),
      page01Path,
      hasPageLast: Boolean(pageLastPath),
      pageLastPath,
      spreads: spreadFiles.map(f => `/albums/${folder}/${f}`),
      spreadCount: spreadFiles.length,
      availablePhotos: photoFiles.map(f => `/albums/${folder}/${f}`),
      availablePhotoCount: photoFiles.length
    };
  }
}

// Ensure parent dir exists
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf-8');
console.log(`[Album Manifest] Generated successfully at: ${outputPath}`);
