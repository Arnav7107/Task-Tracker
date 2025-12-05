import { useEffect, useState } from "react";
import { fetchTasks, updateTask } from "../api/tasksApi";

export default function useTasks(searchTerm, filters) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadTasks() {
    setLoading(true);

    // 🔥 Merge searchTerm into backend filters
    const data = await fetchTasks({
      ...filters,
      search: searchTerm,   // ⭐ CRUCIAL FIX
    });

    setTasks(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, [searchTerm, filters]);

  const updateStatus = async (id, newStatus) => {
    await updateTask(id, { status: newStatus });
    loadTasks();
  };

  return { tasks, setTasks, loading, updateStatus, reload: loadTasks };
}
