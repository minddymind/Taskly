"use client"; // Ensures this component runs on the client side

import { useState } from "react";
import SignupInput from "./signupInput";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    employeeId: "",
    department: "",
    accountName: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // API Call (Signup Logic)
  const signupUser = async ({ employeeId, department, accountName, password }) => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emp_id: parseInt(employeeId),
          dept_name: department,
          acc_name: accountName,
          password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) return { success: true };
      return { success: false, message: data.message || "Something went wrong." };
    } catch (error) {
      return { success: false, message: "An unexpected error occurred." };
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.employeeId || !formData.department || !formData.accountName || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    const response = await signupUser(formData);
    if (response.success) {
      setSuccessMessage("Signup successful! Redirecting...");
      setTimeout(() => (window.location.href = "/login"), 1000);
    } else {
      setError(response.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <SignupInput label="Employee ID" type="text" id="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Enter your employee ID" />
      <SignupInput label="Department" type="text" id="department" value={formData.department} onChange={handleChange} placeholder="Enter your department" />
      <SignupInput label="Account Name" type="text" id="accountName" value={formData.accountName} onChange={handleChange} placeholder="Enter your account name" />
      <SignupInput label="Password" type="password" id="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
      <SignupInput label="Confirm Password" type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

      <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
        {successMessage ? "Redirecting..." : "Create Account"}
      </button>
    </form>
  );
}
