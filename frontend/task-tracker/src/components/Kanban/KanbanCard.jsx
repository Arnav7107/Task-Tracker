import { highlightMatch } from "../../utils/highlight";

export default function KanbanCard({
  task,
  query,
  draggingId,
  onDragStart,
  openTask,
  priorityPill
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      onClick={() => openTask(task)}
      className={`p-4 bg-neutral-800 rounded-lg border border-neutral-700 cursor-pointer 
      hover:scale-[1.01] transition ${
        draggingId === task._id ? "opacity-50" : ""
      }`}
    >
      {/* -------- TOP ROW: Title + Priority -------- */}
      <div className="flex items-start justify-between">
        
        {/* Title */}
        <p className="font-medium text-white w-[65%] leading-tight">
          {highlightMatch(task.title, query)}
        </p>

        {/* Priority + Due Date */}
        <div className="flex flex-col items-end">
          {/* Priority pill */}
          <div className="mb-1">
            {priorityPill(task.priority)}
          </div>

          {/* Due Date */}
          <p className="text-[11px] text-gray-300 font-medium">
            {task.dueDate
             ?new Date(task.dueDate).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour: "2-digit",
              minute: "2-digit",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour12: true,
            })

              : "No due date"}
          </p>
        </div>

      </div>

      {/* -------- DESCRIPTION (less gap from title) -------- */}
      <p className="text-xs text-gray-400 mt-1.5">
        {highlightMatch(task.description?.slice(0, 80), query)}
      </p>
    </div>
  );
}
