// import { useState } from "react";

// export default function TaskFilters({ filters, setFilters }) {
//   return (
//     <div className="flex items-center gap-3">
//       {/* Priority Filter */}
//       <select
//         value={filters.priority}
//         onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
//         className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm"
//       >
//         <option value="">Priority</option>
//         <option value="high">High</option>
//         <option value="medium">Medium</option>
//         <option value="low">Low</option>
//       </select>

//       {/* Status Filter */}
//       <select
//         value={filters.status}
//         onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
//         className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm"
//       >
//         <option value="">Status</option>
//         <option value="todo">To Do</option>
//         <option value="in-progress">In Progress</option>
//         <option value="done">Done</option>
//       </select>

//       {/* Due Date Filter */}
//       <select
//         value={filters.sort}
//         onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
//         className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm"
//       >
//         <option value="">Sort by Date</option>
//         <option value="latest">Latest First</option>
//         <option value="oldest">Oldest First</option>
//       </select>
//     </div>
//   );
// }



export default function TaskFilters({ filters, setFilters }) {
  return (
    <div className="flex gap-3">

      {/* Priority */}
      <select
        className="bg-neutral-900 border px-3 py-2 rounded"
        value={filters.priority}
        onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
      >
        <option value="">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Status */}
      <select
        className="bg-neutral-900 border px-3 py-2 rounded"
        value={filters.status}
        onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
      >
        <option value="">All Status</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {/* Due Date Sorting */}
      <select
        className="bg-neutral-900 border px-3 py-2 rounded"
        value={filters.order}
        onChange={(e) =>
          setFilters(f => ({
            ...f,
            sortBy: "dueDate",
            order: e.target.value
          }))
        }
      >
        <option value="">Sort by Due Date</option>
        <option value="asc">Oldest First</option>
        <option value="desc">Latest First</option>
      </select>
    </div>
  );
}
