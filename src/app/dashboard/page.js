'use client';

import { useState } from "react";
import { PencilAltIcon, TrashIcon, LogoutIcon, HomeIcon, UsersIcon } from '@heroicons/react/outline'; // นำเข้าไอคอน Home และ Users

const Taskly = () => {
  const currentUser = { 
    name: "Alice", 
    surname: "Doe",
    avatar: `https://avatar.iran.liara.run/username?username=${"Alice"}+${"Doe"}`,
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
        [column]: [
          ...columns[column], 
          { 
            id: `${column}-${Date.now()}`, 
            name: newTask,
            user: `${currentUser.name} ${currentUser.surname}`  // เพิ่มชื่อผู้ใช้งาน
          }
        ],
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

  const handleLogout = () => {
    alert("Logging out..."); // เพิ่มการดำเนินการเมื่อ logout เช่น redirect หรือ clear session
  };

  // สีที่ใช้สำหรับ border ของแต่ละคอลัมน์
  const columnBorderColors = {
    "To Do": "bg-blue-500",
    "Doing": "bg-yellow-500",
    "Done": "bg-green-500",
  };

  return (
    <div className="flex h-screen text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col shadow-lg rounded-r-2xl backdrop-blur-md">
        <h1 className="text-4xl font-bold mb-8">Taskly</h1>
        <div className="flex items-center mb-6 border-t border-b border-gray-700 pt-4 pb-4">
          <img src={currentUser.avatar} alt="User Avatar" className="w-12 h-12 rounded-full mr-3" />
          <div>
            <span className="text-xl font-semibold">{currentUser.name} {currentUser.surname}</span>
            <span className="block text-sm text-gray-500 mt-1">ID: 650510655</span>
            <span className="block text-sm text-gray-500 mt">Human Resource</span>
          </div>
        </div>
        <ul>
          <li className="mb-4 flex items-center hover:text-blue-500 transition duration-200 ease-in-out">
            <HomeIcon className="w-5 h-5 mr-2" />
            <a href="/" className="hover:text-blue-500">Home</a>
          </li>
          <li 
            className="mb-4 cursor-pointer flex items-center hover:text-blue-500 transition duration-200 ease-in-out"
            onClick={() => setShowMembers(!showMembers)}
          >
            <UsersIcon className="w-5 h-5 mr-2" />
            Members
          </li>
          {showMembers && (
            <ul className="ml-4 mt-2">
              {members.map((member, index) => (
                <li key={index} className="mb-1">{member}</li>
              ))}
            </ul>
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white bg-opacity-70 backdrop-blur-md rounded-l-2xl">
        {/* Top Navbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 ml-4">HR Board</h2>
          <div className="flex items-center">
            <img src={currentUser.avatar} alt="User Avatar" className="w-8 h-8 rounded-full mr-2" />
            <span>{currentUser.name} {currentUser.surname}</span>
            <button
              onClick={handleLogout}
              className="ml-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
            >
              <LogoutIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Board Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-100 backdrop-blur-md">
          <div className="grid grid-cols-3 gap-8">
            {Object.keys(columns).map((column) => (
              <div
              key={column}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all backdrop-blur-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  {column} 
                  <span
                    className={`ml-2 text-sm text-white px-2 py-1 rounded-full ${columnBorderColors[column]}`}
                  >
                    {columns[column].length}
                  </span>
                </h3>
                <button
                  onClick={() => setIsAdding((prev) => ({ ...prev, [column]: !prev[column] }))}
                  className="bg-gray-700 text-white px-3 py-1 rounded-lg hover:bg-gray-900 transition"
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
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
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
              <ul className="space-y-3 overflow-auto">
                {columns[column].map((task) => (
                  <li
                    key={task.id}
                    className="bg-gray-200 p-4 rounded-lg flex justify-between items-center transition-all hover:bg-gray-300"
                  >
                    <span className="text-gray-700 break-words">{task.name}</span>
                    <span className="text-sm text-gray-500">{task.user}</span> {/* แสดงชื่อผู้ใช้งาน */}
                    <div className="space-x-4 flex items-center">
                      <button
                        onClick={() => handleEditTask(column, task.id)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <PencilAltIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(column, task.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <TrashIcon className="w-5 h-5" />
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
