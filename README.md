
# Task Tracker

Task Tracker is a full-stack task management system supporting **voice-based task creation**, **intelligent AI parsing**, **Kanban board** and **table view**.
Users can create tasks manually or speak naturally, and the system extracts **title, priority, status, and due date** from user's voice.

---

# 1. Project Setup

## 1.a Prerequisites

Ensure the following are installed:

| Requirement                            | Version                                                               |
| -------------------------------------- | --------------------------------------------------------------------- |
| **Node.js**                            | v18+                                                                  |
| **npm**                                | Latest                                                                |
| **MongoDB URI**                        | Atlas                                                                 |
| **Google Gemini API Key**              | Required for voice → text & parsing                                   |

---

## 1.b Installation Steps

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
MONGO_URI=<your mongodb connection string>
GOOGLE_API_KEY=<your gemini api key>
PORT=8000
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
cd task-tracker
npm install
```

Start frontend:

```bash
npm run dev
```

---

## 1.d Running the Entire Project Locally

| Service      | Command                            |
| ------------ | ---------------------------------- |
| **Backend**  | `npm run dev`                      |
| **Frontend** | `npm run dev`                      |


Visit frontend → `http://localhost:5173/`
API server → `http://localhost:8000/`

---


# 2. Tech Stack

## 2.a Frontend

* **React + Vite**
* **TailwindCSS**

## 2.b Backend

* **Node.js**
* **Express.js**

## 2.c Database

* **MongoDB** (Atlas)

## 2.d AI Provider

* **Google Gemini 2.5 Flash**
  Used for:

  * Speech-to-text
  * Intelligent parsing (title, due date, priority, status)


## 2.f Key Libraries

* `multer` (audio upload)
* `@google/genai` (Gemini SDK)
* `mongoose`
* `cors`

---

# 3. API Documentation

##  POST `/api/tasks` – Create Task

### Request Body

```json
{
  "title": "Buy groceries",
  "description": "Buy Groceries from the Supermarket",
  "priority": "high",
  "status": "todo",
  "dueDate": "2025-01-10T15:00"
}
```

### Response

```json
{
    "title": "Buy Groceries",
    "description": "Buy Groceries from the Supermarket",
    "priority": "high",
    "status": "todo",
    "dueDate": "2025-01-10T18:00:00.000Z",
    "_id": "693327769c920992cd69bd92",
    "createdAt": "2025-12-05T18:41:58.606Z",
    "updatedAt": "2025-12-05T18:41:58.606Z",
    "__v": 0
}
```

---

## GET `/api/tasks` – Get Tasks with Filters

### Query Params

| Param      | Example                                          | Description          |
| ---------- | ------------------------------------------------ | -------------------- |
| `search`   | `Buy Groceries`                                         | Searches title       |
| `priority` | `high`                                           | Filter by priority   |
| `status`   | `todo`                                           | Filter by status     |
| `due`      | `today` / `tomorrow` / `week` / `month` / `year` | Filter by due window |

### Example

```
GET /api/tasks?status=todo&priority=high&due=week
```

### Response

```json
[
  {
    "_id": "675abc",
    "title": "Prepare meeting agenda",
    "description": "Document the meeting agenda with the client",
    "priority": "high",
    "status": "todo",
    "dueDate": "2025-01-09T10:00:00.000Z"
  }
]
```

---

## PUT `/api/tasks/:id` – Update Task

### Body

```json
{ "status": "done" }
```

### Response

```json
{
    "_id": "693311a822f4efb83f1fb5aa",
    "title": "Review the pull request for authentication module",
    "description": "The Pull Request should be reviewwed before prod deployment",
    "priority": "high",
    "status": "in-progress",
    "dueDate": "2025-12-06T12:30",
    "createdAt": "2025-12-05T17:08",
    "updatedAt": "2025-12-05T18:23",
    "__v": 0
}
```

---

## DELETE `/api/tasks/:id` – Delete Task

```json
{ "message": "Task deleted successfully" }
```

---

## POST `/api/voice` – Voice Upload + AI Parsing

### FormData

`audio: voice.webm`

### Response

```json
{
  "transcript": "finish the project by tomorrow evening",
  "parsed": {
    "title": "Finish the project",
    "priority": "high",
    "status": "todo",
    "dueDate": "2025-01-05T18:00"
  }
}
```

---

# 4. Decisions & Assumptions

## 4.a Key Design Decisions

* **Backend filtering** instead of frontend for scalability.
* Used **enum validation** for priority + status to prevent noise.
* Voice recording handled entirely in frontend using MediaRecorder API.

---

## 4.b Assumptions


* Users may speak naturally; AI handles the interpretation.
* "This week" defined as **Sun–Sat**.

---

# 5. AI Tools Usage

## 5.a Tools Used

* **ChatGPT**
* **Github Copilot**

## 5.b What They Helped With

* Voice parsing prompts
* Debugging audio processing
* Creating regex-based backend filters
* Implementing Debounce Search

## 5.c Notable Prompts / Approaches

* "Extract structured task data from noisy speech."
* "Normalize relative dates like tomorrow / next Monday."

## 5.d What I Learned

* How to **debounce search** effectively in React.
* How to design **backend filtering logic** cleanly.
* How to build a reliable AI parsing pipeline.

---

