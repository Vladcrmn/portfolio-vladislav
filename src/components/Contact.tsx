const EMAIL = "vladislav_carmona@outlook.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/vladislav-carmona-628ab324b/";
const GITHUB_URL = "https://github.com/Vladcrmn";

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 17 17 7M8 7h9v9"
      />
    </svg>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 pb-28 pt-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-[#081522] px-6 py-12 sm:px-10 lg:px-14">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-blue-400">
                Contact
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Let&apos;s connect
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                I&apos;m open to internship opportunities, academic
                collaborations, and conversations about cybersecurity,
                cryptography, and quantum technologies.
              </p>

              <p className="mt-4 text-sm text-gray-500">
                Geneva, Switzerland
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center justify-between gap-3 rounded-xl bg-blue-500 px-5 py-3 font-medium text-white transition hover:bg-blue-400"
              >
                Send me an email
                <ArrowIcon />
              </a>

              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-medium text-gray-200 transition hover:border-blue-400/30 hover:bg-white/[0.07]"
              >
                View LinkedIn
                <ArrowIcon />
              </a>

              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-medium text-gray-200 transition hover:border-blue-400/30 hover:bg-white/[0.07]"
              >
                View GitHub
                <ArrowIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}