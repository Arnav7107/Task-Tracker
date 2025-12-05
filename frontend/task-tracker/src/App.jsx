
import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";

import KanbanBoard from "./components/Kanban/KanbanBoard";
import TasksTable from "./components/TableView/TasksTable";

import CreateTaskModal from "./components/Modals/CreateTaskModal";
import EditTaskModal from "./components/Modals/EditTaskModal";

import useSearch from "./hooks/useSearch";
import useTasks from "./hooks/useTasks";

import TaskFilter from "./components/TaskFilter";


export default function App() {
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showView, setShowView] = useState("kanban");

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    due: "",
  });

  const { input: searchText, setInput: setSearchText, debounced } = useSearch();

   

  const { tasks, loading, updateStatus, reload, setTasks } = useTasks(
    debounced.trim(),
    filters
  );

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [activeTask, setActiveTask] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const [draggingId, setDraggingId] = useState(null);

  const openTask = (task) => {
    setActiveTask(task);
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.slice(0, 16) : "",
    });
  };

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("text", id);
    setDraggingId(id);
  };

  const onDrop = (e, newStatus) => {
    const id = e.dataTransfer.getData("text");
    updateStatus(id, newStatus);
    setDraggingId(null);
  };

  return (
    <div className="flex min-h-screen bg-black text-gray-200">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setShowCreateModal={setShowCreateModal}
        showView={showView}
        setShowView={setShowView}
      />

      <div className="flex-1 md:ml-64">
        <Header setSidebarOpen={setSidebarOpen} setShowCreateModal={setShowCreateModal} />

        <main className="p-6">
          {/* Search + Stats */}
          {/* <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 text-sm">
              {loading ? "Loading..." : `${tasks.length} tasks`}
            </span>

            <SearchBar
              searchText={searchText}
              setSearchText={setSearchText}
              debounced={debounced}
            />
          </div> */}

          <div className="flex justify-between items-center mb-6">

          <span className="text-gray-400 text-sm">
            {loading ? "Loading..." : `${tasks.length} tasks`}
          </span>

          <div className="flex items-center gap-4">
            <SearchBar
              searchText={searchText}
              setSearchText={setSearchText}
              debounced={debounced}
            />

            {/* ⭐ NEW FILTER COMPONENT */}
            <TaskFilter filters={filters} setFilters={setFilters} />
          </div>
        </div>

          {/* Views */}
          {showView === "kanban" ? (
            <KanbanBoard
              tasks={tasks}
              draggingId={draggingId}
              onDragStart={onDragStart}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              openTask={openTask}
              query={debounced}
            />
          ) : (
            <TasksTable tasks={tasks} openTask={openTask} query={debounced} />
          )}
        </main>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateTaskModal
          createForm={ createForm }
          setCreateForm={setCreateForm}
          reload={reload}
          setShowCreateModal={setShowCreateModal}
        />
      )}

      {activeTask && editForm && (
        <EditTaskModal
          activeTask={activeTask}
          editForm={editForm}
          setEditForm={setEditForm}
          reload={reload}
          close={() => {
            setActiveTask(null);
            setEditForm(null);
          }}
        />
      )}
    </div>
  );
}
