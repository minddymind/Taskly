"use client"

import { useState } from "react";
// import { useRouter } from "next/router";

export default function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const router = useRouter();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input
    if (!employeeId || !password) {
      setError("Please fill in all required fields");
      return;
    }

    // If validation passes, proceed to the next page
    setError("");
    // router.push("/");  // redirect after successful login
  };

  // Handle "Sign up" link click with delay
  const handleSignUpClick = () => {
    // Optionally show a success or informational message here
    // Simulate a delay before redirecting to the sign-up page
    setTimeout(() => {
      window.location.href = "/signup"; // Redirect to the signup page
    }, 1000); // 1000 milliseconds = 1 second
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-6">Welcome back to Taskly!</h2>
        <form onSubmit={handleSubmit} className="space-y-4"> 
          {/* Employee ID */}
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Employee ID</label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="employee ID"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="password"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            // disabled={!employeeId || !password}
          >
            Login
          </button>
          <div className="flex items-center justify-center">
            <p className="text-gray-600 text-center mr-2">No account?</p>
            <button onClick={handleSignUpClick} className="text-blue-600 hover:underline border-none">Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );
}
