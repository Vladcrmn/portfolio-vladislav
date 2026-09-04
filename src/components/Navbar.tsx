export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div className="text-xl font-bold tracking-wide">
        VC
      </div>

      <nav className="flex gap-6 text-sm text-gray-300">
        <a href="#about" className="transition hover:text-white">
          About
        </a>

        <a href="#education" className="transition hover:text-white">
          Education
        </a>

        <a href="#learning" className="transition hover:text-white">
        Learning
        </a>

        <a href="#projects" className="transition hover:text-white">
        Projects
        </a>

        <a href="#journey" className="transition hover:text-white">
          Journey
        </a>

        <a href="#skills" className="transition hover:text-white">
          Skills
        </a>

        <a href="#contact" className="transition hover:text-white">
          Contact
        </a>

        


      </nav>
    </header>
  );
}