'use client';

import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { PencilAltIcon, TrashIcon, LogoutIcon, HomeIcon, UsersIcon, ClipboardListIcon } from '@heroicons/react/outline'; // นำเข้าไอคอน Home และ Users

const Taskly = () => {

  const [currentUser, setCurrentUser] = useState(null);
  const [columns, setColumns] = useState({
    "To Do": [],
    "Doing": [],
    "Done": [],
  });
  const [isAdding, setIsAdding] = useState({});
  const [newTask, setNewTask] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("../api/getUser");
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();

        const userDeptResponse = await fetch(`../api/user?id=${data.emp_id}`);
        if (!userDeptResponse.ok) throw new Error("Failed to fetch user department");
        const userDept = await userDeptResponse.json();

        setCurrentUser({
          ...data,
          department: userDept?.department || "Unknow Department", // เพิ่มชื่อแผนก
          members: userDept?.members || ["No members found"], // เพิ่มรายชื่อสมาชิกแผนก
          avatar: `https://avatar.iran.liara.run/username?username=${data.acc_name}`
        });
      } catch (error) {
        // console.error("An error occurred while fetching the user:", error);
        console.log("An error occurred while fetching the user:",error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`../api/tasks/owned?ownerId=${currentUser?.emp_id}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const tasks = await response.json();

        const groupedTasks = {
          "To Do": tasks.filter((task) => task.progress_status === 'to_do'),
          "Doing": tasks.filter((task) => task.progress_status === 'in_progress'),
          "Done": tasks.filter((task) => task.progress_status === 'completed'),
        };

        setColumns(groupedTasks);
      } catch (error) {
        // console.error('Error fetching tasks:', error);
        console.log('Error fetching tasks:',error);
      }
    };

    if (currentUser) fetchTasks();
  }, [currentUser]);

  const handleAddTask = async (column) => {
    if (newTask.trim() && currentUser) {
      try {
        const response = await fetch('../api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            todo_title: newTask,
            progress_status: column.replace(' ', '_').toLowerCase(),
            owner_id: currentUser.emp_id,
            deadline: deadline, // Add the deadline to the request body
          }),
        });
  
        if (!response.ok) throw new Error('Failed to add task');
  
        const createdTask = await response.json();
  
        setColumns((prevColumns) => ({
          ...prevColumns,
          [column]: [
            ...prevColumns[column],
            {
              id: createdTask.todo_id,
              name: createdTask.todo_title,
              user: createdTask.owner_id,
              deadline: createdTask.deadline, // Store deadline in the task
            },
          ],
        }));
  
        setNewTask('');
        setDeadline(''); // Reset the deadline after task is added
        setIsAdding((prev) => ({ ...prev, [column]: false }));
      } catch (error) {
        console.log('Error adding task:', error);
      }
    }
  };
  

  const handleEditTask = async (column, taskId) => {
    if (!taskId) {
      console.log("Task ID is undefined");
      return;
    }
  
    const task = columns[column]?.find(
      (task) => task.id === taskId || task.todo_id === taskId
    );
  
    if (!task) {
      console.log("Task not found or missing ID");
      return;
    }
  
    // Use SweetAlert2 for better UX
    const { value: newTaskName } = await Swal.fire({
      title: "Edit Task Title",
      input: "text",
      inputValue: task.name,
      showCancelButton: true,
      inputPlaceholder: "Enter new task title",
    });
  
    if (!newTaskName) {
      console.log("Task title edit canceled.");
      return;
    }
  
    try {
      const response = await fetch(`../api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todo_title: newTaskName,
          progress_status: column.replace(" ", "_").toLowerCase(),
          user_id: currentUser.emp_id,
        }),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("API Error:", errorDetails);
        throw new Error("Failed to edit task");
      }
  
      const updatedTask = await response.json();
  
      setColumns((prevColumns) => ({
        ...prevColumns,
        [column]: prevColumns[column].map((t) =>
          t.id === taskId || t.todo_id === taskId
            ? {
                ...t,
                name: updatedTask.todo_title,
                todo_title: updatedTask.todo_title,
              }
            : t
        ),
      }));
  
      Swal.fire("Success", "Task updated successfully!", "success");
    } catch (error) {
      console.error("Error editing task:", error);
      Swal.fire("Error", "Failed to edit the task. Please try again.", "error");
    }
  };
  

  const handleDeleteTask = async (column, taskId) => {
    try {
      const response = await fetch(`../api/tasks/${taskId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Failed to delete task');
  
      setColumns((prevColumns) => ({
        ...prevColumns,
        [column]: prevColumns[column].filter((task) => task.id !== taskId && task.todo_id !== taskId),
      }));
    } catch (error) {
      console.log('Error deleting task:', error);
    }
  };

  const handleLogout = () => {
    // alert("Logging out..."); // เพิ่มการดำเนินการเมื่อ logout เช่น redirect หรือ clear session
    // signOut({ callbackUrl: "/login" });

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to log out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7066e0',
      cancelButtonColor: '#545454',
      confirmButtonText: 'Yes, log out!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with logout action
        // Add your logout logic here
        console.log('Logging out...');
        signOut({ callbackUrl: "/" });
        // For example: redirect to login page or clear user data
      }
    });
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
        {currentUser ? (
          <div className="flex items-center mb-6 border-t border-b border-gray-700 pt-4 pb-4">
            <img src={currentUser.avatar} alt="User Avatar" className="w-12 h-12 rounded-full mr-3" />
            <div>
              <span className="text-xl font-semibold">{currentUser.acc_name}</span>
              <span className="block text-sm text-gray-500 mt-1">ID: {currentUser.emp_id}</span>
              <span className="block text-sm text-gray-500 mt">{currentUser.department}</span>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Loading user...</div>
        )}
        <ul>
          <li className="mb-4 flex items-center hover:text-blue-500 transition duration-200 ease-in-out">
            <HomeIcon className="w-5 h-5 mr-2" />
            <a href="/dashboard" className="hover:text-blue-500">Dashboard</a>
          </li>
          <li className="mb-4 cursor-pointer flex items-center hover:text-blue-500 transition duration-200 ease-in-out">
            <ClipboardListIcon className="h-6 w-6 mr-1" />
            <a href="/task" className="hover:text-blue-500">Tasks</a>
          </li>
          <li
            className="mb-4 cursor-pointer flex items-center hover:text-blue-500 transition duration-200 ease-in-out"
            onClick={() => setShowMembers(!showMembers)}
          >
            <UsersIcon className="w-5 h-5 mr-2" />
            Members
          </li>
          {currentUser ? (
            <div>
              {showMembers && (
                <ul className="ml-4 mt-2">
                  {currentUser.members.map((member, index) => (
                    <li key={index} className="mb-1">{member}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="text-gray-500">Loading members...</div>
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white bg-opacity-70 backdrop-blur-md rounded-l-2xl">
        {/* Top Navbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          {currentUser ? (
            <h2 className="text-xl font-semibold text-gray-800 ml-4">{currentUser.department} Board</h2>
          ) : (
            <div className="text-gray-500">Loading department...</div>
          )}
          {currentUser ? (
            <div className="flex items-center">
              <img src={currentUser.avatar} alt="User Avatar" className="w-8 h-8 rounded-full mr-2" />
              <span>{currentUser.acc_name}</span>
              <button
                onClick={handleLogout}
                className="ml-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              >
                <LogoutIcon className="w-5 h-5 cursor-pointer" href="/"/>
              </button>
            </div>
          ) : (
            <div className="text-gray-500">Loading user...</div>
          )}
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
                    <input
                      type="datetime-local"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
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
                  {columns[column].map((task, index) => (
                    <li
                    key={task.id || task.todo_id || index}
                    className="bg-gray-200 p-4 rounded-lg flex justify-between items-center transition-all hover:bg-gray-300"
                  >
                    <div>
                      <span className="text-gray-700 break-words">{task.name || task.todo_title}</span>
                      {task.deadline && (
                        <p className="text-sm text-gray-500">Deadline: {new Date(task.deadline).toLocaleString()}</p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">{task.user || task.owner_id}</span>
                      {currentUser?.emp_id === (task.user||task.owner_id) && (
                        <div className="space-x-4 flex items-center">
                          <button
                            onClick={() => handleEditTask(column, task.id || task.todo_id)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <PencilAltIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              Swal.fire({
                                title: "Are you sure?",
                                text: "This action cannot be undone.",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#7066e0",
                                cancelButtonColor: "#545454",
                                confirmButtonText: "Yes, delete it!",
                                cancelButtonText: "Cancel",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  handleDeleteTask(column, task.id || task.todo_id);
                                  Swal.fire("Deleted!", "Your task has been deleted.", "success");
                                }
                              });
                            }}
                            className="text-red-500 hover:text-red-600"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      )}
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