// require("dotenv").config();
// const {
//   GoogleGenAI,
//   createUserContent,
//   createPartFromUri,
// } = require("@google/genai");
// const chrono = require("chrono-node");

// // ---------------------------------------------------------
// // Helper: Clean Gemini JSON output
// // ---------------------------------------------------------
// function cleanJSON(text) {
//   return text
//     .replace(/```json/gi, "")
//     .replace(/```/g, "")
//     .trim();
// }

// // ---------------------------------------------------------
// // Normalize priority
// // ---------------------------------------------------------
// function normalizePriority(p) {
//   if (!p) return "Medium";
//   const s = String(p).toLowerCase();
//   if (s.includes("high") || s.includes("urgent") || s.includes("critical"))
//     return "High";
//   if (s.includes("low")) return "Low";
//   return "Medium";
// }

// // ---------------------------------------------------------
// // Detect morning / evening / night
// // ---------------------------------------------------------
// function detectTimeOfDay(text) {
//   const lower = text.toLowerCase();
//   if (/\bmorning\b/.test(lower)) return 9;
//   if (/\bnoon\b|\bmidday\b/.test(lower)) return 12;
//   if (/\bafternoon\b/.test(lower)) return 15;
//   if (/\bevening\b/.test(lower)) return 18;
//   if (/\bnight\b/.test(lower)) return 20;
//   return null;
// }

// // ---------------------------------------------------------
// // Resolve due date using chrono-node
// // ---------------------------------------------------------
// function resolveDueDateFromTranscript(transcript, refDate = new Date()) {
//   const results = chrono.parse(transcript, refDate);
//   if (!results.length) return "";

//   let chosen = null;

//   // pick a future date
//   for (const r of results) {
//     const d = r.start?.date();
//     if (!d) continue;
//     if (d >= refDate) {
//       chosen = r;
//       break;
//     }
//   }

//   // fallback: choose the first, but shift weekdays into the future
//   if (!chosen) {
//     chosen = results[0];
//     const txt = chosen.text?.toLowerCase() || "";
//     const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
//     if (weekdays.some((w) => txt.includes(w))) {
//       let d = chosen.start.date();
//       while (d < refDate) {
//         d = new Date(d.getTime() + 7 * 86400000);
//       }
//       chosen = {
//         text: chosen.text,
//         start: { date: () => d },
//       };
//     }
//   }

//   let due = chosen.start.date();

//   const tod = detectTimeOfDay(transcript);
//   if (tod !== null) {
//     due.setHours(tod, 0, 0, 0);
//   } else {
//     if (due.getHours() === 0 && /by|due|deadline/.test(transcript.toLowerCase())) {
//       due.setHours(18, 0, 0, 0);
//     }
//   }

//   // ensure future
//   if (due <= refDate) {
//     due = new Date(refDate.getTime() + 86400000);
//     const tod2 = detectTimeOfDay(transcript);
//     due.setHours(tod2 !== null ? tod2 : 18, 0, 0, 0);
//   }

//   return due.toISOString();
// }

// // ---------------------------------------------------------
// // STEP 1 — TRANSCRIBE AUDIO USING GEMINI
// // ---------------------------------------------------------
// async function transcribeAudio() {
//   const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_API_KEY,
//   });

//   const upload = await ai.files.upload({
//     file: "./voice1.mp3",
//     config: { mimeType: "audio/mpeg" },
//   });

//   console.log("Uploaded:", upload.uri);

//   const result = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: createUserContent([
//       createPartFromUri(upload.uri, upload.mimeType),
//       "Generate a clean transcript of this speech.",
//     ]),
//   });

//   return result.text.trim();
// }

// // ---------------------------------------------------------
// // STEP 2 — Parse transcript with Gemini, resolve due date locally
// // ---------------------------------------------------------
// async function parseWithGeminiAndResolveDate(transcript) {
//   const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_API_KEY,
//   });

//   const prompt = `
// You are an intelligent task parser. Extract structured details.

// TRANSCRIPT:
// "${transcript}"

// Return ONLY JSON:
// {
//   "title": string,
//   "priority": "High" | "Medium" | "Low" | "",
//   "dueDate": string,
//   "status": "To Do"
// }
// `;

//   const result = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: [{ role: "user", parts: [{ text: prompt }] }],
//   });

//   const cleaned = cleanJSON(result.text.trim());

//   let parsed = { title: transcript, priority: "Medium", dueDate: "", status: "To Do" };

//   try {
//     parsed = JSON.parse(cleaned);
//   } catch (e) {
//     console.log("LLM returned invalid JSON. Using fallback.");
//   }

//   parsed.priority = normalizePriority(parsed.priority);

//   const resolved = resolveDueDateFromTranscript(transcript);
//   parsed.dueDate = resolved || "";

//   return parsed;
// }

// // ---------------------------------------------------------
// // MAIN
// // ---------------------------------------------------------
// (async () => {
//   try {
//     console.log("Transcribing...");
//     const transcript = await transcribeAudio();

//     console.log("\n=== TRANSCRIPT ===");
//     console.log(transcript);

//     console.log("\nParsing...");
//     const parsed = await parseWithGeminiAndResolveDate(transcript);

//     console.log("\n=== PARSED OUTPUT ===");
//     console.log(parsed);
//   } catch (err) {
//     console.error("ERROR:", err);
//   }
// })();





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
