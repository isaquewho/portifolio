import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function optimizeProjectMockups() {
  try {
    console.log('Optimizing project mockups...');
    
    // Nexus Life OS
    await sharp(path.join(__dirname, 'public', 'nexus_life_os_mockup.png'))
      .resize({ width: 960 })
      .jpeg({ quality: 80, progressive: true })
      .toFile(path.join(__dirname, 'public', 'nexus_life_os_mockup.jpg'));
      
    // Casa de Kisavita
    await sharp(path.join(__dirname, 'public', 'kisavita_mockup.png'))
      .resize({ width: 960 })
      .jpeg({ quality: 80, progressive: true })
      .toFile(path.join(__dirname, 'public', 'kisavita_mockup.jpg'));

    console.log('Mockups optimized successfully!');
  } catch (error) {
    console.error('Error optimizing mockups:', error);
  }
}

optimizeProjectMockups();
