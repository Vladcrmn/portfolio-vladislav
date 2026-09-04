"use client";

import { useState } from "react";
import BB84Demo from "@/components/BB84Demo";
import DeutschJozsaDemo from "@/components/DeutschJozsaDemo";

type ProjectId = "bb84" | "deutsch-jozsa";

const projects = [
  {
    id: "bb84" as const,
    number: "01",
    category: "Quantum cryptography",
    title: "BB84 Simulator",
    description:
      "Explore quantum key distribution, basis reconciliation, eavesdropping detection, QBER and post-processing.",
    tags: ["QKD", "SHA-256", "Cryptography"],
    version: "V4 · Complete",
    accent: "blue",
    source: "https://github.com/Vladcrmn/bb84-simulator",
  },
  {
    id: "deutsch-jozsa" as const,
    number: "02",
    category: "Quantum algorithm",
    title: "Deutsch–Jozsa",
    description:
      "Build an oracle, observe phase kickback and use quantum interference to distinguish constant and balanced functions.",
    tags: ["Python", "NumPy", "Linear algebra"],
    version: "V1 · Complete",
    accent: "violet",
    source: "https://github.com/Vladcrmn/deutsch-jozsa",
  },
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<ProjectId>("bb84");
  const activeProject = projects.find((project) => project.id === selectedProject)!;

  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-blue-400">
        04 — Projects
      </p>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-4xl font-bold">Choose a project to explore</h2>
          <p className="mt-4 max-w-2xl leading-7 text-gray-400">
            Interactive implementations that turn ideas from mathematics,
            cryptography and quantum computing into experiments you can run.
          </p>
        </div>
        <p className="text-sm text-gray-500">{projects.length} interactive projects</p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2" role="tablist" aria-label="Interactive projects">
        {projects.map((project) => {
          const selected = project.id === selectedProject;
          const isViolet = project.accent === "violet";

          return (
            <button
              key={project.id}
              id={`project-tab-${project.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="project-panel"
              onClick={() => setSelectedProject(project.id)}
              className={`group relative overflow-hidden rounded-2xl border p-6 text-left transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                selected
                  ? isViolet
                    ? "border-violet-400/60 bg-violet-400/[0.08] shadow-[0_18px_60px_rgba(139,92,246,0.12)]"
                    : "border-blue-400/60 bg-blue-400/[0.08] shadow-[0_18px_60px_rgba(59,130,246,0.12)]"
                  : "border-white/10 bg-white/[0.025] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className={`text-xs font-medium uppercase tracking-[0.18em] ${isViolet ? "text-violet-300" : "text-blue-300"}`}>
                    {project.category}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{project.title}</h3>
                </div>
                <span className={`font-mono text-sm ${
                  selected ? (isViolet ? "text-violet-300" : "text-blue-300") : "text-gray-600"
                }`}>
                  {project.number}
                </span>
              </div>

              <p className="mt-4 min-h-20 leading-7 text-gray-400">{project.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-sm">
                <span className="text-gray-500">{project.version}</span>
                <span className={`transition group-hover:translate-x-1 ${isViolet ? "text-violet-300" : "text-blue-300"}`}>
                  {selected ? "Exploring now" : "Open project"} →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <article
        id="project-panel"
        role="tabpanel"
        aria-labelledby={`project-tab-${selectedProject}`}
        className="mt-6 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-8"
      >
        <div className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-gray-500">Selected experiment</p>
            <h3 className="mt-2 text-3xl font-semibold">{activeProject.title}</h3>
          </div>
          <a
            href={activeProject.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 transition hover:text-blue-300"
          >
            View source on GitHub ↗
          </a>
        </div>

        {selectedProject === "bb84" ? <BB84Demo /> : <DeutschJozsaDemo />}
      </article>
    </section>
  );
}
