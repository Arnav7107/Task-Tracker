import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard({
  tasks,
  draggingId,
  onDragStart,
  onDragOver,
  onDrop,
  openTask,
  query,
}) {

  // ---- PRIORITY PILL (UI Helper) ----
  const priorityPill = (p) => {
    const base =
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";

    if (p === "high")
      return (
        <span
          className={`${base} bg-red-600/20 border border-red-600 text-red-300`}
        >
          High
        </span>
      );

    if (p === "medium")
      return (
        <span
          className={`${base} bg-yellow-600/20 border border-yellow-600 text-yellow-300`}
        >
          Medium
        </span>
      );

    return (
      <span
        className={`${base} bg-green-600/20 border border-green-600 text-green-300`}
      >
        Low
      </span>
    );
  };

  const statuses = [
    { key: "todo", label: "To Do" },
    { key: "in-progress", label: "In Progress" },
    { key: "done", label: "Done" },
  ];

  const tasksByStatus = (s) => tasks.filter((t) => t.status === s);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {statuses.map((col) => (
        <KanbanColumn
          key={col.key}
          title={col.label}
          statusKey={col.key}
          tasks={tasksByStatus(col.key)}
          query={query}
          onDragOver={onDragOver}
          onDrop={onDrop}
          draggingId={draggingId}
          onDragStart={onDragStart}
          openTask={openTask}
          priorityPill={priorityPill} 
        />
      ))}
    </div>
  );
}
