
const express = require("express");
const { handleVoice } = require("../controllers/voiceController");

const router = express.Router();

router.post("/", handleVoice);

module.exports = router;
