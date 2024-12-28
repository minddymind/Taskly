'use client';

import { useState } from "react";

const Taskly = () => {
  const currentUser = { 
    name: "John", 
    surname: "Doe",
    avatar: `https://avatar.iran.liara.run/username?username=${"John"}+${"Doe"}`,
  };

  const [columns, setColumns] = useState({
    "To Do": [],
    "Doing": [],
    "Done": [],
  });
  const [isAdding, setIsAdding] = useState({});
  const [newTask, setNewTask] = useState("");
  const [showMembers, setShowMembers] = useState(false);

  const members = ["Alice", "Bob", "Charlie", "Diana"];

  const handleAddTask = (column) => {
    if (newTask.trim()) {
      setColumns({
        ...columns,
        [column]: [...columns[column], { id: `${column}-${Date.now()}`, name: newTask }],
      });
      setNewTask("");
      setIsAdding((prev) => ({ ...prev, [column]: false }));
    }
  };

  const handleEditTask = (column, taskId) => {
    const task = columns[column].find((task) => task.id === taskId);
    const newTaskName = prompt("Edit task name:", task.name);
    if (newTaskName) {
      setColumns({
        ...columns,
        [column]: columns[column].map((t) =>
          t.id === taskId ? { ...t, name: newTaskName } : t
        ),
      });
    }
  };

  const handleDeleteTask = (column, taskId) => {
    setColumns({
      ...columns,
      [column]: columns[column].filter((task) => task.id !== taskId),
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">Taskly</h1>
        <div className="flex items-center mb-6 border-t border-b border-gray-700 pt-4 pb-4">
          <img src={currentUser.avatar} alt="User Avatar" className="w-12 h-12 rounded-full mr-3" />
          <span className="text-xl font-semibold">{currentUser.name} {currentUser.surname}</span>
        </div>
        <ul>
          <li className="mb-4"><a href="/" className="hover:text-blue-500">Home</a></li>
          <li 
            className="mb-4 cursor-pointer hover:text-blue-500"
            onClick={() => setShowMembers(!showMembers)}
          >
            Members
          </li>
          {showMembers && (
            <ul className="ml-4 mt-2">
              {members.map((member, index) => (
                <li key={index} className="mb-1">{member}</li>
              ))}
            </ul>
          )}
          <li className="mb-4 cursor-pointer hover:text-blue-500">Settings</li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">HR Board</h2>
          <div className="flex items-center">
            <img src={currentUser.avatar} alt="User Avatar" className="w-8 h-8 rounded-full mr-2" />
            <span>{currentUser.name} {currentUser.surname}</span>
          </div>
        </header>

        {/* Board Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
          <div className="grid grid-cols-3 gap-8">
            {Object.keys(columns).map((column) => (
              <div key={column} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">{column}</h3>
                  <button
                    onClick={() => setIsAdding((prev) => ({ ...prev, [column]: !prev[column] }))}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                  >
                    + Add Task
                  </button>
                </div>
                {isAdding[column] && (
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Enter a task title"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                    />
                    <div className="flex justify-between">
                      <button
                        onClick={() => handleAddTask(column)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setIsAdding((prev) => ({ ...prev, [column]: false }))}
                        className="text-red-500 px-4 py-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
                <ul className="space-y-3">
                  {columns[column].map((task) => (
                    <li
                      key={task.id}
                      className="bg-gray-200 p-4 rounded-lg flex justify-between items-center transition-all hover:bg-gray-300"
                    >
                      <span className="text-gray-700">{task.name}</span>
                      <div className="space-x-4">
                        <button
                          onClick={() => handleEditTask(column, task.id)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(column, task.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Taskly;
