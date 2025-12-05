import { useState, useRef } from "react";
import { localToServerISO } from "../../utils/dateUtils";
import { createTask } from "../../api/tasksApi";

// Convert ISO → "YYYY-MM-DDTHH:mm"
function isoToLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function CreateTaskModal({
  createForm,
  setCreateForm,
  setShowCreateModal,
  reload,
}) {
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [parsedResult, setParsedResult] = useState(null); // 🔥 store parsed JSON
  const [isParsing, setIsParsing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const resetForm = () => {
  setCreateForm({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
  });
  setVoiceText("");
  setAudioBlob(null);
  setParsedResult(null);
  setIsRecording(false);
};


  // -------------------------------------------------------------
  // 🎤 START RECORDING
  // -------------------------------------------------------------
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

      recorder.start();
      setIsRecording(true);
      setVoiceText("🎙️ Listening...");
      setParsedResult(null); // clear old parsed result
    } catch (err) {
      alert("Microphone permission denied.");
    }
  };

  // -------------------------------------------------------------
  // ⏹ STOP + PARSE IN ONE STEP
  // -------------------------------------------------------------
  const stopAndParse = () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);

      setVoiceText("Processing audio...");
      await sendToBackend(blob);
    };

    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const checkNow = () => {
    const tempData = {};
    tempData.title = "Send the project proposal to the clients"
    tempData.priority = "High"
    tempData.status = "In Progress"
    tempData.dueDate = "2024-12-01T15:00"

    setParsedResult(tempData);
    setVoiceText("Sample parsed data ready. Click 'Fill Details From Voice' to auto-fill the form.");
    setIsRecording(false);
  }
  // -------------------------------------------------------------
  // 🔍 SEND AUDIO → BACKEND → PARSE
  // -------------------------------------------------------------
  const sendToBackend = async (blob) => {
    setIsParsing(true);

    const formData = new FormData();
    formData.append("audio", blob, "voice.webm");

    try {
      const res = await fetch("http://localhost:8000/api/voice", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("PARSE RESPONSE:", data);

      setVoiceText(data.transcript || "");
      setParsedResult(data.parsed || null); // store parsed output
    } catch (err) {
      alert("Voice parsing failed.");
    }

    setIsParsing(false);
  };

  // -------------------------------------------------------------
  // 📄 APPLY PARSED RESULT INTO THE FORM
  // -------------------------------------------------------------


//   const applyParsedResult = () => {
//   if (!parsedResult) return;

//   const { title, priority, status, dueDate } = parsedResult;

//   // Normalize fields
//   const normalizedPriority = priority?.toLowerCase() || "medium";

//   const normalizedStatus = status
//     ?.toLowerCase()
//     .replace(" ", "-") || "todo";

//   const normalizedDueDate = dueDate ? isoToLocalInput(dueDate) : "";

//   setCreateForm(() => ({
//      // KEEP previous description + values
//     title: title,
//     priority: normalizedPriority,
//     status: normalizedStatus,
//     dueDate: normalizedDueDate,
//   }));
// };



const applyParsedResult = () => {
  if (!parsedResult) return;

  const { title, priority, status, dueDate } = parsedResult;

  const normalizedPriority = priority?.toLowerCase() || "medium";

  let normalizedStatus =
    status?.toLowerCase().replace(" ", "-") || "todo";

  // LLM often gives "To Do" -> "to-do" (invalid). Fix it.
  if (normalizedStatus === "to-do") {
    normalizedStatus = "todo";
  }

  const normalizedDueDate = dueDate ? isoToLocalInput(dueDate) : "";

  setCreateForm((prev) => ({
    ...prev,  
    title: title || prev.title,
    priority: normalizedPriority,
    status: normalizedStatus,
    dueDate: normalizedDueDate,
  }));
};



  // -------------------------------------------------------------
  // CREATE TASK
  // -------------------------------------------------------------
  const submit = async () => {
    if (!createForm.title.trim()) return alert("Title required");

    const payload = {
      ...createForm,
      dueDate: createForm.dueDate ? localToServerISO(createForm.dueDate) : null,
    };

    await createTask(payload);
    reload();
    resetForm();
    setShowCreateModal(false);
  };

    return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Create Task</h2>

        {/* Toggle Voice Input */}
        <button
          className="w-full mb-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-800 text-sm"
          onClick={() => setShowVoiceInput(!showVoiceInput)}
        >
          🎤 {showVoiceInput ? "Hide Voice Input" : "Use Voice Input"}
        </button>

        {/* Voice Input UI */}
        {showVoiceInput && (
          <div className="mb-6 p-3 bg-neutral-800 rounded-lg border border-neutral-700">
            <p className="text-sm text-gray-400 mb-2">Speak your task:</p>

            <textarea
              className="w-full p-2 bg-neutral-900 rounded border border-neutral-700 text-sm"
              rows={3}
              value={voiceText}
              readOnly
            />

            <div className="flex gap-3 mt-3">
              {!isRecording ? (
                <button
                  className="px-3 py-1.5 bg-green-600 rounded hover:bg-green-700 text-sm"
                  onClick={startRecording}
                >
                  🎙️ Start Recording
                </button>
              ) : (
                <button
                  className="px-3 py-1.5 bg-red-600 rounded hover:bg-red-700 text-sm"
                  onClick={stopAndParse}
                  // onClick={checkNow}
                >
                  ⏹ Stop & Parse
                </button>
              )}
            </div>

            {/* Show Auto-fill button ONLY when parsed result exists */}
            {parsedResult && (
              <button
                onClick={applyParsedResult}
                className="w-full mt-3 py-2 bg-amber-600 rounded hover:bg-amber-700 text-sm"
              >
                📄 Fill Details From Voice
              </button>
            )}
          </div>
        )}

        {/* --- OR DIVIDER --- */}
        <div className="relative my-6">
          <div className="border-t border-dashed border-neutral-600"></div>
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-neutral-900 px-3 text-neutral-400 text-sm">
            OR
          </span>
        </div>

        {/* --- MANUAL FORM FIELDS --- */}

        <label className="block text-sm mt-2">Title</label>
        <input
          className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
          value={createForm.title}
          onChange={(e) => setCreateForm((s) => ({ ...s, title: e.target.value }))}
        />

        <label className="block text-sm mt-4">Description</label>
        <textarea
          className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
          rows={3}
          value={createForm.description}
          onChange={(e) =>
            setCreateForm((s) => ({ ...s, description: e.target.value }))
          }
        />

        {/* Priority + Status */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm">Priority</label>
            <select
              className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
              value={createForm.priority}
              onChange={(e) =>
                setCreateForm((s) => ({ ...s, priority: e.target.value }))
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Status</label>
            <select
              className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
              value={createForm.status}
              onChange={(e) =>
                setCreateForm((s) => ({ ...s, status: e.target.value }))
              }
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <label className="block text-sm mt-4">Due Date</label>
        <input
          type="datetime-local"
          className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
          value={createForm.dueDate}
          onChange={(e) =>
            setCreateForm((s) => ({ ...s, dueDate: e.target.value }))
          }
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600"
            onClick={() => {
              resetForm();
              setShowCreateModal(false);
            }}
          >
            Cancel
          </button>

            <button
              className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
              onClick={submit}
            >
              Create
            </button>
        </div>
      </div>
    </div>
  );
}


