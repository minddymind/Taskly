"use client";

import { useState, useEffect, useContext } from "react";
import { ProgressContext } from "./ProgressContext";
// import { getSession } from "next-auth/react";

export default function Tasks() {
  const [tasks, setTasks] = useState({ todayTasks: [], upcomingTasks: [] });
  const { setProgressUpdate } = useContext(ProgressContext);
  // const [session, setSession] = useState(null);

  // useEffect(() => {
  //   const fetchSession = async () => {
  //     const sessionData = await getSession();
  //     setSession(sessionData);
  //   };

  //   fetchSession();
  // }, []);

  useEffect(() => {
    const fetchUserAndTasks = async () => {
      try {
        // Fetch user info
        const userResponse = await fetch("/api/getUser");
        if (!userResponse.ok) throw new Error("Failed to fetch user");
        const userData = await userResponse.json();
        
        if (!userData.emp_id) {
          console.error("User data is missing emp_id:", userData);
          return;
        }
  
        console.log("Fetched User:", userData); // Debug log
  
        // Fetch today's tasks
        const todayResponse = await fetch(`/api/tasks/today?ownerId=${userData.emp_id}`);
        if (!todayResponse.ok) throw new Error("Failed to fetch today's tasks");
        const todayData = await todayResponse.json();
  
        // Fetch upcoming tasks
        const upcomingResponse = await fetch(`/api/tasks/upcoming?ownerId=${userData.emp_id}`);
        if (!upcomingResponse.ok) throw new Error("Failed to fetch upcoming tasks");
        const upcomingData = await upcomingResponse.json();
  
        console.log("Fetched Upcoming Tasks:", upcomingData); // Debug log
  
        setTasks({
          todayTasks: todayData.todayTasks || [],
          upcomingTasks: upcomingData.upcomingTasks || [],
        });
  
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    fetchUserAndTasks();
  }, []);

  const getDaysLeft = (deadline) => {
    const now = new Date();
    const taskDeadline = new Date(deadline);
    const timeDiff = taskDeadline - now;
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const handleTaskCompletion = async (taskId) => {
    if (!taskId) {
        console.error("Error: taskId is missing");
        return;
    }

    try {
        console.log("Sending request with taskId:", taskId); // Debugging log

        const response = await fetch("/api/tasks/updatepro", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId, progress_status: "completed" }),
        });

        const responseData = await response.json();
        console.log("API Response:", responseData); // Debugging log

        if (!response.ok) {
            console.error("API Error:", responseData);
            throw new Error(responseData.error || "Failed to update task");
        }

        // Update local state after successful response
        setTasks((prevTasks) => ({
            ...prevTasks,
            todayTasks: (prevTasks.todayTasks || []).filter((task) => task.todo_id !== taskId),
            upcomingTasks: (prevTasks.upcomingTasks || []).filter((task) => task.todo_id !== taskId),
        }));

        setProgressUpdate(prev => !prev);

    } catch (error) {
        console.error("Error updating task:", error);
    }
  };

  return (
    <div className="w-full lg:ml-6 mt-6 lg:mt-0">
      {/* Today’s Task */}
      <div className="bg-blue-100 shadow-md rounded-lg p-4 mb-6">
        <h3 className="font-bold text-lg mb-3 text-blue-700">Today’s Task 📌</h3>
        <ul>
          {tasks.todayTasks?.length > 0 ? (
            tasks.todayTasks.map((task) => (
              <li key={task.todo_id} className="py-2 flex items-center">
                {/* ✅ Checkbox to mark the task as completed */}
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={task.progress_status === "completed"}
                  onChange={() => {
                    if (task.todo_id) {
                      handleTaskCompletion(task.todo_id);
                    } else {
                      console.error("Error: Task ID is missing", task);
                    }
                  }}
                />
                {task.todo_title} - 
                <span className="text-gray-500">{new Date(task.deadline).toLocaleTimeString()}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No tasks for today.</p>
          )}
        </ul>
      </div>

      {/* Reminder */}
      <div className="bg-yellow-100 shadow-md rounded-lg p-4">
        <h3 className="font-bold text-lg mb-3 text-yellow-700">Reminder 🔔</h3>
        <ul>
          {tasks.upcomingTasks.length > 0 ? (
            tasks.upcomingTasks.map((task) => {
              console.log("Task in list:", task); // Debugging log
              return (
                <li key={task.id || task.todo_id || task.todo_title} className="py-2 flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={task.progress_status === "completed"}
                    onChange={() => {
                      if (task.id || task.todo_id ) {
                        handleTaskCompletion(task.id || task.todo_id );
                      } else {
                        console.error("Error: Task ID is missing", task);
                      }
                    }}
                  />
                  {task.todo_title} - 
                  <span className="text-gray-500">{new Date(task.deadline).toLocaleTimeString()}</span>
                  <span className="ml-2 text-red-500">{getDaysLeft(task.deadline)} days left</span>
                </li>
              );
            })
          ) : (
            <p className="text-gray-500">No upcoming tasks.</p>
          )}
        </ul>
      </div>
    </div>
  );
}