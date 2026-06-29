import { ScrollReveal } from "@/components/common/ScrollReveal";

const GROUPS = [
  {
    title: "CAD/CAE",
    items: ["SolidWorks", "NX", "CATIA 3DExperience", "Fusion 360", "AutoCAD", "Ansys Workbench"],
  },
  {
    title: "Programming",
    items: ["Python", "MATLAB", "TypeScript", "React", "Three.js"],
  },
  {
    title: "Manufacturing",
    items: ["3D printing", "CNC machining"],
  },
  {
    title: "Languages",
    items: ["Português (native)", "Español (native)", "English (C1)", "Français (B1)"],
  },
];

export function Toolkit() {
  return (
    <section id="toolkit" className="border-t border-[var(--color-border)] py-32">
      <div className="container-x">
        <ScrollReveal className="mb-12 flex items-center gap-4">
          <span className="font-mono text-sm text-[var(--color-accent)]">03</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          <p className="caption text-[var(--color-fg-muted)]">Toolkit</p>
        </ScrollReveal>

        <ScrollReveal className="mb-16">
          <h2 className="font-display text-4xl md:text-6xl tracking-tight">
            Ferramentas
          </h2>
          <p className="mt-4 max-w-xl text-[var(--color-fg-muted)]">
            Cada ferramenta com aplicação real em projeto, não apenas vista em
            aula.
          </p>
        </ScrollReveal>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((g, i) => (
            <ScrollReveal key={g.title} delay={i * 0.06}>
              <div>
                <h3 className="caption mb-4 text-[var(--color-accent)]">
                  {g.title}
                </h3>
                <ul className="space-y-2">
                  {g.items.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-sm text-[var(--color-fg)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
