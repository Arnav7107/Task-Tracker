// import { useState } from "react";

// export default function TaskFilter({ filters, setFilters }) {
//   const handle = (field, value) => {
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   return (
//     <div className="flex gap-3 items-center">

//       {/* STATUS */}
//       <select
//         className="bg-neutral-900 border border-neutral-700 p-2 rounded-lg text-sm"
//         value={filters.status}
//         onChange={(e) => handle("status", e.target.value)}
//       >
//         <option value="">All Status</option>
//         <option value="todo">To Do</option>
//         <option value="in-progress">In Progress</option>
//         <option value="done">Done</option>
//       </select>

//       {/* PRIORITY */}
//       <select
//         className="bg-neutral-900 border border-neutral-700 p-2 rounded-lg text-sm"
//         value={filters.priority}
//         onChange={(e) => handle("priority", e.target.value)}
//       >
//         <option value="">All Priority</option>
//         <option value="low">Low</option>
//         <option value="medium">Medium</option>
//         <option value="high">High</option>
//       </select>

//       {/* SORT */}
//       <select
//         className="bg-neutral-900 border border-neutral-700 p-2 rounded-lg text-sm"
//         value={filters.sort}
//         onChange={(e) => handle("sort", e.target.value)}
//       >
//         <option value="">Sort by Due Date</option>
//         <option value="latest">Latest First</option>
//         <option value="oldest">Oldest First</option>
//       </select>
//     </div>
//   );
// }




import { useState } from "react";

export default function TaskFilter({ filters, setFilters }) {
  const handle = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex gap-3 items-center">

      {/* STATUS */}
      <select
        className="bg-neutral-900 border border-neutral-700 p-2 rounded-lg text-sm"
        value={filters.status}
        onChange={(e) => handle("status", e.target.value)}
      >
        <option value="">All Status</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {/* PRIORITY */}
      <select
        className="bg-neutral-900 border border-neutral-700 p-2 rounded-lg text-sm"
        value={filters.priority}
        onChange={(e) => handle("priority", e.target.value)}
      >
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* ⭐ NEW: DUE DATE RANGE FILTER */}
      <select
        className="bg-neutral-900 border border-neutral-700 p-2 rounded-lg text-sm"
        value={filters.due}
        onChange={(e) => handle("due", e.target.value)}
      >
        <option value="">All Due Dates</option>
        <option value="today">Today</option>
        <option value="tomorrow">Tomorrow</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>

    </div>
  );
}
