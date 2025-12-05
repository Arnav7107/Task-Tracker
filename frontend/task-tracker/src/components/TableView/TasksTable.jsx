import { highlightMatch } from "../../utils/highlight";

export default function TasksTable({ tasks, openTask, query }) {
  return (
    <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">All Tasks</h2>

      <table className="w-full text-left text-sm text-gray-300">
        <thead>
          <tr className="border-b border-neutral-700 text-gray-400">
            <th className="p-3">Title</th>
            <th className="p-3">Description</th>
            <th className="p-3">Priority</th>
            <th className="p-3">Status</th>
            <th className="p-3">Due Date</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr
              key={task._id}
              className="border-b border-neutral-800 hover:bg-neutral-800/50 cursor-pointer"
              onClick={() => openTask(task)}
            >
              <td className="p-3">{highlightMatch(task.title, query)}</td>

              <td className="p-3">
                {highlightMatch(task.description || "", query)}
              </td>

              <td className="p-3 capitalize">{task.priority}</td>
              <td className="p-3 capitalize">{task.status}</td>

              <td className="p-3">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleString("en-IN")
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tasks.length === 0 && (
        <p className="text-center text-gray-500 italic mt-4">
          No tasks found.
        </p>
      )}
    </div>
  );
}
