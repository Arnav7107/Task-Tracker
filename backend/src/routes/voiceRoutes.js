// const express = require("express");
// const multer = require("multer");
// const {
//   handleVoiceUploadAndParse
// } = require("../controllers/voiceController");

// const router = express.Router();
// const upload = multer(); // in-memory upload

// // POST /api/voice
// router.post("/", upload.single("audio"), handleVoiceUploadAndParse);

// module.exports = router;




// const express = require("express");
// const multer = require("multer");
// const { transcribeAudio, parseTranscript } = require("../utils/voiceParser");

// const router = express.Router();
// const upload = multer(); // memory storage

// router.post("/", upload.single("audio"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No audio file" });

//     const transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);
//     const parsed = await parseTranscript(transcript);

//     res.json({ transcript, parsed });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;






const express = require("express");
const { handleVoice } = require("../controllers/voiceController");

const router = express.Router();

router.post("/", handleVoice);

module.exports = router;
