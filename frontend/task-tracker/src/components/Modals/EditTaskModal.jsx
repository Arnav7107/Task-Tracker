// import { isoToLocalInput, localToServerISO } from "../../utils/dateUtils";
// import { updateTask, deleteTask } from "../../api/tasksApi";

// export default function EditTaskModal({
//   activeTask,
//   editForm,
//   setEditForm,
//   close,
//   reload,
// }) {
//   if (!activeTask) return null;

//   const isChanged =
//     activeTask.title !== editForm.title ||
//     activeTask.description !== editForm.description ||
//     activeTask.priority !== editForm.priority ||
//     activeTask.status !== editForm.status ||
//     isoToLocalInput(activeTask.dueDate || "") !== editForm.dueDate;

//   async function save() {
//     const payload = {
//       ...editForm,
//       dueDate: editForm.dueDate ? localToServerISO(editForm.dueDate) : null,
//     };

//     await updateTask(activeTask._id, payload);
//     reload();
//     close();
//   }

//   async function remove() {
//     if (!confirm("Delete task?")) return;
//     await deleteTask(activeTask._id);
//     reload();
//     close();
//   }

//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
//       <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700 w-full max-w-lg">
//         <h2 className="text-xl font-semibold flex justify-between">
//           Task Details
//           {/* <span className="text-xs text-gray-400">{activeTask._id}</span> */}
//         </h2>

//         {/* Title */}
//         <label className="block text-sm mt-4">Title</label>
//         <input
//           className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
//           value={editForm.title}
//           onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
//         />

//         {/* Description */}
//         <label className="block text-sm mt-4">Description</label>
//         <textarea
//           className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
//           rows={3}
//           value={editForm.description}
//           onChange={(e) =>
//             setEditForm({ ...editForm, description: e.target.value })
//           }
//         />

//         {/* Priority + Status */}
//         <div className="grid grid-cols-2 gap-4 mt-4">
//           <div>
//             <label className="block text-sm">Priority</label>
//             <select
//               className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
//               value={editForm.priority}
//               onChange={(e) =>
//                 setEditForm({ ...editForm, priority: e.target.value })
//               }
//             >
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm">Status</label>
//             <select
//               className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
//               value={editForm.status}
//               onChange={(e) =>
//                 setEditForm({ ...editForm, status: e.target.value })
//               }
//             >
//               <option value="todo">To Do</option>
//               <option value="in-progress">In Progress</option>
//               <option value="done">Done</option>
//             </select>
//           </div>
//         </div>

//         {/* Due Date */}
//         <label className="block text-sm mt-4">Due Date</label>
//         <input
//           type="datetime-local"
//           className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
//           value={editForm.dueDate}
//           onChange={(e) =>
//             setEditForm({ ...editForm, dueDate: e.target.value })
//           }
//         />

//         {/* Buttons */}
//         <div className="flex justify-between mt-6">
//           <button
//             className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
//             onClick={remove}
//           >
//             Delete
//           </button>

//           <div className="flex gap-3">
//             <button
//               className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg"
//               onClick={close}
//             >
//               Close
//             </button>

//             <button
//               className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
//               disabled={!isChanged}
//               onClick={save}
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }








import { isoToLocalInput, localToServerISO } from "../../utils/dateUtils";
import { updateTask, deleteTask } from "../../api/tasksApi";
import { useState, useEffect } from "react";

export default function EditTaskModal({
  activeTask,
  editForm,
  setEditForm,
  close,
  reload,
}) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!activeTask) return null;

  // --------- FIX: Correct the due date when component mounts ---------
  useEffect(() => {
    if (activeTask?.dueDate) {
      setEditForm((prev) => ({
        ...prev,
        dueDate: isoToLocalInput(activeTask.dueDate),
      }));
    }
  }, [activeTask]);

  const isChanged =
    activeTask.title !== editForm.title ||
    activeTask.description !== editForm.description ||
    activeTask.priority !== editForm.priority ||
    activeTask.status !== editForm.status ||
    isoToLocalInput(activeTask.dueDate || "") !== editForm.dueDate;

  async function save() {
    const payload = {
      ...editForm,
      dueDate: editForm.dueDate ? localToServerISO(editForm.dueDate) : null,
    };

    await updateTask(activeTask._id, payload);
    reload();
    close();
  }

  async function confirmDelete() {
    await deleteTask(activeTask._id);
    reload();
    close();
  }

  return (
    <>
      {/* ---------------------- MAIN EDIT MODAL ---------------------- */}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
        <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700 w-full max-w-lg">
          <h2 className="text-xl font-semibold flex justify-between">
            Task Details
          </h2>

          {/* Title */}
          <label className="block text-sm mt-4">Title</label>
          <input
            className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          />

          {/* Description */}
          <label className="block text-sm mt-4">Description</label>
          <textarea
            className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
            rows={3}
            value={editForm.description}
            onChange={(e) =>
              setEditForm({ ...editForm, description: e.target.value })
            }
          />

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm">Priority</label>
              <select
                className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
                value={editForm.priority}
                onChange={(e) =>
                  setEditForm({ ...editForm, priority: e.target.value })
                }
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm">Status</label>
              <select
                className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value })
                }
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <label className="block text-sm mt-4">Due Date</label>
          <input
            type="datetime-local"
            className="w-full p-2 mt-1 bg-neutral-800 rounded border border-neutral-700"
            value={editForm.dueDate}
            onChange={(e) =>
              setEditForm({ ...editForm, dueDate: e.target.value })
            }
          />

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            {/* DELETE BUTTON OPENS CONFIRM MODAL */}
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
              onClick={() => setShowConfirmDelete(true)}
            >
              Delete
            </button>

            <div className="flex gap-3">
              <button
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg"
                onClick={close}
              >
                Close
              </button>

              <button
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
                disabled={!isChanged}
                onClick={save}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------- CONFIRM DELETE MODAL ---------------------- */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-700 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              Confirm Delete
            </h3>

            <p className="text-gray-300 text-sm mb-6">
              Are you sure you want to permanently delete this task?
            </p>

            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg"
                onClick={() => setShowConfirmDelete(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
