import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'public', 'IMG_20240510_115851.jpg');
const outputPath = path.join(__dirname, 'public', 'isaque_hero_optimized.jpg');

async function optimizeHeroImage() {
  try {
    console.log('Optimizing hero image...');
    await sharp(inputPath)
      .resize({ width: 640 }) // Retina resolution (displayed at max 320px)
      .jpeg({ quality: 80, progressive: true })
      .toFile(outputPath);
    console.log('Hero image optimized successfully and written to public/isaque_hero_optimized.jpg!');
  } catch (error) {
    console.error('Error optimizing image:', error);
  }
}

optimizeHeroImage();
