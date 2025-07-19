const express = require('express');
const multer = require('multer');
const { compressVideo } = require('./compress');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use('/output', express.static(path.join(__dirname, 'output')));

app.post('/compress', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const outputName = `${uuidv4()}.mp4`;
    const outputPath = path.join(__dirname, 'output', outputName);

    await compressVideo(req.file.path, outputPath);

    // Remove o arquivo original da pasta temporária
    fs.unlinkSync(req.file.path);

    const fullUrl = `${req.protocol}://${req.get('host')}/output/${outputName}`;
    return res.json({ status: 'success', compressedUrl: fullUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao comprimir o vídeo.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
