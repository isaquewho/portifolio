import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { put } from '@vercel/blob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple .env.local parser to avoid extra dotenv dependency
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove surrounding quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("BLOB_READ_WRITE_TOKEN not found in .env.local!");
  process.exit(1);
}

const videosToUpload = [
  { name: 'kisavita_demo.mp4', path: path.join(__dirname, 'public', 'kisavita_demo.mp4') },
  { name: 'kisavita_demo.webm', path: path.join(__dirname, 'public', 'kisavita_demo.webm') },
  { name: 'nexus_life_os_demo.mp4', path: path.join(__dirname, 'public', 'nexus_life_os_demo.mp4') },
  { name: 'nexus_life_os_demo.webm', path: path.join(__dirname, 'public', 'nexus_life_os_demo.webm') }
];

async function uploadVideos() {
  console.log("Starting upload to Vercel Blob...");
  const results = {};
  for (const video of videosToUpload) {
    if (fs.existsSync(video.path)) {
      console.log(`Uploading ${video.name}...`);
      const fileBuffer = fs.readFileSync(video.path);
      try {
        const blob = await put(video.name, fileBuffer, {
          access: 'public',
          token: token
        });
        console.log(`Uploaded ${video.name} successfully! URL: ${blob.url}`);
        results[video.name] = blob.url;
      } catch (err) {
        console.error(`Failed to upload ${video.name}:`, err);
      }
    } else {
      console.warn(`File not found: ${video.path}`);
    }
  }
  console.log("\n--- Upload Results (JSON) ---");
  console.log(JSON.stringify(results, null, 2));
}

uploadVideos();
