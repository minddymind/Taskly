export default function Home() {
  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 
      font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <h1 className="animate-slidein opacity-0 [--slidein-delay:300ms] sm:text-3xl md:text-3xl lg:text-6xl 
          relative w-[max-content] before:absolute before:inset-0 before:animate-typewriter before:bg-white after:absolute 
          after:inset-0 after:w-[0.125em] after:animate-caret after:bg-black">
            <b>Welcome to Taskly – Simplify Teamwork!</b>
          </h1>
        </div>
        <h4 className="animate-slidein opacity-0 [--slidein-delay:300ms]">
          Designed for small teams, Taskly helps you stay organized, focused,
          and connected.
        </h4>
        <div className="animate-slidein opacity-0 [--slidein-delay:500ms]">
          <p className="text-lg">🌟 Key Features</p>
          <ol className="list-disc list-inside text-lg">
            <li>Prioritize with Ease: Track tasks and deadlines effortlessly.</li>
            <li>Seamless Collaboration: Assign and manage tasks as a team.</li>
            <li>User-Friendly Interface: Simple and intuitive for everyone.</li>
            <li>Work Anywhere, Anytime: Accessible on desktop and mobile.</li>
          </ol>
        </div>
        <div className="animate-slidein opacity-0 [--slidein-delay:700ms]">
          <p className="mb-2 text-lg">🚀 Get Started Today!</p>
          <p className="mb-4">Join us to streamline your workflow and boost productivity.</p>
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <button className="bg-transparent hover:bg-blue-700 text-blue-700 font-semibold hover:text-white py-2 px-4 border 
            border-blue-500 hover:border-transparent rounded-full">
              Sign Up
            </button>
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full">
              Log in
            </button>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
