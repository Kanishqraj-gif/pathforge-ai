function Landing({ onStart }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      <div className="text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          PathForge AI
        </p>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Your career.
          <br />
          <span className="text-cyan-400">
            Reverse engineered.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-slate-400">
          Build a personalized path from where you are today to where you
          want to be.
        </p>

        <button
          onClick={onStart}
          className="mt-8 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Start Your Journey
        </button>
      </div>
    </main>
  );
}

export default Landing;