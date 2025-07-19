const { exec } = require('child_process');

function compressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i "${inputPath}" -vcodec libx264 -acodec aac -preset ultrafast -crf 28 -vf "scale=-2:720" -movflags +faststart "${outputPath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve(stdout);
    });
  });
}

module.exports = { compressVideo };
