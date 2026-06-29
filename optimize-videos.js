import ffmpeg from 'ffmpeg-static';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');

const videosToOptimize = [
  {
    input: 'kisavita_demo.mp4',
    outputMp4: 'kisavita_demo_optimized.mp4',
    outputWebm: 'kisavita_demo_optimized.webm'
  },
  {
    input: 'nexus_life_os_demo.mp4',
    outputMp4: 'nexus_life_os_demo_optimized.mp4',
    outputWebm: 'nexus_life_os_demo_optimized.webm'
  }
];

function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${cmd}`);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function startOptimization() {
  console.log(`Found ffmpeg binary at: ${ffmpeg}`);

  for (const video of videosToOptimize) {
    const inputPath = path.join(publicDir, video.input);
    const tempInputPath = path.join(publicDir, `temp_${video.input}`);

    // If input exists
    if (fs.existsSync(inputPath)) {
      console.log(`\n--- Optimizing ${video.input} ---`);
      
      // Move original input file to temp path to free the filename
      fs.renameSync(inputPath, tempInputPath);

      const finalMp4Path = path.join(publicDir, video.input); // overwrite original name
      const finalWebmPath = path.join(publicDir, video.input.replace('.mp4', '.webm'));

      try {
        // 1. Compress to MP4 (libx264, scale to 480p height, strip audio)
        const mp4Cmd = `"${ffmpeg}" -i "${tempInputPath}" -vcodec libx264 -crf 26 -an -vf "scale=-2:480" -preset fast -y "${finalMp4Path}"`;
        await runCommand(mp4Cmd);
        console.log(`Optimized MP4 generated: ${finalMp4Path}`);

        // 2. Compress to WebM (libvpx-vp9, scale to 480p height, strip audio)
        const webmCmd = `"${ffmpeg}" -i "${tempInputPath}" -vcodec libvpx-vp9 -b:v 400k -crf 33 -an -vf "scale=-2:480" -preset fast -y "${finalWebmPath}"`;
        await runCommand(webmCmd);
        console.log(`Optimized WebM generated: ${finalWebmPath}`);

        // Clean up temp original heavy file
        fs.unlinkSync(tempInputPath);
        console.log(`Cleaned up temporary original file.`);

      } catch (err) {
        console.error(`Error processing ${video.input}:`, err);
        // Restore backup if it failed
        if (fs.existsSync(tempInputPath) && !fs.existsSync(inputPath)) {
          fs.renameSync(tempInputPath, inputPath);
        }
      }
    } else {
      console.log(`Input video ${video.input} not found in public directory.`);
    }
  }
  console.log('\nVideo optimization complete!');
}

startOptimization();
