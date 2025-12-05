// import KanbanCard from "./KanbanCard";

// export default function KanbanColumn({
//   title,
//   statusKey,
//   tasks,
//   query,
//   onDragOver,
//   onDrop,
//   draggingId,
//   onDragStart,
//   openTask,
// }) {
//   return (
//     <div
//       onDragOver={onDragOver}
//       onDrop={(e) => onDrop(e, statusKey)}
//       className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 min-h-[250px] flex flex-col"
//     >
//       <h2 className="text-lg font-semibold flex justify-between mb-4">
//         {title}
//         <span className="text-gray-400 text-sm">{tasks.length}</span>
//       </h2>

//       <div className="space-y-3 flex-1 overflow-auto">
//         {tasks.map((task) => (
//           <KanbanCard
//             key={task._id}
//             task={task}
//             query={query}
//             draggingId={draggingId}
//             onDragStart={onDragStart}
//             openTask={openTask}
//           />
//         ))}

//         {tasks.length === 0 && (
//           <p className="text-xs text-gray-500 italic">No tasks</p>
//         )}
//       </div>
//     </div>
//   );
// }





import KanbanCard from "./KanbanCard";

export default function KanbanColumn({
  title,
  statusKey,
  tasks,
  query,
  onDragOver,
  onDrop,
  draggingId,
  onDragStart,
  openTask,
  priorityPill,     // <-- RECEIVE HERE
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, statusKey)}
      className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 min-h-[250px] flex flex-col"
    >
      <h2 className="text-lg font-semibold flex justify-between mb-4">
        {title}
        <span className="text-gray-400 text-sm">{tasks.length}</span>
      </h2>

      <div className="space-y-3 flex-1 overflow-auto">
        {tasks.map((task) => (
          <KanbanCard
            key={task._id}
            task={task}
            query={query}
            draggingId={draggingId}
            onDragStart={onDragStart}
            openTask={openTask}
            priorityPill={priorityPill}   // <-- PASS HERE
          />
        ))}

        {tasks.length === 0 && (
          <p className="text-xs text-gray-500 italic">No tasks</p>
        )}
      </div>
    </div>
  );
}
