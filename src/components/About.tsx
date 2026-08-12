export default function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-7xl px-8 py-24"
    >
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
        01 — About
      </p>

      <h2 className="text-4xl font-bold">
        About me
      </h2>

      <div className="mt-8 max-w-3xl text-lg leading-8 text-gray-400">
        <p>
          I am a Mathematics and Computer Science student at the
          University of Geneva, with a growing interest in cybersecurity,
          cryptography and quantum information.
        </p>

        <p className="mt-5">
          I am particularly interested in understanding the mathematical
          foundations behind secure systems and exploring how classical,
          post-quantum and quantum cryptography can address future
          cybersecurity challenges.
        </p>
      </div>
    </section>
  );
}