import SignupForm from "./components/signupForm";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-4xl font-bold text-center text-blue-600 mb-6">Join Taskly!</h2>
        <SignupForm />
      </div>
    </div>
  );
}
