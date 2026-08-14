import BB84Demo from "@/components/BB84Demo";

export default function Projects() {
  return (
    <section
      id="projects"
      className="mx-auto max-w-7xl px-8 py-24"
    >
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
        04 — Projects
      </p>

      <h2 className="text-4xl font-bold">
        Selected projects
      </h2>

      <p className="mt-4 max-w-2xl text-gray-400">
        Projects where I turn concepts from mathematics and computer science
        into working implementations.
      </p>

      <div className="mt-10">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          
          <p className="text-sm font-medium uppercase tracking-widest text-blue-400">
            Quantum · Cryptography
          </p>

          <h3 className="mt-4 text-2xl font-semibold">
            BB84 Simulator
          </h3>

          <p className="mt-4 max-w-2xl leading-7 text-gray-400">
            Interactive educational simulation of the BB84 quantum key distribution
            protocol, from quantum-state preparation and basis reconciliation to
            intercept-resend attacks and QBER-based eavesdropping detection.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-gray-300">
              Python
            </span>

            <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-gray-300">
              QKD
            </span>

            <span className="rounded-full border border-white/10 px-3 py-1 text-sm text-gray-300">
              Quantum Cryptography
            </span>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-sm text-gray-500">
              CURRENT VERSION
            </p>

            <p className="mt-2 text-gray-300"> 
              V3 · Eve intercept-resend + QBER
            </p>

            <p className="mt-5 text-sm text-gray-500">
              NEXT UPDATE
            </p>

            <p className="mt-2 text-gray-300">
              V4 · Error correction
            </p>
          </div>
          <BB84Demo />

            <div className="mt-8">
            <a
                href="https://github.com/Vladcrmn/bb84-simulator"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 transition hover:text-blue-300"
            >
                View source on GitHub ↗
            </a>
            </div>


        </article>
      </div>
    </section>
  );
}