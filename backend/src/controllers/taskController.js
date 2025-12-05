// const Task = require("../models/Task");

// // Create Task
// exports.createTask = async (req, res, next) => {
//   try {
//     const task = await Task.create(req.body);
//     res.status(201).json(task);
//   } catch (error) {
//     next(error);
//   }
// };

// // Get All Tasks (with filters)
// exports.getTasks = async (req, res, next) => {
//   try {
//     const { search, priority, status, due } = req.query;

//     const query = {};

//     // 🔎 Search Filter (title only)
//     if (search) {
//       query.title = { $regex: search, $options: "i" };
//     }

//     // 🚦 Priority Filter
//     if (priority) query.priority = priority;

//     // 📌 Status Filter
//     if (status) query.status = status;

//     // 📅 Due Date Filters
//     if (due) {
//       const now = new Date();
//       let start, end;

//       if (due === "today") {
//         start = new Date(now.setHours(0, 0, 0, 0));
//         end = new Date(now.setHours(23, 59, 59, 999));
//       }

//       else if (due === "tomorrow") {
//         const t = new Date();
//         t.setDate(t.getDate() + 1);
//         start = new Date(t.setHours(0, 0, 0, 0));
//         end = new Date(t.setHours(23, 59, 59, 999));
//       }

//       else if (due === "week") {
//   const now = new Date();

//   // Get the day of the week (0 = Sunday)
//   const day = now.getDay();

//   // Start of week (Sunday)
//   start = new Date(now);
//   start.setDate(now.getDate() - day);
//   start.setHours(0, 0, 0, 0);

//   // End of week (Saturday)
//   end = new Date(now);
//   end.setDate(now.getDate() + (6 - day));
//   end.setHours(23, 59, 59, 999);
// }


//       else if (due === "month") {
//         const today = new Date();
//         start = new Date(today.getFullYear(), today.getMonth(), 1);
//         end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
//       }

//       else if (due === "year") {
//         const y = new Date().getFullYear();
//         start = new Date(y, 0, 1);
//         end = new Date(y, 11, 31, 23, 59, 59, 999);
//       }

//       if (start && end) {
//         query.dueDate = { $gte: start, $lte: end };
//       }
//     }

//     // Default sorting - newest created first
//     const tasks = await Task.find(query).sort({ createdAt: -1 });

//     res.json(tasks);
//   } catch (error) {
//     next(error);
//   }
// };

// // Get Single Task
// exports.getTask = async (req, res, next) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     res.json(task);
//   } catch (error) {
//     next(error);
//   }
// };

// // Update Task
// exports.updateTask = async (req, res, next) => {
//   try {
//     const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updated)
//       return res.status(404).json({ message: "Task not found" });

//     res.json(updated);
//   } catch (error) {
//     next(error);
//   }
// };

// // Delete Task
// exports.deleteTask = async (req, res, next) => {
//   try {
//     const deleted = await Task.findByIdAndDelete(req.params.id);
//     if (!deleted)
//       return res.status(404).json({ message: "Task not found" });

//     res.json({ message: "Task deleted successfully" });
//   } catch (error) {
//     next(error);
//   }
// };




const Task = require("../models/Task");

// Create Task
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// Get All Tasks (with backend search + filters)
exports.getTasks = async (req, res, next) => {
  try {
    const { search, priority, status, due } = req.query;

    const query = {};

    // 🔎 SEARCH FILTER (title + description)
    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 🚦 PRIORITY FILTER
    if (priority) query.priority = priority;

    // 📌 STATUS FILTER
    if (status) query.status = status;

    // 📅 DUE DATE FILTERS
    if (due) {
      const now = new Date();
      let start, end;

      if (due === "today") {
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
      }

      else if (due === "tomorrow") {
        const t = new Date();
        t.setDate(t.getDate() + 1);
        start = new Date(t.setHours(0, 0, 0, 0));
        end = new Date(t.setHours(23, 59, 59, 999));
      }

      else if (due === "week") {
        const now2 = new Date();
        const day = now2.getDay();

        start = new Date(now2);
        start.setDate(now2.getDate() - day);
        start.setHours(0, 0, 0, 0);

        end = new Date(now2);
        end.setDate(now2.getDate() + (6 - day));
        end.setHours(23, 59, 59, 999);
      }

      else if (due === "month") {
        const today = new Date();
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
      }

      else if (due === "year") {
        const y = new Date().getFullYear();
        start = new Date(y, 0, 1);
        end = new Date(y, 11, 31, 23, 59, 59, 999);
      }

      // Apply date filter
      if (start && end) {
        query.dueDate = { $gte: start, $lte: end };
      }
    }

    // Default sorting → newest first
    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// Get Single Task
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Update Task
exports.updateTask = async (req, res, next) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Task not found" });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// Delete Task
exports.deleteTask = async (req, res, next) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
