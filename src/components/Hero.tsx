import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

export default function Hero() {
  return (
    <section className="mx-auto grid min-h-[85vh] max-w-7xl items-center gap-12 px-8 lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div>
        <p className="mb-4 text-lg text-blue-400">
          Hello, I&apos;m
        </p>

        <h1
        className={`${spaceGrotesk.className} text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl`}
        >
        <span className="block text-white">
            Vladislav
        </span>

        <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Carmona
        </span>
        </h1>

        <h2 className="mt-5 text-xl text-gray-300 sm:text-2xl">
          Mathematics & Computer Science Student
        </h2>

        <p className="mt-6 text-lg text-gray-400">
          Cybersecurity · Cryptography · Quantum Information
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
                  <a
          href="#journey"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500"
        >
          Explore my journey
        </a>

          <a
            href="/cv-vladislav-carmona.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-600 px-6 py-3 font-medium transition hover:border-white"
            >
            View CV
            </a>

          <a
            href="https://www.linkedin.com/in/vladislav-carmona-628ab324b/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-600 px-6 py-3 font-medium transition hover:border-white"
            >
            LinkedIn
            </a>

          <a
            href="https://github.com/Vladcrmn"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-600 px-6 py-3 font-medium transition hover:border-white"
            >
            GitHub
            </a>
        </div>
      </div>

    {/* RIGHT SIDE */}
    <div className="relative hidden h-[450px] items-center justify-center lg:flex">

     <div className="bloch-glow absolute h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

    <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-blue-300/30">

    <div className="absolute h-24 w-72 rounded-[50%] border border-blue-400/30" />

    <div className="bloch-spin absolute h-72 w-24 rounded-[50%] border border-purple-400/30" />

    <div className="bloch-spin-reverse absolute h-72 w-24 rotate-45 rounded-[50%] border border-cyan-400/20" />

    <div className="absolute h-[1px] w-80 bg-blue-300/20" />
    <div className="absolute h-80 w-[1px] bg-blue-300/20" />

    <div className="h-3 w-3 rounded-full bg-blue-300 shadow-[0_0_20px_rgba(96,165,250,0.8)]" />

    <div className="bloch-vector absolute left-1/2 top-1/2 h-[2px] w-[142px] origin-left bg-purple-300">
    <div className="absolute -right-2 -top-[7px] h-4 w-4 rounded-full bg-purple-300 shadow-[0_0_20px_rgba(216,180,254,0.9)]" />
    </div>

    <span className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 bg-[#08111f] px-2 text-sm text-gray-400">
      |0⟩
    </span>

    <span className="absolute -bottom-10 left-1/2 z-10 -translate-x-1/2 bg-[#08111f] px-2 text-sm text-gray-400">
      |1⟩
    </span>

  </div>

  <div className="absolute bottom-2 text-lg tracking-wide text-blue-300">
    |ψ⟩ = α|0⟩ + β|1⟩
  </div>

    </div>

    </section>
  );
}