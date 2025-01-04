"use client"

import { useState } from "react";
// import { useRouter } from "next/router";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     setIsClient(true); // Ensure the component is rendered client-side
//   }, []);
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        setError("Password does not match");
        console.log("Password does not match");
        return;
    }

    if (!employeeId || !department || !accountName || !password) {
        setError("Please fill in all required fields");
        console.log("Please fill in all required fields");
        return;
    } //else {
    //     console.log("Successfull Signup");
    // }

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emp_id: parseInt(employeeId),
          dept_name: department,
          acc_name: accountName,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok){
        setSuccessMessage("Signup successful! Redirecting to login page...");
        setTimeout(() => {
            window.location.href = "/login"; // This will navigate to the login page after 1 second
          }, 1000); // Wait for 1 second before redirecting
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.log("An unexpected error occurred:", error);
    }

    // setError("");
    // setSuccessMessage("Signup successful! Redirecting to login page...");
    // router.push("/login");  // redirect after successful signup
    // Redirect to /login page after successful signup
    // setTimeout(() => {
    //     window.location.href = "/login"; // This will navigate to the login page after 1 second
    //   }, 1000); // Wait for 1 second before redirecting
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-6">Join Taskly!</h2>
        <form onSubmit={handleSubmit} className="space-y-4"> 
          {/* First Name */}
          {/* <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
              required
            />
          </div> */}

          {/* Last Name */}
          {/* <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your last name"
              required
            />
          </div> */}

          {/* Employee ID */}
          <div>
            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Employee ID</label>
            <input
              type="text"
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your employee ID"
            //   required
            />
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your department"
            //   required
            />
          </div>

          {/* Account Name */}
          <div>
            <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">Account Name</label>
            <input
              type="text"
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your account name"
            //   required
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
              placeholder="Enter your password"
            //   required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
            //   required
            />
          </div>

          {/* Error or Success Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {successMessage ? (
              "Redirecting to Login..."
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
