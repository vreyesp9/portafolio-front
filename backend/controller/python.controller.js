const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const runPythonScript = (req, res) => {
  try {
    // Directorio donde se guardan las gráficas
    const outputDir = path.join(__dirname, '../static/plots');
    const images = [
      'afectados_hist.png',
      'tipo_siniestro_dist.png',
      'perdidas_por_turno.png',
      'correlation_matrix.png',
      'tipo_siniestro_pred.png',
      'confusion_matrix.png',
    ];

    // Verificar si las imágenes ya existen
    const existingImages = images
      .map((file) => path.join(outputDir, file))
      .filter((filePath) => fs.existsSync(filePath))
      .map((filePath) => `/static/plots/${path.basename(filePath)}`);

    if (existingImages.length === images.length) {
      // Si todas las imágenes ya están generadas, devuélvelas
      return res.status(200).json({ images: existingImages });
    }

    // Ejecutar el script Python si no están todas las imágenes
    const scriptPath = path.join(__dirname, '../scripts/RescateSoft.py');
    const pythonProcess = spawn('python', [scriptPath]);

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Error al ejecutar el script de Python' });
      }

      // Una vez ejecutado el script, devolver las imágenes generadas
      const generatedImages = images.map((file) => `/static/plots/${file}`);
      res.status(200).json({ images: generatedImages });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { runPythonScript };
