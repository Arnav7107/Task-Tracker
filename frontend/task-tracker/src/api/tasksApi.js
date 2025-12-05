// const API_BASE = "http://localhost:8000/api/tasks";

// export async function fetchTasks({ search = "", priority = "", status = "", sortBy = "", order = "" } = {}) {
//   const params = new URLSearchParams();

//   if (search.trim()) params.append("search", search.trim());
//   if (priority) params.append("priority", priority);
//   if (status) params.append("status", status);
//   if (sortBy) params.append("sortBy", sortBy);   
//   if (order) params.append("order", order);       // 

//   const url = `${API_BASE}?${params.toString()}`;
//   const res = await fetch(url);
//   return res.json();
// }

// export async function createTask(data) {
//   const res = await fetch(API_BASE, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// export async function updateTask(id, data) {
//   const res = await fetch(`${API_BASE}/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// export async function deleteTask(id) {
//   const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
//   return res.json();
// }




const API_BASE = "http://localhost:8000/api/tasks";

// 🆕 We now expect all filters inside a single object
export async function fetchTasks({
  search = "",
  priority = "",
  status = "",
  due = ""   // ⭐ NEW: due-range filter
} = {}) {
  
  const params = new URLSearchParams();

  // Attach filters only if present
  if (search.trim()) params.append("search", search.trim());
  if (priority) params.append("priority", priority);
  if (status) params.append("status", status);
  if (due) params.append("due", due);   // ⭐ SEND due range to backend

  const url = `${API_BASE}?${params.toString()}`;

  const res = await fetch(url);
  return res.json();
}

export async function createTask(data) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTask(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  return res.json();
}
