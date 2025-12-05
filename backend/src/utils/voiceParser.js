// backend/src/utils/voiceParser.js
require("dotenv").config();
const { GoogleGenAI, createUserContent, createPartFromUri } = require("@google/genai");
const chrono = require("chrono-node");

// ---------- Cleanup JSON ----------
function cleanJSON(text) {
  return text.replace(/```json/gi, "").replace(/```/g, "").trim();
}

// ---------- Priority Normalizer ----------
function normalizePriority(p) {
  if (!p) return "Medium";
  const s = String(p).toLowerCase();
  if (s.includes("urgent") || s.includes("critical") || s.includes("high")) return "High";
  if (s.includes("low")) return "Low";
  return "Medium";
}

// ---------- Time-of-day detector ----------
function detectTimeOfDay(text) {
  const t = text.toLowerCase();
  if (t.includes("morning")) return 9;
  if (t.includes("noon") || t.includes("midday")) return 12;
  if (t.includes("afternoon")) return 15;
  if (t.includes("evening")) return 18;
  if (t.includes("night")) return 20;
  return null;
}

// ---------- Date Resolver ----------
function resolveDueDateFromTranscript(transcript, refDate = new Date()) {
  const results = chrono.parse(transcript, refDate);
  if (!results.length) return "";

  let chosen = results.find(r => r.start && r.start.date() >= refDate) || results[0];
  let date = chosen.start.date();

  // Future-shift weekdays if parsed in past
  if (date < refDate && /monday|tuesday|wednesday|thursday|friday|saturday|sunday/i.test(chosen.text)) {
    while (date < refDate) {
      date = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
  }

  // Time-of-day override
  const tod = detectTimeOfDay(transcript);
  if (tod !== null) date.setHours(tod, 0, 0, 0);
  else if (date.getHours() === 0 && /\bby\b|\bdue\b|\bevening\b/i.test(transcript)) {
    date.setHours(18, 0, 0, 0);
  }

  // Final safety
  if (date < refDate) {
    date = new Date(refDate.getTime() + 24 * 60 * 60 * 1000);
    date.setHours(18, 0, 0, 0);
  }

  return date.toISOString();
}

// ---------- STEP 1: Transcription ----------
async function transcribeAudio(filePath, mimeType = "audio/webm") {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

  const uploaded = await ai.files.upload({
    file: filePath,
    config: { mimeType },
  });

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: createUserContent([
      createPartFromUri(uploaded.uri, uploaded.mimeType),
      "Provide a clean speech transcript.",
    ]),
  });

  return result.text.trim();
}

// ---------- STEP 2: Parse transcript ----------
async function parseTranscript(transcript) {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });


const prompt = `
You are a task extraction system for a voice-enabled task manager.
Given a natural language instruction, extract structured task fields.

Follow these rules VERY STRICTLY:

1. **Title**
   - Extract the main actionable task.
   - Remove filler prefixes such as:
     "create a task", "add a task", "please", "remind me to", "can you".
   - The title must be a short imperative phrase:
     Example:
       "Create a high priority task to review the PR" → "Review the PR"

2. **Priority**
   Detect priority using keywords:
   - High priority → High
   - urgent → High
   - critical → High
   - medium priority → Medium
   - low priority → Low
   If not mentioned → "Medium"

3. **Status**
   - Default to: "To Do"
   - If user explicitly says:
       "in progress", "I'm working on", "currently doing" → "In Progress"
       "completed", "finished", "done" → "Done"

4. **Due Date**
   - Extract both RELATIVE and ABSOLUTE dates.
   - Examples:
       "tomorrow evening"
       "next Monday"
       "in 3 days"
       "on 15th January"
       "Jan 20"
       "due by Friday"
       "before Friday"
       "sometime on Monday morning"
   - Do NOT guess. If unclear → return empty string.

   Backend will convert natural language → ISO later,
   so here return the date phrase AS IS (e.g., "tomorrow evening").

5. **Output Format**
   Return ONLY valid JSON.
   Do NOT add explanations.
   Do NOT wrap with backticks.

JSON schema to follow exactly:

{
  "title": string,
  "priority": "High" | "Medium" | "Low",
  "dueDate": string,   // natural language date phrase or ""
  "status": "To Do" | "In Progress" | "Done"
}

TRANSCRIPT:
"${transcript}"
`;


  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const raw = cleanJSON(result.text.trim());

  let parsed = { title: "", priority: "Medium", dueDate: "", status: "To Do" };
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed.title = transcript;
  }

  parsed.priority = normalizePriority(parsed.priority);
  parsed.dueDate = resolveDueDateFromTranscript(transcript);

  return parsed;
}

module.exports = {
  transcribeAudio,
  parseTranscript,
  resolveDueDateFromTranscript,
};
