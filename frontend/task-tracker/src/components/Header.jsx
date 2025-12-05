export default function Header({ setSidebarOpen, setShowCreateModal }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950 sticky top-0 z-10">
      <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
        <svg className="w-7 h-7" stroke="currentColor" fill="none" viewBox="0 0 24 24">
          <path strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 className="text-xl font-semibold">Task Tracker</h1>

      <button
        onClick={() => setShowCreateModal(true)}
        className="hidden md:block px-4 py-2 bg-indigo-600 rounded-lg"
      >
        + New Task
      </button>
    </header>
  );
}
