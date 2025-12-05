const fs = require("fs");
const path = require("path");
const multer = require("multer");
const {
  transcribeAudio,
  parseTranscript,
} = require("../utils/voiceParser");

const upload = multer({ storage: multer.memoryStorage() });

exports.handleVoice = [
  upload.single("audio"), // middleware

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file uploaded" });
      }

      // Save temp file
      const tempPath = path.join(process.cwd(), "tmp_audio_" + Date.now() + ".webm");
      fs.writeFileSync(tempPath, req.file.buffer);

      // 1. Transcribe
      const transcript = await transcribeAudio(tempPath, req.file.mimetype);

      // 2. Parse structured fields
      const parsed = await parseTranscript(transcript);

      fs.unlinkSync(tempPath);

      res.json({ transcript, parsed });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Voice parsing failed", details: err.message });
    }
  },
];
