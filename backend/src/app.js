const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const voiceRoutes = require("./routes/voiceRoutes"); 
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);
app.use("/api/voice", voiceRoutes);

app.use(errorHandler);

module.exports = app;
