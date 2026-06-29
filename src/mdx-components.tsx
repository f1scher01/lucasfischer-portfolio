import type { MDXComponents } from "mdx/types";

/**
 * Componentes globais para MDX (App Router exige este arquivo na raiz do src).
 * H2/H3 em Fraunces (token --font-editorial) conforme o design system.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="font-editorial mt-12 mb-4 text-3xl tracking-tight md:text-4xl"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="font-editorial mt-8 mb-3 text-2xl tracking-tight md:text-3xl"
        {...props}
      />
    ),
    p: (props) => (
      <p
        className="mt-4 leading-relaxed text-[var(--color-fg-muted)]"
        {...props}
      />
    ),
    ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-6" {...props} />,
    a: (props) => (
      <a className="text-[var(--color-accent)] underline" {...props} />
    ),
    ...components,
  };
}
