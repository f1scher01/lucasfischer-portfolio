const LINKS = [
  { label: "GitHub", href: "https://github.com/f1scher01" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/lucasfischerpaez" },
  { label: "Email", href: "mailto:fischer.paez@gmail.com" },
  { label: "</> source", href: "https://github.com/f1scher01/lucasfischer-portfolio" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)] py-12">
      <div className="container-x flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <p className="caption text-[var(--color-fg-muted)]">
          © {new Date().getFullYear()} Lucas Fischer Paez · São Paulo
        </p>
        <ul className="flex flex-wrap gap-6">
          {LINKS.map((l) => {
            const external = l.href.startsWith("http");
            return (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="caption transition-colors hover:text-[var(--color-accent)]"
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
