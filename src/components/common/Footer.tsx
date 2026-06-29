export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-12">
      <div className="container-x flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <p className="caption text-[var(--color-fg-muted)]">
          © {new Date().getFullYear()} Lucas Fischer Paez · São Paulo, BR
        </p>
        <ul className="flex gap-6">
          <li>
            <a
              href="https://github.com/lucasf22games"
              target="_blank"
              rel="noreferrer"
              className="caption transition-colors hover:text-[var(--color-accent)]"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com/in/lucasfischerpaez"
              target="_blank"
              rel="noreferrer"
              className="caption transition-colors hover:text-[var(--color-accent)]"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="mailto:lucasf22games@gmail.com"
              className="caption transition-colors hover:text-[var(--color-accent)]"
            >
              Email
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
