export default function Sidebar({ sidebarOpen, setSidebarOpen, setShowCreateModal, showView, setShowView }) {
  return (
    <>
      <div
        className={`fixed z-20 top-0 left-0 h-full w-64 bg-neutral-950 border-r border-neutral-800
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}
      >
        <div className="p-6 text-xl font-bold border-b border-neutral-800">TaskTracker</div>

        <nav className="p-6 space-y-3">
          <button className="w-full p-2 rounded hover:bg-neutral-800 text-left">Dashboard</button>
          <button className="w-full p-2 rounded hover:bg-neutral-800 text-left">All Tasks</button>

          <button
            className="w-full p-2 rounded hover:bg-neutral-800 text-left"
            onClick={() => setShowCreateModal(true)}
          >
            Add Task
          </button>

          <button className="w-full p-2 rounded hover:bg-neutral-800 text-left">
            Voice Input
          </button>

          <button
            className="w-full p-2 rounded hover:bg-neutral-800 text-left"
            onClick={() => setShowView(showView === "kanban" ? "table" : "kanban")}
          >
            {showView === "kanban" ? "Table View" : "Kanban View"}
          </button>
        </nav>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
